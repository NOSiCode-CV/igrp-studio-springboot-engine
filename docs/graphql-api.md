# GraphQL API — Guia de Configuração

> Referência completa para configurar e gerar APIs GraphQL com o iGRP Spring Engine.

---

## Índice

1. [Visão Geral](#visão-geral)
2. [Conceitos-Chave](#conceitos-chave)
3. [Manifesto GraphQL Schema](#manifesto-graphql-schema)
4. [GraphQLParam — Parâmetros de Operação](#graphqlparam--parâmetros-de-operação)
5. [GraphQLReturn — Tipo de Retorno](#graphqlreturn--tipo-de-retorno)
6. [Manifesto GraphQL Type (DTO)](#manifesto-graphql-type-dto)
7. [Manifesto GraphQL Input (DTO)](#manifesto-graphql-input-dto)
8. [Segurança — roles e permission](#segurança--roles-e-permission)
9. [Paginação Automática (Relay Connection)](#paginação-automática-relay-connection)
10. [Subscriptions](#subscriptions)
11. [Mapeamento de Tipos](#mapeamento-de-tipos)
12. [Arquivos Gerados](#arquivos-gerados)
13. [Exemplos Completos](#exemplos-completos)
14. [Regras de Validação](#regras-de-validação)

---

## Visão Geral

O engine gera toda a infraestrutura GraphQL a partir de três tipos de manifests JSON:

| Tipo de Manifest | Finalidade |
|-----------------|------------|
| `graphql` | Define as operações — queries, mutations, subscriptions |
| `graphqlType` | Define os tipos de retorno (objetos do schema) |
| `graphqlInput` | Define os tipos de entrada das mutations |

**Fluxo de geração:**

```
Manifests JSON (.igrpstudio/)
        ↓
  addGraphQLSchema()
        ↓
  ├── *.graphqls (schema SDL)
  ├── *Resolver.java
  ├── (Technical) IService + ServiceImpl
  └── (Domain) Query/QueryHandler + Command/CommandHandler
```

**Ordem de execução obrigatória:** os manifests de tipo devem ser criados com `addDTO()` **antes** de `addGraphQLSchema()`.

```typescript
// Ordem correta
await addDTO(productType,         basePath);   // graphqlType
await addDTO(createProductInput,  basePath);   // graphqlInput
await addGraphQLSchema(productSchema, basePath);
```

---

## Conceitos-Chave

### Tudo é explícito — sem convenções implícitas

O engine **não adivinha** o tipo de um parâmetro ou retorno pelo nome. Cada declaração usa um campo `objectType` para ser inequívoca:

**Em `params`:**

| `objectType` | Significado |
|-------------|-------------|
| `"java"` | Tipo escalar engine — `uuid`, `string`, `integer`, `boolean`, etc. |
| `"graphqlInput"` | Referência a um manifest `graphqlInput` (DTO de entrada) |

**Em `return`:**

| `objectType` | Significado |
|-------------|-------------|
| `"java"` | Escalar engine — `boolean`, `string`, etc. |
| `"graphqlType"` | Referência a um manifest `graphqlType` (objeto do schema) |

Este design é análogo ao padrão do controller, onde `requestParams` declara escalares e `requestBody` declara DTOs — a mesma lógica aplicada ao GraphQL.

---

## Manifesto GraphQL Schema

**Localização no disco:** `.igrpstudio/<module>/graphql/<Name>.json`

### Estrutura

```json
{
  "type": "graphql",
  "name": "Product",
  "module": "catalog",
  "typeRef": "Product",
  "queries": [...],
  "mutations": [...],
  "subscriptions": [...]
}
```

### Campos

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `type` | `"graphql"` | **Sim** | Sempre `"graphql"` |
| `name` | `string` | **Sim** | Nome do schema (PascalCase, ex: `Product`) |
| `module` | `string` | Não | Módulo alvo (default: `"shared"`) |
| `typeRef` | `string` | Não | Nome do manifest `graphqlType` principal — necessário para queries que retornam esse tipo |
| `queries` | `GraphQLQuery[]` | Não | Lista de queries |
| `mutations` | `GraphQLMutation[]` | Não | Lista de mutations |
| `subscriptions` | `GraphQLSubscription[]` | Não | Lista de subscriptions |

---

## GraphQLParam — Parâmetros de Operação

Todos os tipos de operação (query, mutation, subscription) partilham a mesma estrutura de parâmetro.

### Estrutura

```json
{
  "name": "id",
  "objectType": "java",
  "type": "uuid",
  "required": true
}
```

```json
{
  "name": "input",
  "objectType": "graphqlInput",
  "type": "CreateProductInput",
  "required": true,
  "module": "catalog"
}
```

### Campos

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `name` | `string` | **Sim** | Nome do argumento (camelCase) |
| `objectType` | `"java"` \| `"graphqlInput"` | **Sim** | Discriminador — veja tabela abaixo |
| `type` | `string` | **Sim** | Tipo engine (`uuid`, `string`) ou nome do DTO (`CreateProductInput`) |
| `required` | `boolean` | Não | Se o argumento é obrigatório no SDL (default: `false`) |
| `module` | `string` | Não | Módulo do DTO referenciado — usado quando o input é de outro módulo |

### Regra do `objectType` em params

```
objectType: "java"
  → type = tipo escalar engine em minúsculas
  → Exemplos: "uuid", "string", "integer", "boolean", "long"
  → SDL gerado: ID!, String!, Int, etc.

objectType: "graphqlInput"
  → type = nome PascalCase de um manifest graphqlInput
  → Exemplos: "CreateProductInput", "OrderFilterInput"
  → SDL gerado: CreateProductInput!
  → Java gerado: @Argument @Valid CreateProductInput input (mutations)
               @Argument ProductFilterInput filter (queries)
```

### Exemplo: parâmetros mistos

```json
"params": [
  {"name": "id",     "objectType": "java",         "type": "uuid",              "required": true},
  {"name": "filter", "objectType": "graphqlInput",  "type": "ProductFilterInput","required": false}
]
```

SDL gerado:
```graphql
findProducts(id: ID!, filter: ProductFilterInput): ...
```

---

## GraphQLReturn — Tipo de Retorno

Queries, mutations e subscriptions declaram seu retorno com o campo `return`. Se omitido, o nome do schema (`name`) é usado como fallback.

### Estrutura

```json
{
  "return": {
    "objectType": "graphqlType",
    "type": "Product",
    "module": "catalog"
  }
}
```

```json
{
  "return": {
    "objectType": "java",
    "type": "boolean"
  }
}
```

### Campos

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `objectType` | `"java"` \| `"graphqlType"` | **Sim** | Discriminador — veja tabela abaixo |
| `type` | `string` | **Sim** | Tipo engine (`boolean`, `string`) ou nome do graphqlType (`Product`) |
| `module` | `string` | Não | Módulo do tipo referenciado (cross-module) |

### Regra do `objectType` em return

```
objectType: "java"
  → type = tipo escalar engine
  → Exemplos: "boolean", "string", "integer"
  → SDL gerado: Boolean, String, Int
  → Java gerado: Boolean (sempre wrapper — válido em generics)

objectType: "graphqlType"
  → type = nome PascalCase de um manifest graphqlType
  → SDL gerado: depende de collectionType (veja abaixo)
  → Java gerado: Product | List<Product> | ProductConnection
```

### `collectionType` modifica o retorno (apenas em queries)

| `collectionType` | SDL gerado | Java gerado |
|-----------------|-----------|------------|
| `"single"` (default) | `Product` | `Product` |
| `"list"` | `[Product!]!` | `List<Product>` |
| `"paginated"` | `ProductConnection!` | `ProductConnection` |

```json
{
  "name": "findAllProducts",
  "return": {"objectType": "graphqlType", "type": "Product"},
  "collectionType": "list"
}
```

> `collectionType` **não existe** em mutations — mutations sempre retornam um único valor ou escalar.

---

## Manifesto GraphQL Type (DTO)

**Localização:** `.igrpstudio/<module>/graphql/types/<Name>.json`

Define os objetos retornados pelas queries.

### Estrutura

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
      "name": "tags",
      "objectType": "graphqlType",
      "type": "Tag",
      "required": false,
      "collectionType": "list",
      "module": "shared"
    }
  ]
}
```

### Campos de Atributo

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `name` | `string` | **Sim** | Nome do campo (camelCase) |
| `objectType` | `"java"` \| `"graphqlType"` | **Sim** | Tipo primitivo ou relação com outro graphqlType |
| `type` | `string` | **Sim** | Tipo engine ou nome do graphqlType referenciado |
| `required` | `boolean` | Não | Campo obrigatório no SDL |
| `primaryKey` | `boolean` | Não | Marca como chave primária (`id: ID!`) |
| `collectionType` | `"list"` | Não | Para atributos do tipo lista |
| `module` | `string` | Não | Módulo do tipo referenciado (cross-module) |
| `idType` | `string` | Não | Tipo do ID da relação (default: `"uuid"`) |
| `template` | `"classic"` \| `"record"` | Não | Estilo Java da classe gerada |

### Padrão DataLoader para relações

Atributos com `objectType: "graphqlType"` são armazenados como IDs no Java, seguindo o padrão DataLoader:

```
Atributo: category (graphqlType, single)
  → Campo Java:    UUID categoryId
  → Campo SDL:     category: Category

Atributo: tags (graphqlType, list)
  → Campo Java:    List<UUID> tagIds
  → Campo SDL:     tags: [Tag!]!
```

O resolver é responsável por resolver o ID → objeto via DataLoader.

---

## Manifesto GraphQL Input (DTO)

**Localização:** `.igrpstudio/<module>/graphql/types/<Name>.json`

Define os objetos de entrada das mutations. **Apenas atributos com `objectType: "java"`** — inputs não suportam relações.

### Estrutura

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

### Restrições de Validação

| Campo | Tipo | Bean Validation gerado |
|-------|------|------------------------|
| `required: true` | `boolean` | `@NotNull` / `@NotBlank` |
| `maxLength` | `number` | `@Size(max = N)` |
| `minLength` | `number` | `@Size(min = N)` |

---

## Segurança — `roles` e `permission`

**Ambos os campos são opcionais.** Se uma operação não declarar nem `roles` nem `permission`, o resolver é gerado sem nenhuma restrição de acesso — qualquer utilizador autenticado (ou anónimo, dependendo da config do Spring Security) pode chamar a operação.

Cada operação pode declarar controlo de acesso via `roles`, `permission`, ou ambos. Quando os dois estão presentes, são combinados com AND.

### `roles` — baseado em papéis Spring Security

```json
{
  "name": "products",
  "params": [...],
  "return": {"objectType": "graphqlType", "type": "Product"},
  "collectionType": "paginated",
  "roles": ["MANAGER", "ADMIN"]
}
```

Java gerado:
```java
@PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
```

`roles` é um array de strings livres — os valores são passados diretamente para `hasAnyRole(...)`. Qualquer nome de role Spring Security é válido.

### `permission` — baseado em permissões granulares

```json
{
  "name": "cancelOrder",
  "params": [{"name": "id", "objectType": "java", "type": "uuid", "required": true}],
  "return": {"objectType": "java", "type": "boolean"},
  "permission": {
    "items": ["ORDER_WRITE", "ORDER_ADMIN"],
    "operator": "OR"
  }
}
```

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `items` | `string[]` | Lista de permissões necessárias |
| `operator` | `"AND"` \| `"OR"` | Como combinar múltiplas permissões |

Java gerado (1 item):
```java
@PreAuthorize("@igrpAuthorization.checkPermission(T(Permission).ORDER_WRITE)")
```

Java gerado (múltiplos items, `OR`):
```java
@PreAuthorize("@igrpAuthorization.checkAnyPermission(T(Permission).ORDER_WRITE, T(Permission).ORDER_ADMIN)")
```

Java gerado (múltiplos items, `AND`):
```java
@PreAuthorize("@igrpAuthorization.checkAllPermission(T(Permission).ORDER_WRITE, T(Permission).ORDER_ADMIN)")
```

### Combinando `roles` e `permission`

Quando ambos são declarados na mesma operação, o Java gerado combina-os com `and`:

```json
{
  "name": "deleteProduct",
  "roles": ["ADMIN"],
  "permission": {"items": ["PRODUCT_DELETE"], "operator": "OR"}
}
```

Java gerado:
```java
@PreAuthorize("hasAnyRole('ADMIN') and @igrpAuthorization.checkPermission(T(Permission).PRODUCT_DELETE)")
```

---

## Paginação Automática (Relay Connection)

Quando uma query tem `collectionType: "paginated"`, o engine gera automaticamente toda a infraestrutura Relay Connection.

### O que é gerado automaticamente

1. Classe `ProductConnection.java` e `ProductEdge.java`
2. Manifest `.igrpstudio/<module>/graphql/types/ProductConnection.json`
3. Tipos `ProductConnection` e `ProductEdge` no `.graphqls`
4. Argumentos `sort: SortInput` e `page: PageInput` **injetados automaticamente** na assinatura da query

**Não declare `sort` ou `page` em `params`** — são sempre adicionados pelo engine.

O campo `params` em queries paginadas serve apenas para filtros adicionais:

```json
{
  "name": "findProductsPage",
  "params": [
    {"name": "filter", "objectType": "graphqlInput", "type": "ProductFilterInput", "required": false}
  ],
  "return": {"objectType": "graphqlType", "type": "Product"},
  "collectionType": "paginated"
}
```

SDL gerado:
```graphql
findProductsPage(filter: ProductFilterInput, sort: SortInput, page: PageInput): ProductConnection!
```

### Schema Connection gerado

```graphql
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
```

### Consulta paginada no frontend

```graphql
query FindProductsPage($filter: ProductFilterInput, $sort: SortInput, $page: PageInput) {
  findProductsPage(filter: $filter, sort: $sort, page: $page) {
    edges {
      node { id name price }
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
```

---

## Subscriptions

Subscriptions usam a mesma estrutura de `params` e `return` que queries e mutations.

```json
{
  "subscriptions": [
    {
      "name": "orderUpdated",
      "params": [
        {"name": "orderId", "objectType": "java", "type": "uuid", "required": true}
      ],
      "return": {"objectType": "graphqlType", "type": "Order"}
    }
  ]
}
```

SDL gerado:
```graphql
type Subscription {
  orderUpdated(orderId: ID!): Order
}
```

Java gerado (`OrderSubscriptionController.java`):
```java
@SubscriptionMapping
public Flux<Order> orderUpdated(@Argument UUID orderId) {
    return orderEventService.orderUpdatedStream(orderId);
}
```

O engine gera também `OrderEventService` (interface) e `OrderEventServiceImpl` (implementação base) com `Flux`.

---

## Mapeamento de Tipos

### Engine → GraphQL Scalar

| Tipo Engine (`objectType: "java"`) | GraphQL SDL |
|------------------------------------|------------|
| `uuid` | `ID` |
| `string`, `text`, `char` | `String` |
| `date`, `datetime`, `time`, `instant` | `String` |
| `uri`, `url`, `binary`, `file` | `String` |
| `integer`, `int`, `short` | `Int` |
| `long` | `Int` |
| `float` | `Float` |
| `double`, `decimal`, `bigdecimal` | `Float` |
| `boolean` | `Boolean` |

### Engine → Java

| Tipo Engine | Java (param / field) | Java (return / generic) |
|-------------|----------------------|-------------------------|
| `uuid` | `UUID` | `UUID` |
| `string`, `text`, `char` | `String` | `String` |
| `integer`, `int`, `short` | `Integer` | `Integer` |
| `long` | `Long` | `Long` |
| `float` | `Float` | `Float` |
| `double`, `decimal`, `bigdecimal` | `Double` | `Double` |
| `boolean` | `Boolean` | `Boolean` |

> Tipos primitivos Java (`boolean`, `int`, etc.) não podem ser usados em posições de tipo genérico (`CommandHandler<Cmd, boolean>` é inválido em Java). O engine sempre usa os wrappers (`Boolean`, `Integer`) em posições de retorno.

---

## Arquivos Gerados

### Estilo Technical

```
src/main/resources/graphql/
└── Product.graphqls

src/main/java/<group>/<pkg>/graphql/
├── product/
│   ├── ProductResolver.java           ← @Controller (sempre regenerado)
│   ├── IProductGraphQLService.java    ← interface (sempre regenerada)
│   └── ProductGraphQLService.java     ← implementação (gerado 1x)
├── type/
│   ├── Product.java
│   └── Category.java                  ← fragmento de tipo referenciado (gerado 1x)
├── input/
│   └── CreateProductInput.java
└── connection/
    ├── ProductConnection.java
    ├── ProductEdge.java
    ├── PageInfo.java
    ├── SortInput.java
    └── PageInput.java
```

### Estilo Domain (DDD)

```
src/main/resources/graphql/
└── Product.graphqls

src/main/java/<group>/<pkg>/catalog/
├── interfaces/graphql/
│   ├── ProductResolver.java            ← @Controller (sempre regenerado)
│   ├── type/
│   │   └── Product.java
│   ├── input/
│   │   └── CreateProductInput.java
│   └── connection/
│       ├── ProductConnection.java
│       └── ProductEdge.java
└── application/
    ├── queries/
    │   ├── FindProductByIdQuery.java
    │   ├── FindProductByIdQueryHandler.java   ← gerado 1x
    │   ├── FindAllProductsQuery.java
    │   └── FindAllProductsQueryHandler.java   ← gerado 1x
    └── commands/
        ├── CreateProductCommand.java
        ├── CreateProductCommandHandler.java   ← gerado 1x
        ├── DeleteProductCommand.java
        └── DeleteProductCommandHandler.java   ← gerado 1x
```

### Regras de re-geração

| Arquivo | Comportamento |
|---------|---------------|
| `*.graphqls` | Sempre sobrescrito |
| `*Resolver.java` | Sempre sobrescrito |
| `I*GraphQLService.java` | Sempre sobrescrita |
| `*GraphQLService.java` | Gerado **apenas uma vez** |
| `*QueryHandler.java` | Gerado **apenas uma vez** |
| `*CommandHandler.java` | Gerado **apenas uma vez** |
| Fragmentos de tipos referenciados | Gerado **apenas se não existir** |

---

## Exemplos Completos

### Exemplo 1 — CRUD simples, retorno escalar numa mutation

**Cenário:** gerenciar itens de inventário. A mutation `deleteItem` retorna `Boolean`.

#### Manifests

**`graphqlType` Item** — `.igrpstudio/inventory/graphql/types/Item.json`:
```json
{
  "type": "graphqlType",
  "name": "Item",
  "module": "inventory",
  "attributes": [
    {"name": "id",       "objectType": "java", "type": "uuid",    "required": true, "primaryKey": true},
    {"name": "sku",      "objectType": "java", "type": "string",  "required": true},
    {"name": "quantity", "objectType": "java", "type": "integer", "required": true}
  ]
}
```

**`graphqlInput` CreateItemInput** — `.igrpstudio/inventory/graphql/types/CreateItemInput.json`:
```json
{
  "type": "graphqlInput",
  "name": "CreateItemInput",
  "module": "inventory",
  "attributes": [
    {"name": "sku",      "objectType": "java", "type": "string",  "required": true, "maxLength": 50},
    {"name": "quantity", "objectType": "java", "type": "integer", "required": true}
  ]
}
```

**Schema** — `.igrpstudio/inventory/graphql/Item.json`:
```json
{
  "type": "graphql",
  "name": "Item",
  "module": "inventory",
  "typeRef": "Item",
  "queries": [
    {
      "name": "item",
      "params": [{"name": "id", "objectType": "java", "type": "uuid", "required": true}],
      "return": {"objectType": "graphqlType", "type": "Item"},
      "collectionType": "single"
    },
    {
      "name": "items",
      "return": {"objectType": "graphqlType", "type": "Item"},
      "collectionType": "list"
    }
  ],
  "mutations": [
    {
      "name": "createItem",
      "params": [{"name": "input", "objectType": "graphqlInput", "type": "CreateItemInput", "required": true}],
      "return": {"objectType": "graphqlType", "type": "Item"}
    },
    {
      "name": "deleteItem",
      "params": [{"name": "id", "objectType": "java", "type": "uuid", "required": true}],
      "return": {"objectType": "java", "type": "boolean"}
    }
  ]
}
```

#### SDL gerado

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
  item(id: ID!): Item
  items: [Item!]!
}

type Mutation {
  createItem(input: CreateItemInput!): Item
  deleteItem(id: ID!): Boolean
}
```

---

### Exemplo 2 — Paginação, relação cross-module e segurança

**Cenário:** produtos do catálogo com categoria de outro módulo. Listagem paginada protegida por roles.

#### Manifests

**`graphqlType` Category** — `.igrpstudio/shared/graphql/types/Category.json`:
```json
{
  "type": "graphqlType",
  "name": "Category",
  "module": "shared",
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
  "attributes": [
    {"name": "id",       "objectType": "java",        "type": "uuid",     "required": true, "primaryKey": true},
    {"name": "name",     "objectType": "java",        "type": "string",   "required": true},
    {"name": "price",    "objectType": "java",        "type": "double",   "required": true},
    {"name": "active",   "objectType": "java",        "type": "boolean",  "required": false},
    {"name": "category", "objectType": "graphqlType", "type": "Category", "required": false, "module": "shared"}
  ]
}
```

**`graphqlInput` CreateProductInput** — `.igrpstudio/catalog/graphql/types/CreateProductInput.json`:
```json
{
  "type": "graphqlInput",
  "name": "CreateProductInput",
  "module": "catalog",
  "attributes": [
    {"name": "name",       "objectType": "java", "type": "string", "required": true, "maxLength": 255},
    {"name": "price",      "objectType": "java", "type": "double", "required": true},
    {"name": "categoryId", "objectType": "java", "type": "uuid",   "required": false}
  ]
}
```

**`graphqlInput` ProductFilterInput** — `.igrpstudio/catalog/graphql/types/ProductFilterInput.json`:
```json
{
  "type": "graphqlInput",
  "name": "ProductFilterInput",
  "module": "catalog",
  "attributes": [
    {"name": "name",   "objectType": "java", "type": "string",  "required": false},
    {"name": "active", "objectType": "java", "type": "boolean", "required": false}
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
      "name": "product",
      "params": [{"name": "id", "objectType": "java", "type": "uuid", "required": true}],
      "return": {"objectType": "graphqlType", "type": "Product"},
      "collectionType": "single"
    },
    {
      "name": "products",
      "params": [
        {"name": "filter", "objectType": "graphqlInput", "type": "ProductFilterInput", "required": false}
      ],
      "return": {"objectType": "graphqlType", "type": "Product"},
      "collectionType": "paginated",
      "roles": ["MANAGER", "ADMIN"]
    }
  ],
  "mutations": [
    {
      "name": "createProduct",
      "params": [{"name": "input", "objectType": "graphqlInput", "type": "CreateProductInput", "required": true}],
      "return": {"objectType": "graphqlType", "type": "Product"},
      "roles": ["MANAGER"]
    },
    {
      "name": "deleteProduct",
      "params": [{"name": "id", "objectType": "java", "type": "uuid", "required": true}],
      "return": {"objectType": "java", "type": "boolean"},
      "permission": {"items": ["PRODUCT_DELETE"], "operator": "OR"}
    }
  ]
}
```

#### SDL gerado

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

input ProductFilterInput {
  name: String
  active: Boolean
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
  product(id: ID!): Product
  products(filter: ProductFilterInput, sort: SortInput, page: PageInput): ProductConnection!
}

type Mutation {
  createProduct(input: CreateProductInput!): Product
  deleteProduct(id: ID!): Boolean
}
```

#### Consultas frontend

```graphql
# Buscar por ID
query Product($id: ID!) {
  product(id: $id) {
    id name price active
    category { id label }
  }
}

# Listagem paginada com filtro
query Products($filter: ProductFilterInput, $sort: SortInput, $page: PageInput) {
  products(filter: $filter, sort: $sort, page: $page) {
    edges {
      node { id name price active }
      cursor
    }
    pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
    totalCount
  }
}

# Criar
mutation CreateProduct($input: CreateProductInput!) {
  createProduct(input: $input) { id name price }
}

# Deletar
mutation DeleteProduct($id: ID!) {
  deleteProduct(id: $id)
}
```

---

### Exemplo 3 — Subscription com parâmetro de filtro

**Cenário:** acompanhar atualizações de um pedido em tempo real.

```json
{
  "type": "graphql",
  "name": "Order",
  "module": "orders",
  "typeRef": "Order",
  "queries": [
    {
      "name": "order",
      "params": [{"name": "id", "objectType": "java", "type": "uuid", "required": true}],
      "return": {"objectType": "graphqlType", "type": "Order"},
      "collectionType": "single"
    }
  ],
  "mutations": [
    {
      "name": "cancelOrder",
      "params": [{"name": "id", "objectType": "java", "type": "uuid", "required": true}],
      "return": {"objectType": "java", "type": "boolean"}
    }
  ],
  "subscriptions": [
    {
      "name": "orderUpdated",
      "params": [{"name": "orderId", "objectType": "java", "type": "uuid", "required": true}],
      "return": {"objectType": "graphqlType", "type": "Order"}
    }
  ]
}
```

SDL gerado:
```graphql
type Query {
  order(id: ID!): Order
}

type Mutation {
  cancelOrder(id: ID!): Boolean
}

type Subscription {
  orderUpdated(orderId: ID!): Order
}
```

Consulta frontend:
```graphql
subscription OrderUpdated($orderId: ID!) {
  orderUpdated(orderId: $orderId) {
    id
    status
    updatedAt
  }
}
```

---

### Exemplo 4 — Referência a tipo de outro módulo nos params

Quando um `graphqlInput` existe num módulo diferente do schema, declare o `module` no param:

```json
{
  "name": "createOrderLine",
  "params": [
    {"name": "orderId", "objectType": "java",        "type": "uuid",                "required": true},
    {"name": "item",    "objectType": "graphqlInput", "type": "OrderItemInput",      "required": true, "module": "catalog"}
  ],
  "return": {"objectType": "graphqlType", "type": "OrderLine"}
}
```

O engine localiza o manifest em `.igrpstudio/catalog/graphql/types/OrderItemInput.json`.

Da mesma forma, o `return` aceita `module` para tipos de outro módulo:

```json
{
  "return": {"objectType": "graphqlType", "type": "Category", "module": "shared"}
}
```

---

## Regras de Validação

### Nomenclatura

| Campo | Convenção | Exemplo |
|-------|-----------|---------|
| `name`, `typeRef`, `type` (PascalCase) | PascalCase | `Product`, `CreateProductInput` |
| `module` | camelCase | `catalog`, `shared`, `orders` |
| `queries[].name`, `mutations[].name`, `subscriptions[].name` | camelCase | `findProductById`, `createProduct` |
| `params[].name` | camelCase | `id`, `orderId`, `filter` |
| `type` com `objectType: "java"` | minúsculas | `uuid`, `string`, `boolean` |

### Erros de validação comuns

| Situação | Erro |
|----------|------|
| `objectType` ausente em `params` ou `return` | Validation error — campo obrigatório |
| `objectType: "java"` com type PascalCase (ex: `"String"`) | Aceito tecnicamente, mas resolve para escalar desconhecido → fallback `String` |
| `objectType: "graphqlInput"` mas manifest não existe em `.igrpstudio/` | Runtime error ao gerar |
| `typeRef` aponta para manifest inexistente | Runtime error ao gerar |
| `module` especificado não existe no projeto | Runtime error ao gerar |
| Propriedades extras no manifest | Validation error (strict mode — `additionalProperties: false`) |
| `collectionType` em mutation | Validation error — não permitido |
| `roles` e `permission` ambos declarados na mesma operação | Ambos são aplicados combinados com AND |

### Checklist antes de gerar

- [ ] Todos os manifests `graphqlType` e `graphqlInput` foram criados com `addDTO()` antes de `addGraphQLSchema()`
- [ ] Cada param tem `objectType` + `type` + `name`
- [ ] Cada `return` tem `objectType` + `type`
- [ ] Params de tipo `graphqlInput` têm o `module` correto se o DTO não for do mesmo módulo
- [ ] `collectionType` está apenas nas queries, nunca nas mutations
- [ ] Queries paginadas **não** declaram `sort` ou `page` em `params`
- [ ] O `typeRef` corresponde ao nome exato do manifest `graphqlType`

---

*iGRP Spring Engine — branch `dev`*
