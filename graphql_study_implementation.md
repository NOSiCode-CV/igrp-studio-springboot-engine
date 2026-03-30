# Estudo Avançado e Especificação de Implementação GraphQL

Este documento serve como um guia definitivo sobre GraphQL, cobrindo teoria avançada, integração com Spring Boot e a especificação técnica para geração de código no Spring Engine.

---

## 1. Teoria Profunda: O Universo GraphQL

GraphQL não é apenas uma sintaxe de API, é um **Sistema de Tipos** (Type System) para seus dados.

### 1.1. O Sistema de Tipos (Schema Definition Language - SDL)

O coração do GraphQL é o Schema. Ele define o que é possível na API.

*   **Object Types & Fields:** A unidade básica. Representa um objeto com campos.
    ```graphql
    type Author {
        id: ID!
        name: String
        books: [Book] # Relacionamento
    }
    ```

*   **Scalar Types:** Os tipos primitivos (folhas da árvore).
    *   Padrão: `Int`, `Float`, `String`, `Boolean`, `ID`.
    *   Customizados: `Date`, `DateTime`, `JSON`, `BigDecimal` (Spring Boot suporta nativamente via configuração estendida).

*   **Enumeration Types (Enums):** Restringe um campo a um conjunto fixo de valores.
    ```graphql
    enum BookStatus {
        DRAFT
        PUBLISHED
        ARCHIVED
    }
    ```

*   **Lists e Non-Null:** Modificadores de tipo.
    *   `String`: Pode ser null.
    *   `String!`: **Não** pode ser null.
    *   `[String]`: Lista de strings (a lista pode ser null, itens podem ser null).
    *   `[String!]`: Lista onde os itens não são null.
    *   `[String!]!`: Lista não null de itens não null.

*   **Arguments:** Campos podem ter argumentos (como funções).
    ```graphql
    type Query {
        user(id: ID!): User
    }
    ```

### 1.2. Input Types vs Object Types (Conceito Crítico)

GraphQL faz uma distinção rígida entre objetos de **Saída** (Output) e objetos de **Entrada** (Input).
*   **Type (Output):** O que a query retorna. Pode conter lógica complexa e relacionamentos.
*   **Input (Input):** O que é enviado nos argumentos da query/mutation. Deve ser simples e serializável (JSON).

**Regra de Ouro:** Você **não pode** usar um `type User` como argumento. Você deve criar um `input UserInput`.

### 1.3. Interfaces e Unions (Polimorfismo)

*   **Interface:** Define campos comuns que tipos concretos devem implementar. Útil para retornar coleções de objetos diferentes que compartilham atributos.
    ```graphql
    interface Character {
        id: ID!
        name: String!
    }
    type Human implements Character { ... }
    type Droid implements Character { ... }
    ```

*   **Union:** Permite retornar um de vários tipos distintos, sem necessariamente compartilhar campos.
    ```graphql
    union SearchResult = Human | Droid | Starship
    ```

### 1.4. Operações

*   **Query:** Leitura (paralela).
*   **Mutation:** Escrita (sequencial).
*   **Subscription:** Eventos em tempo real (Streams).

---

## 2. Implementação no Spring Boot (Spring for GraphQL)

O Spring for GraphQL simplifica drasticamente a implementação usando o modelo de programação por anotações, similar ao Spring MVC.

### 2.1. Annotations Essenciais

*   `@Controller`: Marca a classe como handler GraphQL.
*   `@QueryMapping`: `Query` do schema -> Método Java.
    *   Se o nome do método for igual ao do campo no schema, o parâmetro `name` ou `value` é opcional.
*   `@MutationMapping`: `Mutation` do schema -> Método Java.
*   `@SchemaMapping`: Resolve um campo específico de um Tipo Pai. Essencial para resolver o problema N+1 ou campos calculados.
    ```java
    @SchemaMapping(typeName="Book", field="author")
    public Author getAuthor(Book book) { ... }
    ```
*   `@Argument`: Vincula argumentos do schema a parâmetros Java.
*   `@ProjectedPayload`: Usado para interfaces/projeções (avançado).

### 2.2. Tratamento de Erros

O GraphQL retorna `200 OK` mesmo com erros (no campo `errors` do JSON). O Spring permite customizar exceções via `DataFetcherExceptionResolver`.

---

## 3. Especificação de Implementação no Engine

Para suportar **todas** as situações, nosso JSON de configuração deve ser rico o suficiente para expressar a SDL.

### 3.1. Estrutura JSON Proposta (`GraphQLConfig`)

Precisamos de uma nova estrutura ou estender a `ControllerConfig`. Recomendo uma estrutura dedicada `GraphQLConfig` que possa referenciar DTOs existentes.

```typescript
export interface GraphQLConfig {
  type: 'graphql';
  name: string; // Nome do Controller (ex: UserGraphQL)
  module: string;
  basePath: string;
  
  // Definição das Operações
  queries?: GraphQLOperation[];
  mutations?: GraphQLOperation[];
  subscriptions?: GraphQLOperation[];
  
  // Tipos extras que não são DTOs do sistema (ex: Inputs específicos para filtros)
  customInputs?: GraphQLInputObject[]; 
}

export interface GraphQLOperation {
  name: string; // Nome da operação no Schema (ex: findUsers)
  description?: string;
  
  // Retorno
  returnType: string; // Nome do DTO, Scalar ou Tipo Customizado
  isList?: boolean; // Retorna array []?
  isNullable?: boolean; // Pode retornar null?
  listIsNullable?: boolean; // A lista em si pode ser null?
  
  // Argumentos
  args?: GraphQLArgument[];
}

export interface GraphQLArgument {
  name: string;
  type: string; // Scalar, Enum ou InputType
  description?: string;
  isRequired?: boolean;
  isList?: boolean;
  defaultValue?: string;
}

export interface GraphQLInputObject {
  name: string;
  attributes: GraphQLAttribute[];
}

export interface GraphQLAttribute {
  name: string;
  type: string;
  isRequired?: boolean;
  isList?: boolean;
}
```

### 3.2. Estratégia de Geração de Código

O Engine deve gerar dois artefatos principais:

1.  **O Schema (`src/main/resources/graphql/{module}/{name}.graphqls`):**
    *   Deve converter tipos Java para tipos GraphQL.
    *   Deve gerar definições `type`, `input`, `enum`, `query`, `mutation`.
    *   Deve detectar se um DTO é usado como retorno (`type`) ou argumento (`input`) e gerar as definições apropriadas (ex: `UserDTO` e `UserDTOInput` se necessário, ou usar prefixos).

2.  **O Controller Java (`src/main/java/.../controller/{name}Controller.java`):**
    *   Métodos anotados com `@QueryMapping`, `@MutationMapping`.
    *   Conversão automática de Inputs para DTOs se houver discrepância de nomes.

---

## 4. Exemplos Práticos: Do JSON ao Código

Aqui cobrimos cenários complexos para garantir que o JSON "aguente o tranco".

### Cenário Completo: Gestão de Livros (CRUD + Filtro + Paginação)

#### Entrada: JSON Configuration

```json
{
  "type": "graphql",
  "name": "BookGraphQL",
  "module": "library",
  "basePath": "/library",
  "customInputs": [
    {
      "name": "BookFilter",
      "attributes": [
        { "name": "titleContains", "type": "String" },
        { "name": "publishYear", "type": "Int" }
      ]
    }
  ],
  "queries": [
    {
      "name": "bookById",
      "returnType": "BookDTO",
      "isNullable": true,
      "args": [
        { "name": "id", "type": "ID", "isRequired": true }
      ]
    },
    {
      "name": "searchBooks",
      "returnType": "BookDTO",
      "isList": true,
      "isNullable": false, // A lista nunca é null, pode ser vazia
      "args": [
        { "name": "filter", "type": "BookFilter" },
        { "name": "page", "type": "Int", "defaultValue": "0" },
        { "name": "size", "type": "Int", "defaultValue": "10" }
      ]
    }
  ],
  "mutations": [
    {
      "name": "createBook",
      "returnType": "BookDTO",
      "isNullable": false,
      "args": [
        { "name": "input", "type": "CreateBookInput", "isRequired": true } 
        // CreateBookInput seria um DTO marcado como Input ou definido em customInputs
      ]
    }
  ]
}
```

#### Saída 1: Schema GraphQL (`book.graphqls`)

```graphql
# Tipos gerados a partir dos DTOs existentes (Engine deve varrer DTOs)
type BookDTO {
    id: ID!
    title: String
    author: String
    publishYear: Int
}

# Inputs gerados a partir de customInputs
input BookFilter {
    titleContains: String
    publishYear: Int
}

# Input gerado para Mutation (assumindo que CreateBookInput é um DTO)
input CreateBookInput {
    title: String!
    author: String!
    publishYear: Int!
}

type Query {
    # Busca por ID, retorno pode ser null
    bookById(id: ID!): BookDTO
    
    # Busca com filtro e paginação, retorna lista não-null
    searchBooks(filter: BookFilter, page: Int = 0, size: Int = 10): [BookDTO]!
}

type Mutation {
    createBook(input: CreateBookInput!): BookDTO!
}
```

#### Saída 2: Controller Java (`BookGraphQLController.java`)

```java
package cv.nosi.library.controller;

import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.stereotype.Controller;
import java.util.List;
import java.util.Optional;
// Imports...

@Controller
public class BookGraphQLController {

    private final IBookService bookService;

    public BookGraphQLController(IBookService bookService) {
        this.bookService = bookService;
    }

    @QueryMapping
    public BookDTO bookById(@Argument String id) {
        // Lógica de serviço
        return bookService.findById(id);
    }

    @QueryMapping
    public List<BookDTO> searchBooks(
            @Argument BookFilter filter, 
            @Argument Integer page, 
            @Argument Integer size
    ) {
        return bookService.search(filter, page, size);
    }

    @MutationMapping
    public BookDTO createBook(@Argument CreateBookInput input) {
        return bookService.create(input);
    }
}
```

### Cenário Avançado: Paginação Relay (Connection Pattern)

Se quisermos suportar paginação padrão do mercado (Relay), o JSON deve indicar isso.

**JSON:**
```json
{
  "queries": [
    {
      "name": "booksConnection",
      "returnType": "BookConnection", // Tipo especial
      "args": [ { "name": "first", "type": "Int" }, { "name": "after", "type": "String" } ]
    }
  ]
}
```

O Engine precisaria gerar automaticamente os tipos `BookConnection` e `BookEdge` no `.graphqls` se detectar o sufixo "Connection".

---

## 5. Próximos Passos de Implementação (Roadmap Técnico)

1.  **Definição de Interfaces (`src/interfaces/types.ts`):**
    *   Adicionar `GraphQLConfig` e estruturas auxiliares.
    *   Adicionar campo `isInput` ou `usage: 'input' | 'output' | 'both'` no `DTOConfig` para facilitar a geração correta de `type` vs `input`.

2.  **Mapeamento de Tipos (`src/utils/graphqlHelpers.ts`):**
    *   Criar função `toGraphQLType(javaType: string): string`.
    *   Mapear `Integer` -> `Int`, `BigDecimal` -> `Float`, `UUID` -> `ID` (se for chave primária) ou `String`.

3.  **Gerador de Schema (`generateGraphQLSchema.ts`):**
    *   Iterar sobre `GraphQLConfig`.
    *   Gerar string SDL concatenando definições.
    *   Resolver dependências de DTOs e gerar seus tipos correspondentes.

4.  **Gerador de Controller (`generateGraphQLController.ts`):**
    *   Usar Handlebars para gerar a classe Java.
    *   Injetar Services.

5.  **Integração no Pipeline:**
    *   Atualizar `newApi` ou `addModule` para aceitar geração GraphQL.
    *   Garantir dependências no `pom.xml`.

Este plano cobre desde a teoria básica até casos de uso complexos, garantindo que o Engine seja flexível e robusto.
