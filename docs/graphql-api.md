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

A API GraphQL suporta **Queries**, **Mutations** e paginação automática. Subscriptions **não são suportadas** na versão atual.

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
  "inputRefs": ["CreateProductInput", "UpdateProductInput"],
  "queries": [
    {
      "name": "findProductById",
      "args": [
        {
          "name": "id",
          "type": "uuid",
          "nullable": false,
          "description": "ID do produto"
        }
      ],
      "returnTypeRef": "Product",
      "collectionType": "single"
    },
    {
      "name": "findAllProducts",
      "returnTypeRef": "Product",
      "collectionType": "list"
    },
    {
      "name": "findProductsPage",
      "args": [
        {"name": "page", "type": "integer", "nullable": false},
        {"name": "size", "type": "integer", "nullable": false}
      ],
      "returnTypeRef": "Product",
      "collectionType": "paginated"
    }
  ],
  "mutations": [
    {
      "name": "createProduct",
      "inputRef": "CreateProductInput",
      "returnTypeRef": "Product"
    },
    {
      "name": "updateProduct",
      "inputRef": "UpdateProductInput",
      "args": [{"name": "id", "type": "uuid", "nullable": false}],
      "returnTypeRef": "Product"
    },
    {
      "name": "deleteProduct",
      "args": [{"name": "id", "type": "uuid", "nullable": false}],
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
| `inputRefs` | `string[]` | Não | Nomes dos manifests `graphqlInput` usados |
| `queries` | `GraphQLQuery[]` | Não | Lista de queries |
| `mutations` | `GraphQLMutation[]` | Não | Lista de mutations |

### Definição de Query (`GraphQLQuery`)

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `name` | `string` | Sim | Nome da operação (camelCase) |
| `args` | `GraphQLFieldDef[]` | Não | Argumentos primitivos |
| `returnTypeRef` | `string` | Não | Referência a um `graphqlType` |
| `returnType` | `string` | Não | Tipo primitivo de retorno (`Boolean`, `String`, `Int`) |
| `collectionType` | `"single"` \| `"list"` \| `"paginated"` | Não | Formato do retorno (default: `"single"`) |

### Definição de Mutation (`GraphQLMutation`)

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `name` | `string` | Sim | Nome da operação (camelCase) |
| `inputRef` | `string` | Não | Referência a um `graphqlInput` |
| `args` | `GraphQLFieldDef[]` | Não | Argumentos primitivos adicionais |
| `returnTypeRef` | `string` | Não | Referência a um `graphqlType` |
| `returnType` | `string` | Não | Tipo primitivo de retorno |
| `collectionType` | `"single"` \| `"list"` \| `"paginated"` | Não | Formato do retorno |

### Definição de Argumento (`GraphQLFieldDef`)

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `name` | `string` | Sim | Nome do argumento |
| `type` | `string` | Sim | Tipo engine (`uuid`, `string`, `integer`, etc.) |
| `nullable` | `boolean` | Não | Se pode ser nulo (default: `false`) |
| `description` | `string` | Não | Documentação do campo |

### Comportamento de `collectionType`

| Valor | Retorno GraphQL | Retorno Java |
|-------|-----------------|--------------|
| `"single"` | `Product` | `Product` |
| `"list"` | `[Product!]!` | `List<Product>` |
| `"paginated"` | `ProductPage` | `ProductPage` (auto-gerado) |

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
  → Campo Java:   UUID categoryId
  → Campo GraphQL: category: Category

Atributo: items (graphqlType, list)
  → Campo Java:   List<UUID> itemIds
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
   ├── Carrega os manifestos dos inputRefs (resolvedInputManifests)
   └── Gera pageManifest automático se houver collectionType: 'paginated'

7. Geração de Arquivos
   ├── .graphqls (schema SDL)
   ├── Fragmentos de tipos referenciados
   ├── Resolver Java
   ├── (Technical) Interface de Serviço + Implementação
   ├── (Domain) Query/QueryHandler + Command/CommandHandler
   └── Tipo Page (se paginado)

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
    └── types/
        ├── Product.java
        ├── CreateProductInput.java
        ├── UpdateProductInput.java
        ├── Category.java
        └── ProductPage.java                  ← Gerado automaticamente (se paginado)

.igrpstudio/catalog/graphql/
├── Product.json                              ← Manifesto salvo
└── types/
    ├── Product.json
    ├── CreateProductInput.json
    ├── UpdateProductInput.json
    └── ProductPage.json                      ← Auto-gerado (se paginado)
```

### Estilo Domain (DDD)

```
src/main/resources/graphql/
├── Product.graphqls
└── Category.graphqls

src/main/java/<group>/<pkg>/catalog/
├── interfaces/graphql/
│   ├── ProductResolver.java
│   └── types/
│       ├── Product.java
│       ├── Category.java
│       ├── CreateProductInput.java
│       ├── UpdateProductInput.java
│       └── ProductPage.java
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
# GraphQL Schema — Product
# Generated by iGRP Studio — do not modify this file directly

type Product {
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

type ProductPage {
  content: [Product!]!
  totalElements: Int!
  totalPages: Int!
  pageNumber: Int!
}

type Query {
  findProductById(id: ID!): Product
  findAllProducts: [Product!]!
  findProductsPage(page: Int!, size: Int!): ProductPage
}

type Mutation {
  createProduct(input: CreateProductInput!): Product
  updateProduct(input: UpdateProductInput!, id: ID!): Product
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
  "inputRefs": ["CreateItemInput"],
  "queries": [
    {"name": "findItemById",  "args": [{"name": "id", "type": "uuid", "nullable": false}], "returnTypeRef": "Item", "collectionType": "single"},
    {"name": "findAllItems",  "returnTypeRef": "Item", "collectionType": "list"}
  ],
  "mutations": [
    {"name": "createItem", "inputRef": "CreateItemInput", "returnTypeRef": "Item"},
    {"name": "deleteItem", "args": [{"name": "id", "type": "uuid", "nullable": false}], "returnType": "Boolean"}
  ]
}
```

#### Schema SDL gerado

```graphql
type Item {
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

#### Manifests necessários (conforme test suite)

Pré-requisito — registrar os DTOs com `addDTO()` antes de `addGraphQLSchema()`:

```typescript
// Tipos referenciados
await addDTO(categoryType, basePath);   // graphqlType Category (module: shared)
await addDTO(productType,  basePath);   // graphqlType Product  (module: catalog)

// Inputs
await addDTO(createProductInput, basePath);
await addDTO(updateProductInput, basePath);

// Schema
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
  "inputRefs": ["CreateProductInput", "UpdateProductInput"],
  "queries": [
    {"name": "findProductById",  "args": [{"name": "id",   "type": "uuid",    "nullable": false}], "returnTypeRef": "Product", "collectionType": "single"},
    {"name": "findAllProducts",  "returnTypeRef": "Product", "collectionType": "list"},
    {"name": "findProductsPage", "args": [{"name": "page", "type": "integer", "nullable": false}, {"name": "size", "type": "integer", "nullable": false}], "returnTypeRef": "Product", "collectionType": "paginated"}
  ],
  "mutations": [
    {"name": "createProduct", "inputRef": "CreateProductInput", "returnTypeRef": "Product"},
    {"name": "updateProduct", "inputRef": "UpdateProductInput", "args": [{"name": "id", "type": "uuid", "nullable": false}], "returnTypeRef": "Product"},
    {"name": "deleteProduct", "args": [{"name": "id", "type": "uuid", "nullable": false}], "returnType": "Boolean"}
  ]
}
```

#### Schema SDL gerado

```graphql
type Product {
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

type ProductPage {
  content: [Product!]!
  totalElements: Int!
  totalPages: Int!
  pageNumber: Int!
}

type Query {
  findProductById(id: ID!): Product
  findAllProducts: [Product!]!
  findProductsPage(page: Int!, size: Int!): ProductPage
}

type Mutation {
  createProduct(input: CreateProductInput!): Product
  updateProduct(input: UpdateProductInput!, id: ID!): Product
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

# Listagem paginada
query FindProductsPage($page: Int!, $size: Int!) {
  findProductsPage(page: $page, size: $size) {
    content {
      id
      name
      price
      active
    }
    totalElements
    totalPages
    pageNumber
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
mutation UpdateProduct($input: UpdateProductInput!, $id: ID!) {
  updateProduct(input: $input, id: $id) {
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

## Validações e Regras

### Regras de Nomenclatura

- `name`, `typeRef`, `inputRefs[]` devem seguir o padrão PascalCase (ex: `Product`, `CreateProductInput`)
- `module` deve seguir camelCase (ex: `catalog`, `shared`, `orders`)
- Nomes de queries e mutations devem seguir camelCase (ex: `findProductById`)
- Nomes de argumentos e atributos devem seguir camelCase (ex: `categoryId`)

### Erros de Validação

| Condição | Erro |
|----------|------|
| `type` diferente de `"graphql"` | Validation error |
| `name` ausente | Validation error |
| `typeRef` aponta para manifesto inexistente | Runtime error |
| `inputRefs[]` aponta para manifesto inexistente | Runtime error |
| Módulo especificado não existe no projeto | Runtime error |
| Propriedades extras no manifesto | Validation error (strict mode) |

### Tipos Auto-gerados

Quando uma query tem `collectionType: "paginated"`, o engine cria automaticamente:

1. Um manifesto `<TypeRef>Page.json` em `.igrpstudio/<module>/graphql/types/`
2. Uma classe Java `<TypeRef>Page.java`
3. O tipo `<TypeRef>Page` no arquivo `.graphqls`

O tipo Page gerado sempre tem esta estrutura:

```graphql
type ProductPage {
  content: [Product!]!
  totalElements: Int!
  totalPages: Int!
  pageNumber: Int!
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

*Gerado para o iGRP Spring Engine — branch `feat/support-graphql-v1`*