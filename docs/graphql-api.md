# GraphQL API — Especificação de Implementação

> Documento de referência para o frontend implementar a API GraphQL gerada pelo iGRP Spring Engine.

---

## Índice

1. [Visão Geral](#visão-geral)
2. [Manifesto GraphQL Schema](#manifesto-graphql-schema)
3. [Manifesto GraphQL Type (DTO)](#manifesto-graphql-type-dto)
4. [Manifesto GraphQL Input (DTO)](#manifesto-graphql-input-dto)
5. [Pipeline de Geração](#pipeline-de-geração)
6. [Arquivos Gerados](#arquivos-gerados)
7. [Mapeamento de Tipos](#mapeamento-de-tipos)
8. [Exemplos Completos](#exemplos-completos)
9. [Validações e Regras](#validações-e-regras)

---

## Visão Geral

O Spring Engine gera automaticamente toda a infraestrutura GraphQL a partir de manifests JSON. O fluxo é:

```
Manifests JSON (.igrpstudio/)
        ↓
  addGraphQLSchema()
        ↓
  Arquivo .graphqls  +  Classes Java (Resolver, Service, Types)
```

A API GraphQL suporta **Queries**, **Mutations**, **Subscriptions** e paginação automática (cursor-based via Relay Connection).

---

## Manifesto GraphQL Schema

**Localização**: `.igrpstudio/<module>/graphql/<Name>.json`

### Estrutura Completa

```json
{
  "type": "graphql",
  "name": "Product",
  "module": "catalog",
  "typeRef": "Product",
  "queries": [
    {
      "name": "findProductById",
      "params": [
        {"name": "id", "type": "uuid", "required": true}
      ],
      "returnType": "Product",
      "collectionType": "single"
    },
    {
      "name": "findAllProducts",
      "returnType": "Product",
      "collectionType": "list"
    },
    {
      "name": "findProductsPage",
      "params": [
        {"name": "filter", "type": "ProductFilterInput", "required": false}
      ],
      "returnType": "Product",
      "collectionType": "paginated"
    }
  ],
  "mutations": [
    {
      "name": "createProduct",
      "params": [
        {"name": "input", "type": "CreateProductInput", "required": true}
      ],
      "returnType": "Product"
    },
    {
      "name": "updateProduct",
      "params": [
        {"name": "id",    "type": "uuid",                "required": true},
        {"name": "input", "type": "UpdateProductInput",  "required": true}
      ],
      "returnType": "Product"
    },
    {
      "name": "deleteProduct",
      "params": [
        {"name": "id", "type": "uuid", "required": true}
      ],
      "returnType": "Boolean"
    }
  ]
}
```

### Campos do Schema

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `type` | `"graphql"` | Sim | Tipo do manifesto — sempre `"graphql"` |
| `name` | `string` | Sim | Nome do schema (PascalCase, ex: `Product`) |
| `module` | `string` | Não | Módulo alvo (default: `shared`) |
| `typeRef` | `string` | Não | Nome do manifesto `graphqlType` principal |
| `queries` | `GraphQLQuery[]` | Não | Lista de queries |
| `mutations` | `GraphQLMutation[]` | Não | Lista de mutations |
| `subscriptions` | `GraphQLSubscription[]` | Não | Lista de subscriptions |

> **Nota:** `inputRefs` foi removido da API. O engine detecta automaticamente os DTO input usados examinando os `params` de cada operação — qualquer `type` em PascalCase que referencie um manifesto `graphqlInput` é carregado automaticamente.

### Definição de Parâmetro (`GraphQLParam`)

Todos os tipos de operação (query, mutation, subscription) usam o mesmo tipo de parâmetro:

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `name` | `string` | Sim | Nome do parâmetro (camelCase) |
| `type` | `string` | Sim | Tipo engine em minúsculas (`uuid`, `string`) **ou** nome PascalCase de um DTO (`CreateProductInput`) |
| `required` | `boolean` | Não | Se obrigatório no schema (default: `false`) |

**Regra de tipo:**
- `type` em minúsculas → tipo escalar engine (ex: `uuid` → `ID!`, `string` → `String`)
- `type` em PascalCase → referência a um manifesto DTO (ex: `CreateProductInput` → carregado de `.igrpstudio/`)

### Definição de Query (`GraphQLQuery`)

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `name` | `string` | Sim | Nome da operação (camelCase) |
| `params` | `GraphQLParam[]` | Não | Argumentos da query |
| `returnType` | `string` | Não | Tipo de retorno — nome do `graphqlType` (ex: `Product`) ou escalar GraphQL (`Boolean`, `String`) |
| `collectionType` | `"single"` \| `"list"` \| `"paginated"` | Não | Formato da coleção (default: `"single"`) |
| `roles` | `string[]` | Não | Roles de acesso (ex: `["ADMIN", "MANAGER"]`) |
| `permission` | `PermissionsConfig` | Não | Permissões por item (`items`, `operator`) |

### Definição de Mutation (`GraphQLMutation`)

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `name` | `string` | Sim | Nome da operação (camelCase) |
| `params` | `GraphQLParam[]` | Não | Argumentos da mutation |
| `returnType` | `string` | Não | Tipo de retorno |
| `roles` | `string[]` | Não | Roles de acesso |
| `permission` | `PermissionsConfig` | Não | Permissões por item |

> **Nota:** `collectionType` foi removido de mutations — mutations sempre retornam um único objeto ou escalar.

### Definição de Subscription (`GraphQLSubscription`)

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `name` | `string` | Sim | Nome da operação (camelCase) |
| `params` | `GraphQLParam[]` | Não | Argumentos do filtro de subscription |
| `returnType` | `string` | Não | Tipo de retorno (padrão: nome do schema) |

### Comportamento de `collectionType` (apenas em queries)

| Valor | Retorno GraphQL SDL | Retorno Java |
|-------|---------------------|--------------|
| `"single"` | `Product` | `Product` |
| `"list"` | `[Product!]!` | `List<Product>` |
| `"paginated"` | `ProductConnection!` | `ProductConnection` (Relay) |

Para `collectionType: "paginated"`, os argumentos `sort: SortInput` e `page: PageInput` são **sempre gerados automaticamente** no SDL e no resolver — não precisam ser declarados em `params`. O array `params` serve apenas para filtros adicionais (ex: `filter: ProductFilterInput`).

---

## Manifesto GraphQL Type (DTO)

**Localização**: `.igrpstudio/<module>/graphql/types/<Name>.json`

**Propósito**: Define a forma dos objetos retornados pelas queries.

### Estrutura Completa

```json
{
  "type": "graphqlType",
  "name": "Product",
  "module": "catalog",
  "template": "classic",
  "attributes": [
    {
      "name": "id",
      "objectType": "java",
      "type": "uuid",
      "required": true,
      "primaryKey": true
    },
    {
      "name": "name",
      "objectType": "java",
      "type": "string",
      "required": true
    },
    {
      "name": "price",
      "objectType": "java",
      "type": "double",
      "required": true
    },
    {
      "name": "active",
      "objectType": "java",
      "type": "boolean",
      "required": false
    },
    {
      "name": "category",
      "objectType": "graphqlType",
      "type": "Category",
      "required": false,
      "module": "shared"
    },
    {
      "name": "items",
      "objectType": "graphqlType",
      "type": "OrderItem",
      "required": false,
      "collectionType": "list",
      "module": "orders"
    }
  ]
}
```

### Campos do Type

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `type` | `"graphqlType"` | Sim | Tipo do manifesto |
| `name` | `string` | Sim | Nome do tipo (PascalCase) |
| `module` | `string` | Não | Módulo onde o tipo vive |
| `template` | `"classic"` \| `"record"` | Não | Estilo Java gerado |
| `attributes` | `Attribute[]` | Sim | Campos do tipo |

### Campos de Atributo

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `name` | `string` | Sim | Nome do campo |
| `objectType` | `"java"` \| `"graphqlType"` | Sim | Tipo primitivo ou relação |
| `type` | `string` | Sim | Tipo engine ou nome do graphqlType |
| `required` | `boolean` | Não | Campo obrigatório no schema |
| `primaryKey` | `boolean` | Não | Marca como chave primária |
| `collectionType` | `"list"` | Não | Para atributos do tipo lista |
| `module` | `string` | Não | Módulo do tipo referenciado (cross-module) |
| `idType` | `string` | Não | Tipo do ID da relação (default: `"uuid"`) |

### Padrão DataLoader para Relações

Atributos com `objectType: "graphqlType"` são renderizados como campos de ID no Java, seguindo o padrão DataLoader:

```
Atributo: category (graphqlType, single)
  → Campo Java:    UUID categoryId
  → Campo GraphQL: category: Category

Atributo: items (graphqlType, list)
  → Campo Java:    List<UUID> itemIds
  → Campo GraphQL: items: [OrderItem!]!
```

---

## Manifesto GraphQL Input (DTO)

**Localização**: `.igrpstudio/<module>/graphql/types/<Name>.json`

**Propósito**: Define os objetos de entrada das mutations. **Apenas atributos primitivos** (`objectType: "java"`).

### Estrutura Completa

```json
{
  "type": "graphqlInput",
  "name": "CreateProductInput",
  "module": "catalog",
  "template": "classic",
  "attributes": [
    {
      "name": "name",
      "objectType": "java",
      "type": "string",
      "required": true,
      "maxLength": 255
    },
    {
      "name": "price",
      "objectType": "java",
      "type": "double",
      "required": true
    },
    {
      "name": "categoryId",
      "objectType": "java",
      "type": "uuid",
      "required": false
    }
  ]
}
```

### Restrições de Validação Suportadas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `required` | `boolean` | Gera `@NotNull` / `@NotBlank` |
| `maxLength` | `number` | Gera `@Size(max = N)` |
| `minLength` | `number` | Gera `@Size(min = N)` |

---

## Pipeline de Geração

### Função de Entrada

```typescript
addGraphQLSchema(config: GraphQLSchemaConfig, basePath: string): Promise<void>
```

### Etapas do Pipeline

```
1. Limpeza (Cleaner)
   └── Remove propriedades extras do manifesto

2. Validação (Validator)
   └── Valida o manifesto contra o JSON Schema GraphQLSchemaConfig

3. Carregamento da Config Base
   └── Lê a configuração de API do projeto

4. Normalização do Nome
   └── Converte name para PascalCase

5. Validação do Módulo
   └── Verifica se o módulo especificado existe

6. Enriquecimento de Contexto
   ├── Carrega o manifesto do typeRef (resolvedTypeManifest)
   ├── Auto-deriva inputs: varre params de todas as operações,
   │   carrega manifests de tipos PascalCase com type='graphqlInput'
   └── Gera Connection manifest automático se houver collectionType: 'paginated'

7. Geração de Arquivos
   ├── .graphqls (schema SDL)
   ├── Fragmentos de tipos referenciados
   ├── Resolver Java
   ├── (Technical) Interface de Serviço + Implementação
   ├── (Domain) Query/QueryHandler + Command/CommandHandler
   └── Tipos Connection/Edge (se paginado)

8. Salvar Manifesto
   └── .igrpstudio/<module>/graphql/<Name>.json
```

### Regras de Re-geração

| Arquivo | Comportamento |
|---------|---------------|
| `.graphqls` | **Sempre** sobrescrito |
| `*Resolver.java` | **Sempre** sobrescrito |
| `I*GraphQLService.java` | **Sempre** sobrescrito |
| `*GraphQLService.java` | Gerado **apenas uma vez** (não sobrescreve) |
| `*QueryHandler.java` | Gerado **apenas uma vez** (não sobrescreve) |
| `*CommandHandler.java` | Gerado **apenas uma vez** (não sobrescreve) |
| Fragmentos de tipo referenciado | Gerado **apenas se não existir** |

---

## Arquivos Gerados

### Estilo Technical

```
src/main/resources/graphql/
├── Product.graphqls                          ← Schema SDL
└── Category.graphqls                         ← Fragmento de tipo referenciado

src/main/java/<group>/<pkg>/
└── graphql/
    ├── product/
    │   ├── ProductResolver.java              ← @Controller Spring GraphQL
    │   ├── IProductGraphQLService.java       ← Interface de contrato
    │   └── ProductGraphQLService.java        ← Implementação (gerado 1x)
    ├── type/
    │   ├── Product.java
    │   ├── Category.java
    │   └── ...
    ├── input/
    │   ├── CreateProductInput.java
    │   └── UpdateProductInput.java
    └── connection/
        ├── ProductConnection.java            ← Gerado automaticamente (se paginado)
        ├── ProductEdge.java
        ├── PageInfo.java
        ├── SortInput.java
        └── PageInput.java

.igrpstudio/catalog/graphql/
├── Product.json                              ← Manifesto salvo
└── types/
    ├── Product.json
    ├── CreateProductInput.json
    └── UpdateProductInput.json
```

### Estilo Domain (DDD)

```
src/main/resources/graphql/
├── Product.graphqls
└── Category.graphqls

src/main/java/<group>/<pkg>/catalog/
├── interfaces/graphql/
│   ├── ProductResolver.java
│   ├── type/
│   │   ├── Product.java
│   │   └── Category.java
│   ├── input/
│   │   ├── CreateProductInput.java
│   │   └── UpdateProductInput.java
│   └── connection/
│       ├── ProductConnection.java
│       └── ProductEdge.java
└── application/
    ├── queries/
    │   ├── FindProductByIdQuery.java
    │   ├── FindProductByIdQueryHandler.java  ← Gerado 1x
    │   ├── FindAllProductsQuery.java
    │   ├── FindAllProductsQueryHandler.java  ← Gerado 1x
    │   ├── FindProductsPageQuery.java
    │   └── FindProductsPageQueryHandler.java ← Gerado 1x
    └── commands/
        ├── CreateProductCommand.java
        ├── CreateProductCommandHandler.java  ← Gerado 1x
        ├── UpdateProductCommand.java
        ├── UpdateProductCommandHandler.java  ← Gerado 1x
        ├── DeleteProductCommand.java
        └── DeleteProductCommandHandler.java  ← Gerado 1x
```

### Conteúdo do Arquivo `.graphqls` Gerado

Para o exemplo completo do `Product`, o schema SDL gerado é:

```graphql
type Product implements Node {
  id: ID!
  name: String!
  price: Float!
  active: Boolean
  category: Category
  items: [OrderItem!]!
}

input CreateProductInput {
  name: String!
  price: Float!
  categoryId: ID
}

input UpdateProductInput {
  name: String
  price: Float
}

type ProductEdge {
  node: Product!
  cursor: String!
}

type ProductConnection {
  edges: [ProductEdge!]!
  nodes: [Product!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type Query {
  findProductById(id: ID!): Product
  findAllProducts: [Product!]!
  findProductsPage(filter: ProductFilterInput, sort: SortInput, page: PageInput): ProductConnection!
}

type Mutation {
  createProduct(input: CreateProductInput!): Product
  updateProduct(id: ID!, input: UpdateProductInput!): Product
  deleteProduct(id: ID!): Boolean
}
```

---

## Mapeamento de Tipos

### Engine → GraphQL Scalar

| Tipo Engine | GraphQL Scalar |
|-------------|----------------|
| `uuid` | `ID` |
| `string`, `text`, `char` | `String` |
| `date`, `datetime`, `time`, `instant` | `String` |
| `uri`, `url`, `binary`, `file` | `String` |
| `integer`, `int`, `long`, `short` | `Int` |
| `float`, `double`, `decimal`, `bigdecimal` | `Float` |
| `boolean` | `Boolean` |

### Engine → Java

| Tipo Engine | Tipo Java |
|-------------|-----------|
| `uuid` | `UUID` |
| `string`, `text`, `char` | `String` |
| `date` | `String` |
| `datetime`, `instant` | `String` |
| `integer`, `int`, `short` | `Integer` |
| `long` | `Long` |
| `float` | `Float` |
| `double`, `decimal`, `bigdecimal` | `Double` |
| `boolean` | `Boolean` |

### Tipos PascalCase em `params`

Quando `type` em `params` começa com maiúscula e **não é** um escalar GraphQL conhecido (`Boolean`, `String`, `Int`, `Float`, `ID`, `Long`, `BigDecimal`, `DateTime`), o engine trata-o como referência a um DTO:

- No SDL: `input: CreateProductInput!` (usado diretamente)
- No Java (mutation): `@Argument @Valid CreateProductInput input`
- No Java (query): `@Argument ProductFilterInput filter`

O manifesto do DTO é carregado automaticamente de `.igrpstudio/<module>/graphql/types/<Name>.json`.

---

## Exemplos Completos

### Exemplo 1 — CRUD Simples (sem relações)

#### Manifests necessários

**`graphqlType`** — `.igrpstudio/inventory/graphql/types/Item.json`:
```json
{
  "type": "graphqlType",
  "name": "Item",
  "module": "inventory",
  "template": "classic",
  "attributes": [
    {"name": "id",       "objectType": "java", "type": "uuid",    "required": true, "primaryKey": true},
    {"name": "sku",      "objectType": "java", "type": "string",  "required": true},
    {"name": "quantity", "objectType": "java", "type": "integer", "required": true}
  ]
}
```

**`graphqlInput`** — `.igrpstudio/inventory/graphql/types/CreateItemInput.json`:
```json
{
  "type": "graphqlInput",
  "name": "CreateItemInput",
  "module": "inventory",
  "template": "classic",
  "attributes": [
    {"name": "sku",      "objectType": "java", "type": "string",  "required": true, "maxLength": 50},
    {"name": "quantity", "objectType": "java", "type": "integer", "required": true}
  ]
}
```

**`graphql` schema** — `.igrpstudio/inventory/graphql/Item.json`:
```json
{
  "type": "graphql",
  "name": "Item",
  "module": "inventory",
  "typeRef": "Item",
  "queries": [
    {
      "name": "findItemById",
      "params": [{"name": "id", "type": "uuid", "required": true}],
      "returnType": "Item",
      "collectionType": "single"
    },
    {
      "name": "findAllItems",
      "returnType": "Item",
      "collectionType": "list"
    }
  ],
  "mutations": [
    {
      "name": "createItem",
      "params": [{"name": "input", "type": "CreateItemInput", "required": true}],
      "returnType": "Item"
    },
    {
      "name": "deleteItem",
      "params": [{"name": "id", "type": "uuid", "required": true}],
      "returnType": "Boolean"
    }
  ]
}
```

> O engine detecta automaticamente que `CreateItemInput` é um DTO e carrega o manifesto — não é necessário declarar `inputRefs`.

#### Schema SDL gerado

```graphql
type Item implements Node {
  id: ID!
  sku: String!
  quantity: Int!
}

input CreateItemInput {
  sku: String!
  quantity: Int!
}

type Query {
  findItemById(id: ID!): Item
  findAllItems: [Item!]!
}

type Mutation {
  createItem(input: CreateItemInput!): Item
  deleteItem(id: ID!): Boolean
}
```

---

### Exemplo 2 — Com Paginação e Relações (DataLoader)

#### Manifests necessários

Pré-requisito — registrar os DTOs com `addDTO()` antes de `addGraphQLSchema()`:

```typescript
await addDTO(categoryType, basePath);          // graphqlType Category (module: shared)
await addDTO(productType,  basePath);          // graphqlType Product  (module: catalog)
await addDTO(createProductInput, basePath);    // graphqlInput
await addDTO(updateProductInput, basePath);    // graphqlInput
await addGraphQLSchema(productSchema, basePath);
```

**`graphqlType` Category** — `.igrpstudio/shared/graphql/types/Category.json`:
```json
{
  "type": "graphqlType",
  "name": "Category",
  "module": "shared",
  "template": "classic",
  "attributes": [
    {"name": "id",    "objectType": "java", "type": "uuid",   "required": true, "primaryKey": true},
    {"name": "label", "objectType": "java", "type": "string", "required": true}
  ]
}
```

**`graphqlType` Product** — `.igrpstudio/catalog/graphql/types/Product.json`:
```json
{
  "type": "graphqlType",
  "name": "Product",
  "module": "catalog",
  "template": "classic",
  "attributes": [
    {"name": "id",       "objectType": "java",        "type": "uuid",     "required": true, "primaryKey": true},
    {"name": "name",     "objectType": "java",        "type": "string",   "required": true},
    {"name": "price",    "objectType": "java",        "type": "double",   "required": true},
    {"name": "active",   "objectType": "java",        "type": "boolean",  "required": false},
    {"name": "category", "objectType": "graphqlType", "type": "Category", "required": false, "module": "shared"}
  ]
}
```

**Schema** — `.igrpstudio/catalog/graphql/Product.json`:
```json
{
  "type": "graphql",
  "name": "Product",
  "module": "catalog",
  "typeRef": "Product",
  "queries": [
    {
      "name": "findProductById",
      "params": [{"name": "id", "type": "uuid", "required": true}],
      "returnType": "Product",
      "collectionType": "single"
    },
    {
      "name": "findAllProducts",
      "returnType": "Product",
      "collectionType": "list"
    },
    {
      "name": "findProductsPage",
      "params": [{"name": "filter", "type": "ProductFilterInput", "required": false}],
      "returnType": "Product",
      "collectionType": "paginated"
    }
  ],
  "mutations": [
    {
      "name": "createProduct",
      "params": [{"name": "input", "type": "CreateProductInput", "required": true}],
      "returnType": "Product"
    },
    {
      "name": "updateProduct",
      "params": [
        {"name": "id",    "type": "uuid",                "required": true},
        {"name": "input", "type": "UpdateProductInput",  "required": true}
      ],
      "returnType": "Product"
    },
    {
      "name": "deleteProduct",
      "params": [{"name": "id", "type": "uuid", "required": true}],
      "returnType": "Boolean"
    }
  ]
}
```

#### Schema SDL gerado

```graphql
type Product implements Node {
  id: ID!
  name: String!
  price: Float!
  active: Boolean
  category: Category
}

type Category {
  id: ID!
  label: String!
}

input CreateProductInput {
  name: String!
  price: Float!
  categoryId: ID
}

input UpdateProductInput {
  name: String
  price: Float
}

type ProductEdge {
  node: Product!
  cursor: String!
}

type ProductConnection {
  edges: [ProductEdge!]!
  nodes: [Product!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type Query {
  findProductById(id: ID!): Product
  findAllProducts: [Product!]!
  findProductsPage(filter: ProductFilterInput, sort: SortInput, page: PageInput): ProductConnection!
}

type Mutation {
  createProduct(input: CreateProductInput!): Product
  updateProduct(id: ID!, input: UpdateProductInput!): Product
  deleteProduct(id: ID!): Boolean
}
```

#### Consultas GraphQL para o Frontend

```graphql
# Buscar produto por ID
query FindProductById($id: ID!) {
  findProductById(id: $id) {
    id
    name
    price
    active
    category {
      id
      label
    }
  }
}

# Listar todos
query FindAllProducts {
  findAllProducts {
    id
    name
    price
    active
  }
}

# Listagem paginada (Relay Connection)
query FindProductsPage($filter: ProductFilterInput, $sort: SortInput, $page: PageInput) {
  findProductsPage(filter: $filter, sort: $sort, page: $page) {
    edges {
      node {
        id
        name
        price
        active
      }
      cursor
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    totalCount
  }
}

# Criar produto
mutation CreateProduct($input: CreateProductInput!) {
  createProduct(input: $input) {
    id
    name
    price
  }
}

# Atualizar produto
mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {
  updateProduct(id: $id, input: $input) {
    id
    name
    price
  }
}

# Deletar produto
mutation DeleteProduct($id: ID!) {
  deleteProduct(id: $id)
}
```

---

### Exemplo 3 — Com Subscriptions

```json
{
  "type": "graphql",
  "name": "Order",
  "module": "orders",
  "typeRef": "Order",
  "queries": [
    {
      "name": "order",
      "params": [{"name": "id", "type": "uuid", "required": true}],
      "returnType": "Order",
      "collectionType": "single"
    }
  ],
  "mutations": [
    {
      "name": "createOrder",
      "params": [{"name": "input", "type": "CreateOrderInput", "required": true}],
      "returnType": "Order"
    }
  ],
  "subscriptions": [
    {
      "name": "orderUpdated",
      "params": [{"name": "orderId", "type": "uuid", "required": true}],
      "returnType": "Order"
    }
  ]
}
```

Schema SDL gerado para subscriptions:

```graphql
type Subscription {
  orderUpdated(orderId: ID!): Order
}
```

---

## Validações e Regras

### Regras de Nomenclatura

- `name`, `typeRef` devem seguir o padrão PascalCase (ex: `Product`, `CreateProductInput`)
- `module` deve seguir camelCase (ex: `catalog`, `shared`, `orders`)
- Nomes de queries, mutations e subscriptions devem seguir camelCase (ex: `findProductById`)
- Nomes de parâmetros e atributos devem seguir camelCase (ex: `categoryId`)
- `type` em `params`: minúsculas para escalares engine (`uuid`, `string`), PascalCase para DTOs (`CreateProductInput`)

### Escalares GraphQL Conhecidos

Os seguintes tipos em PascalCase **não** são tratados como DTOs — são escalares GraphQL diretos:

```
Boolean, String, Int, Float, ID, Long, BigDecimal, DateTime
```

Use-os em `returnType` para retornos escalares (ex: `"returnType": "Boolean"`).

### Erros de Validação

| Condição | Erro |
|----------|------|
| `type` diferente de `"graphql"` | Validation error |
| `name` ausente | Validation error |
| `typeRef` aponta para manifesto inexistente | Runtime error |
| DTO em `params.type` não encontrado em `.igrpstudio/` | Runtime error |
| Módulo especificado não existe no projeto | Runtime error |
| Propriedades extras no manifesto | Validation error (strict mode) |

### Paginação Automática (Relay Connection)

Quando uma query tem `collectionType: "paginated"`, o engine gera automaticamente:

1. Classe Java `<TypeRef>Connection.java`
2. Classe Java `<TypeRef>Edge.java`
3. Manifesto `.igrpstudio/<module>/graphql/types/<TypeRef>Connection.json`
4. Tipos `<TypeRef>Connection` e `<TypeRef>Edge` no arquivo `.graphqls`
5. Argumentos `sort: SortInput` e `page: PageInput` na assinatura da query

O tipo Connection gerado segue a especificação Relay:

```graphql
type ProductConnection {
  edges: [ProductEdge!]!
  nodes: [Product!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type ProductEdge {
  node: Product!
  cursor: String!
}
```

### Suporte a Módulos Cruzados (Cross-Module)

Atributos do tipo `graphqlType` podem referenciar tipos de outros módulos:

```json
{
  "name": "category",
  "objectType": "graphqlType",
  "type": "Category",
  "module": "shared"
}
```

O engine localiza o manifesto em `.igrpstudio/shared/graphql/types/Category.json` e gera o fragmento de schema correspondente se não existir.

---

*Gerado para o iGRP Spring Engine — branch `dev`*
