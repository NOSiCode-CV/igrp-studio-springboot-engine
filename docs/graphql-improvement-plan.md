# GraphQL Boilerplate — Plano de Melhoria

> **Contexto:** O engine já gera boilerplate GraphQL funcional. Este plano documenta as melhorias a implementar para alinhar com as melhores práticas do ecossistema Spring for GraphQL + GraphQL spec (Relay).  
> **Responsabilidade do engine:** estrutura, anotações, infraestrutura.  
> **Responsabilidade do programador:** lógica de negócio nos stubs gerados.

---

## Estrutura de Pastas Alvo

### Technical (Layered)

```
graphql/
├── <schema>/
│   ├── <Schema>Resolver.java
│   ├── I<Schema>GraphQLService.java
│   └── <Schema>GraphQLService.java          ← protected (gerado uma vez)
│
├── type/                                     ← output DTOs (o que GraphQL devolve)
│   └── <Type>.java
│
├── input/                                    ← o que GraphQL recebe
│   ├── Create<X>Input.java
│   ├── Update<X>Input.java
│   └── <X>FilterInput.java
│
├── connection/                               ← Relay cursor pagination
│   ├── <X>Connection.java
│   ├── <X>Edge.java
│   ├── CursorUtils.java                      ← one-time
│   └── PaginationUtils.java                  ← one-time
│
├── config/                                   ← infraestrutura one-time
│   ├── GraphQLConfig.java                    ← protected
│   └── GraphQLExceptionHandler.java          ← protected
│
├── interceptor/                              ← one-time
│   ├── RateLimitInterceptor.java
│   └── PersistedQueryInterceptor.java
│
├── instrumentation/                          ← one-time
│   └── OperationLoggingInstrumentation.java
│
└── subscription/                             ← quando subscriptions declaradas
    ├── <Schema>SubscriptionController.java
    ├── <Schema>EventService.java
    └── impl/
        └── <Schema>EventServiceImpl.java     ← protected

src/main/resources/graphql/
├── common.graphqls                           ← one-time (scalars, Node, PageInfo, SortInput)
└── <Schema>.graphqls
```

### Domain (Hexagonal DDD CQRS)

```
<module>/
├── interfaces/
│   └── graphql/
│       ├── <Schema>Resolver.java
│       │
│       ├── type/                             ← output DTOs
│       │   └── <Type>.java
│       │
│       ├── input/                            ← mutation inputs + filter inputs
│       │   ├── Create<X>Input.java
│       │   └── <X>FilterInput.java
│       │
│       ├── connection/                       ← Relay pagination
│       │   ├── <X>Connection.java
│       │   └── <X>Edge.java
│       │
│       └── subscription/                     ← quando subscriptions declaradas
│           └── <Schema>SubscriptionController.java
│
├── application/
│   ├── queries/
│   │   ├── <X>Query.java
│   │   └── <X>QueryHandler.java              ← protected
│   ├── commands/
│   │   ├── <X>Command.java
│   │   └── <X>CommandHandler.java            ← protected
│   └── event/                                ← quando subscriptions declaradas
│       ├── <Schema>EventService.java
│       └── impl/
│           └── <Schema>EventServiceImpl.java  ← protected
│
├── domain/
│   ├── aggregate/
│   ├── service/
│   ├── events/
│   └── repository/
│
└── infrastructure/
    └── persistence/
        ├── entity/
        └── repository/

─── infraestrutura transversal (raiz do projecto) ───
config/
└── GraphQLConfig.java                        ← protected, one-time

graphql/
├── exception/
│   └── GraphQLExceptionHandler.java          ← protected, one-time
├── interceptor/
│   ├── RateLimitInterceptor.java
│   └── PersistedQueryInterceptor.java
├── instrumentation/
│   └── OperationLoggingInstrumentation.java
└── connection/
    ├── CursorUtils.java                      ← one-time
    └── PaginationUtils.java                  ← one-time

src/main/resources/graphql/
├── common.graphqls                           ← one-time
└── <Schema>.graphqls
```

---

## Comparação de Paths

| Artefacto | Technical | Domain |
|---|---|---|
| `GraphQLConfig.java` | `graphql/config/` | `config/` (raiz) |
| `GraphQLExceptionHandler.java` | `graphql/config/` | `graphql/exception/` (raiz) |
| `RateLimitInterceptor.java` | `graphql/interceptor/` | `graphql/interceptor/` (raiz) |
| `OperationLoggingInstrumentation.java` | `graphql/instrumentation/` | `graphql/instrumentation/` (raiz) |
| `<Schema>Resolver.java` | `graphql/<schema>/` | `<module>/interfaces/graphql/` |
| `I<Schema>GraphQLService.java` | `graphql/<schema>/` | — (usa QueryBus/CommandBus) |
| `<Schema>GraphQLService.java` | `graphql/<schema>/` | — (usa handlers) |
| `<Type>.java` (output DTO) | `graphql/type/` | `<module>/interfaces/graphql/type/` |
| `<Input>.java` (mutation input) | `graphql/input/` | `<module>/interfaces/graphql/input/` |
| `<X>FilterInput.java` | `graphql/input/` | `<module>/interfaces/graphql/input/` |
| `<X>Connection.java` + `<X>Edge.java` | `graphql/connection/` | `<module>/interfaces/graphql/connection/` |
| `CursorUtils.java` | `graphql/connection/` | `graphql/connection/` (raiz) |
| `PaginationUtils.java` | `graphql/connection/` | `graphql/connection/` (raiz) |
| `<Schema>SubscriptionController.java` | `graphql/subscription/` | `<module>/interfaces/graphql/subscription/` |
| `<Schema>EventService.java` | `graphql/subscription/` | `<module>/application/event/` |
| `<Schema>EventServiceImpl.java` | `graphql/subscription/impl/` | `<module>/application/event/impl/` |
| `<X>Query.java` + `<X>QueryHandler.java` | — | `<module>/application/queries/` |
| `<X>Command.java` + `<X>CommandHandler.java` | — | `<module>/application/commands/` |
| `common.graphqls` | `src/main/resources/graphql/` | `src/main/resources/graphql/` |
| `<Schema>.graphqls` | `src/main/resources/graphql/` | `src/main/resources/graphql/` |

---

## Fases de Implementação

### Fase 1 — Correções nos templates existentes
> **Prioridade:** Crítica · **Complexidade:** S · **Pré-requisito de:** todas as fases

Corrige problemas actuais sem adicionar features. Zero risco de regressão.

#### 1.1 Scalar mappings incorrectos
**Ficheiro:** `src/utils/constants.ts` — `GRAPHQL_SCALAR_TYPES`

| Hoje | Deve ser |
|---|---|
| `'datetime' → 'String'` | `'datetime' → 'DateTime'` |
| `'long' → 'Int'` | `'long' → 'Long'` |
| `'decimal' → 'Float'` | `'decimal' → 'BigDecimal'` |
| `'bigdecimal' → 'Float'` | `'bigdecimal' → 'BigDecimal'` |

#### 1.2 Remover `@Autowired` desnecessário
**Ficheiro:** `public/templates/graphql/graphql-resolver.hbs`

Spring injeta via constructor sem `@Autowired` desde a versão 4.3.

```java
// REMOVER:
@Autowired
public ProductResolver(IProductGraphQLService ...) { ... }

// RESULTADO:
public ProductResolver(IProductGraphQLService ...) { ... }
```

#### 1.3 Adicionar `@Validated` ao resolver
**Ficheiro:** `public/templates/graphql/graphql-resolver.hbs`

Sem `@Validated`, as anotações `@NotBlank`, `@Size` nos Inputs são ignoradas em runtime.

```java
// ANTES:
@Controller
public class ProductResolver {

// DEPOIS:
@Controller
@Validated
public class ProductResolver {
```

#### 1.4 Substituir `@SchemaMapping` + DataLoader por `@BatchMapping`
**Ficheiros:** `graphql-resolver.hbs`, `graphql-type-record.hbs`, `graphql-type-classic.hbs`, `graphqlHelper.ts`

O padrão actual gera código que falha em runtime — o DataLoader nunca é registado no `BatchLoaderRegistry`. `@BatchMapping` resolve isto nativamente: Spring cria e regista o DataLoader automaticamente.

```java
// REMOVER (broken em runtime):
@SchemaMapping(typeName = "Product", field = "category")
public CompletableFuture<Category> category(
        Product product,
        DataLoader<UUID, Category> categoryDataLoader) {
    return categoryDataLoader.load(product.getCategoryId());
}

// SUBSTITUIR POR:
@BatchMapping(typeName = "Product", field = "category")
public Map<Product, Category> category(List<Product> products) {
    // Spring cria e regista o DataLoader automaticamente
    // programador implementa o batch aqui
}
```

Consequência: campos `categoryId` / `productIds` nos Type records deixam de ser necessários — remover dos templates `graphql-type-record.hbs` e `graphql-type-classic.hbs`.

O template `graphql-dataloader.hbs` pode ser eliminado.

#### Entregáveis Fase 1

| # | Ficheiro | Acção |
|---|---|---|
| 1 | `src/utils/constants.ts` | Corrigir 4 entradas em `GRAPHQL_SCALAR_TYPES` |
| 2 | `graphql-resolver.hbs` | Remover `@Autowired`, adicionar `@Validated`, substituir `@SchemaMapping` por `@BatchMapping` |
| 3 | `graphql-type-record.hbs` | Remover bloco de DataLoader ID fields |
| 4 | `graphql-type-classic.hbs` | Remover bloco de DataLoader ID fields |
| 5 | `src/helper/graphqlHelper.ts` | Remover imports `CompletableFuture`/`DataLoader`, adicionar import `BatchMapping` |
| 6 | `src/utils/constants.ts` | Remover `GRAPHQL_DATALOADER` do enum `TEMPLATES` |

---

### Fase 2 — `common.graphqls` + `interface Node` + `@deprecated`
> **Prioridade:** Alta · **Complexidade:** S · **Pré-requisito de:** Fases 3, 4, 5, 6, 7

Cria a fundação de schema partilhada por todos os outros schemas do projecto.

#### 2.1 Novo template `graphql-common.hbs`

Gerado **uma vez por projecto** na primeira chamada a `addGraphQLSchema()` — nunca sobrescrito.

```graphql
# common.graphqls — Generated by iGRP Studio
# Shared scalars, interfaces and types used across all schemas

scalar DateTime
scalar BigDecimal
scalar Long

"""Every type implementing Node has a globally unique ID (Relay spec)."""
interface Node {
  id: ID!
}

"""Pagination metadata — Relay Cursor Connection Specification."""
type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

enum SortDirection { ASC DESC }

input SortInput {
  field: String!
  direction: SortDirection!
}

input PageInput {
  first: Int
  after: String
  last: Int
  before: String
}
```

#### 2.2 `implements Node` automático

Todo o tipo com campo `id` passa a declarar `implements Node` no SDL gerado.

```graphql
# ANTES:
type Product { id: ID! ... }

# DEPOIS:
type Product implements Node { id: ID! ... }
```

Nova função em `graphqlHelper.ts`: `typeImplementsNode(manifest): boolean` — retorna `true` se `attributes` contém `{ name: 'id' }`.

#### 2.3 Suporte a `@deprecated` no manifest

Novo campo opcional `deprecated: string` em `JavaAttribute`.

```json
{ "name": "legacyCode", "type": "string", "deprecated": "Use 'sku' instead." }
```

Gera no SDL:
```graphql
legacyCode: String @deprecated(reason: "Use 'sku' instead.")
```

Gera no Type Java:
```java
/** @deprecated Use 'sku' instead. */
@Deprecated
String legacyCode()
```

#### Entregáveis Fase 2

| # | Ficheiro | Acção |
|---|---|---|
| 1 | `public/templates/graphql/graphql-common.hbs` | **NOVO** |
| 2 | `src/modules/graphql/generateGraphQLSchema.ts` | Trigger: gerar `common.graphqls` se não existir |
| 3 | `graphql-schema.hbs` | Adicionar `implements Node` condicional + suporte `@deprecated` nos campos |
| 4 | `graphql-type-record.hbs` | Suporte `@Deprecated` + Javadoc `@deprecated` |
| 5 | `graphql-type-classic.hbs` | Idem |
| 6 | `src/helper/graphqlHelper.ts` | Nova função `typeImplementsNode()` |
| 7 | `src/utils/handlebarsHelpers.ts` | Registar `typeImplementsNode` |
| 8 | `src/interfaces/types.ts` | `deprecated?: string` em `JavaAttribute` |
| 9 | `src/schema/graphQLSchemaConfig.ts` | Adicionar `deprecated` ao AJV schema |

---

### Fase 3 — Relay Cursor Pagination
> **Prioridade:** Alta · **Complexidade:** M · **Depende de:** Fase 2

Substitui `*Page` (offset) por `*Connection` + `*Edge` (cursor-based). Paginação cursor é estável quando dados são inseridos/removidos entre páginas; offset não é.

#### 3.1 Alteração no SDL gerado

```graphql
# ANTES (offset):
type ProductPage {
  content: [Product!]!
  totalElements: Int!
  totalPages: Int!
  pageNumber: Int!
}
query findProducts(page: Int!, size: Int!): ProductPage

# DEPOIS (cursor):
type ProductConnection {
  edges: [ProductEdge!]!
  pageInfo: PageInfo!
  totalCount: Long!
}
type ProductEdge {
  node: Product!
  cursor: String!
}
query findProducts(filter: ProductFilter, sort: SortInput, page: PageInput): ProductConnection!
```

#### 3.2 Novos templates

| Template | Ficheiro gerado | Regenerado |
|---|---|---|
| `graphql-connection.hbs` | `<X>Connection.java` | Sempre |
| `graphql-edge.hbs` | `<X>Edge.java` | Sempre |
| `graphql-cursor-utils.hbs` | `CursorUtils.java` | Uma vez |
| `graphql-pagination-utils.hbs` | `PaginationUtils.java` | Uma vez |

#### 3.3 Paths por estilo

| Artefacto | Technical | Domain |
|---|---|---|
| `<X>Connection.java` | `graphql/connection/` | `<module>/interfaces/graphql/connection/` |
| `<X>Edge.java` | `graphql/connection/` | `<module>/interfaces/graphql/connection/` |
| `CursorUtils.java` | `graphql/connection/` | `graphql/connection/` (raiz) |
| `PaginationUtils.java` | `graphql/connection/` | `graphql/connection/` (raiz) |

#### Entregáveis Fase 3

| # | Ficheiro | Acção |
|---|---|---|
| 1 | `public/templates/graphql/graphql-connection.hbs` | **NOVO** |
| 2 | `public/templates/graphql/graphql-edge.hbs` | **NOVO** |
| 3 | `public/templates/graphql/graphql-cursor-utils.hbs` | **NOVO** |
| 4 | `public/templates/graphql/graphql-pagination-utils.hbs` | **NOVO** |
| 5 | `src/utils/constants.ts` | 4 novas entradas em `TEMPLATES`, nova entrada `GRAPHQL_CONNECTION` em `DIRECTORIES` |
| 6 | `graphql-schema.hbs` | Gerar `Connection`/`Edge` em vez de `Page` quando `collectionType: 'paginated'` |
| 7 | `src/modules/graphql/generateGraphQLSchema.ts` | Novos path helpers `getConnectionFilePath`, `getEdgeFilePath`, `getCursorUtilsFilePath`; substituir `savePageManifest` por `saveConnectionManifest`; gerar `CursorUtils`/`PaginationUtils` one-time |
| 8 | `public/templates/graphql/graphql-page-type.hbs` | Deprecar (manter para retrocompatibilidade com flag `legacyPagination`) |

---

### Fase 4 — Infraestrutura one-time por projecto
> **Prioridade:** Alta · **Complexidade:** S · **Depende de:** Fase 2

Gera `GraphQLConfig.java` e `GraphQLExceptionHandler.java` na primeira chamada — nunca sobrescritos.

#### 4.1 `GraphQLConfig.java`

Regista custom scalars (`DateTime`, `BigDecimal`, `Long`), TypeResolver para a interface `Node`, e instrumentações de segurança (max depth, max complexity).

```java
@Configuration
public class GraphQLConfig {

    @Bean
    public RuntimeWiringConfigurer runtimeWiringConfigurer() {
        return builder -> builder
            .scalar(ExtendedScalars.DateTime)
            .scalar(ExtendedScalars.GraphQLBigDecimal)
            .scalar(ExtendedScalars.GraphQLLong)
            .type("Node", wiring -> wiring.typeResolver(env -> {
                Object obj = env.getObject();
                // TypeResolver — gerado com base nos tipos conhecidos do projecto
                // TODO: adicionar novos tipos conforme o projecto cresce
                return null;
            }));
    }

    @Bean
    public Instrumentation maxQueryDepthInstrumentation(
            @Value("${spring.graphql.schema.introspection.enabled:true}") boolean introspection) {
        return new MaxQueryDepthInstrumentation(introspection ? 25 : 10);
    }

    @Bean
    public Instrumentation maxQueryComplexityInstrumentation(
            @Value("${spring.graphql.schema.introspection.enabled:true}") boolean introspection) {
        return new MaxQueryComplexityInstrumentation(introspection ? 1000 : 200);
    }
}
```

**Path:**
- Technical: `graphql/config/GraphQLConfig.java`
- Domain: `config/GraphQLConfig.java`

#### 4.2 `GraphQLExceptionHandler.java`

Stub com handlers para os tipos de excepção do framework IGRP — programador adiciona os casos específicos.

```java
@Component
public class GraphQLExceptionHandler extends DataFetcherExceptionResolverAdapter {

    @Override
    protected GraphQLError resolveToSingleError(Throwable ex, DataFetchingEnvironment env) {
        // TODO: mapear excepções de negócio para erros GraphQL tipados
        // Exemplo: if (ex instanceof EntityNotFoundException) → ErrorType.NOT_FOUND
        return null; // null → Spring usa o handler padrão
    }
}
```

**Path:**
- Technical: `graphql/config/GraphQLExceptionHandler.java`
- Domain: `graphql/exception/GraphQLExceptionHandler.java`

#### Entregáveis Fase 4

| # | Ficheiro | Acção |
|---|---|---|
| 1 | `public/templates/graphql/graphql-config.hbs` | **NOVO** |
| 2 | `public/templates/graphql/graphql-exception-handler.hbs` | **NOVO** |
| 3 | `src/utils/constants.ts` | 2 novas entradas `TEMPLATES`, novas entradas `GRAPHQL_CONFIG`, `GRAPHQL_EXCEPTION` em `DIRECTORIES` |
| 4 | `src/modules/graphql/generateGraphQLSchema.ts` | Funções `generateGraphQLConfig()` e `generateExceptionHandler()` com guard `if exists → skip` |

---

### Fase 5 — Segurança (`@PreAuthorize`)
> **Prioridade:** Alta · **Complexidade:** S · **Depende de:** Fase 1

Suporte ao campo `security` nos manifests de queries e mutations.

#### 5.1 Novo campo no manifest

```json
{
  "mutations": [
    { "name": "createProduct", "inputRef": "CreateProductInput", "security": "EDITOR" },
    { "name": "deleteProduct", "args": [...], "security": "ADMIN" }
  ],
  "queries": [
    { "name": "findProducts", "security": "USER" }
  ]
}
```

#### 5.2 Mapeamento de roles

| Valor no manifest | Anotação gerada |
|---|---|
| `"ADMIN"` | `@PreAuthorize("hasRole('ADMIN')")` |
| `"EDITOR"` | `@PreAuthorize("hasRole('EDITOR') or hasRole('ADMIN')")` |
| `"USER"` | `@PreAuthorize("isAuthenticated()")` |
| ausente | sem anotação |

#### 5.3 Resultado no resolver

```java
@MutationMapping
@PreAuthorize("hasRole('EDITOR') or hasRole('ADMIN')")
public Product createProduct(@Argument @Valid CreateProductInput input) { ... }

@MutationMapping
@PreAuthorize("hasRole('ADMIN')")
public Boolean deleteProduct(@Argument UUID id) { ... }
```

#### Entregáveis Fase 5

| # | Ficheiro | Acção |
|---|---|---|
| 1 | `src/interfaces/types.ts` | `security?: 'ADMIN' \| 'EDITOR' \| 'USER'` em `GraphQLQuery` e `GraphQLMutation` |
| 2 | `src/schema/graphQLSchemaConfig.ts` | Adicionar `security` ao AJV schema (enum, opcional) |
| 3 | `graphql-resolver.hbs` | `{{#if this.security}}@PreAuthorize(...){{/if}}` em cada query/mutation |
| 4 | `src/helper/graphqlHelper.ts` | Nova função `resolvePreAuthorize(security)` |
| 5 | `src/utils/handlebarsHelpers.ts` | Registar `resolvePreAuthorize` |

---

### Fase 6 — Subscriptions
> **Prioridade:** Média · **Complexidade:** M · **Depende de:** Fases 1, 2

Suporte ao campo `subscriptions[]` no manifest — gera controller, interface de serviço e implementação com Reactor Sinks.

#### 6.1 Novo campo no manifest

```json
{
  "subscriptions": [
    { "name": "productCreated", "returnTypeRef": "Product" },
    {
      "name": "productStatusChanged",
      "args": [{ "name": "productId", "type": "uuid" }],
      "returnTypeRef": "Product"
    }
  ]
}
```

#### 6.2 SDL gerado

```graphql
type Subscription {
  productCreated: Product!
  productStatusChanged(productId: ID): Product!
}
```

#### 6.3 Ficheiros gerados

| Template | Ficheiro | Regenerado |
|---|---|---|
| `graphql-subscription-controller.hbs` | `<Schema>SubscriptionController.java` | Sempre |
| `graphql-event-service.hbs` | `<Schema>EventService.java` (interface) | Sempre |
| `graphql-event-service-impl.hbs` | `<Schema>EventServiceImpl.java` | **Uma vez** (protected) |

`EventServiceImpl` usa `Sinks.Many<T>` do Reactor:

```java
@Service
public class ProductEventServiceImpl implements ProductEventService {

    private final Sinks.Many<ProductType> createdSink =
            Sinks.many().multicast().onBackpressureBuffer();

    @Override
    public void publishCreated(ProductType product) {
        createdSink.tryEmitNext(product);
    }

    @Override
    public Flux<ProductType> createdStream() {
        return createdSink.asFlux();
    }
}
```

#### 6.4 Paths por estilo

| Artefacto | Technical | Domain |
|---|---|---|
| `<Schema>SubscriptionController.java` | `graphql/<schema>/subscription/` | `<module>/interfaces/graphql/subscription/` |
| `<Schema>EventService.java` | `graphql/<schema>/subscription/` | `<module>/application/event/` |
| `<Schema>EventServiceImpl.java` | `graphql/<schema>/subscription/impl/` | `<module>/application/event/impl/` |

#### Entregáveis Fase 6

| # | Ficheiro | Acção |
|---|---|---|
| 1 | `public/templates/graphql/graphql-subscription-controller.hbs` | **NOVO** |
| 2 | `public/templates/graphql/graphql-event-service.hbs` | **NOVO** |
| 3 | `public/templates/graphql/graphql-event-service-impl.hbs` | **NOVO** |
| 4 | `src/interfaces/types.ts` | Novo interface `GraphQLSubscription`, campo `subscriptions?: GraphQLSubscription[]` em `GraphQLSchemaConfig` |
| 5 | `src/schema/graphQLSchemaConfig.ts` | Adicionar `subscriptions` ao AJV schema |
| 6 | `src/utils/constants.ts` | 3 novas entradas em `TEMPLATES` |
| 7 | `graphql-schema.hbs` | Gerar `type Subscription { }` quando subscriptions presentes |
| 8 | `src/modules/graphql/generateGraphQLSchema.ts` | Funções `generateSubscriptionController()`, `generateEventService()`, `generateEventServiceImpl()`, novos path helpers |

---

### Fase 7 — Filtros e Ordenação
> **Prioridade:** Média · **Complexidade:** S · **Depende de:** Fases 2, 3

Suporte ao campo `filterRef` nas queries para gerar input de filtro tipado. `SortInput` e `PageInput` vêm do `common.graphqls` (Fase 2).

#### 7.1 Novo campo no manifest

```json
{
  "queries": [
    {
      "name": "findProducts",
      "filterRef": "ProductFilter",
      "collectionType": "paginated"
    }
  ]
}
```

#### 7.2 SDL e Java gerados

```graphql
findProducts(filter: ProductFilter, sort: SortInput, page: PageInput): ProductConnection!
```

```java
@QueryMapping
public ProductConnection findProducts(
        @Argument ProductFilter filter,
        @Argument SortInput sort,
        @Argument PageInput page) { ... }
```

#### Entregáveis Fase 7

| # | Ficheiro | Acção |
|---|---|---|
| 1 | `src/interfaces/types.ts` | `filterRef?: string` em `GraphQLQuery` |
| 2 | `src/schema/graphQLSchemaConfig.ts` | Adicionar `filterRef` ao AJV schema |
| 3 | `graphql-schema.hbs` | Gerar args `filter`, `sort`, `page` quando `filterRef` ou `collectionType: 'paginated'` |
| 4 | `graphql-resolver.hbs` | Gerar parâmetros `filter`, `sort`, `page` no método |
| 5 | `graphql-service-interface.hbs` | Idem |
| 6 | `src/helper/graphqlHelper.ts` | Actualizar `graphqlImportsTypes` para incluir `SortInput`/`PageInput` quando aplicável |

---

### Fase 8 — Reorganização de Pastas
> **Prioridade:** Baixa · **Complexidade:** S · **Depende de:** todas as fases anteriores

Aplica a nova estrutura de pastas. Apenas altera path helpers em TypeScript — os templates não mudam.

#### 8.1 Novas constantes em `DIRECTORIES`

```typescript
GRAPHQL_TYPE: 'type',
GRAPHQL_INPUT: 'input',
GRAPHQL_CONNECTION: 'connection',
GRAPHQL_CONFIG: 'config',
GRAPHQL_EXCEPTION: 'exception',
GRAPHQL_INTERCEPTOR: 'interceptor',
GRAPHQL_INSTRUMENTATION: 'instrumentation',
GRAPHQL_SUBSCRIPTION: 'subscription',
```

#### 8.2 Path helpers a actualizar em `generateGraphQLSchema.ts`

| Função | Hoje | Depois |
|---|---|---|
| `getTypeFilePath()` | `graphql/types/` | Technical: `graphql/type/` · Domain: `<module>/interfaces/graphql/type/` |
| `getInputFilePath()` | `graphql/types/` | Technical: `graphql/input/` · Domain: `<module>/interfaces/graphql/input/` |
| `getConnectionFilePath()` | não existe | Technical: `graphql/connection/` · Domain: `<module>/interfaces/graphql/connection/` |
| `getConfigFilePath()` | não existe | Technical: `graphql/config/` · Domain: `config/` |
| `getExceptionHandlerFilePath()` | não existe | Technical: `graphql/config/` · Domain: `graphql/exception/` |

#### Entregáveis Fase 8

| # | Ficheiro | Acção |
|---|---|---|
| 1 | `src/utils/constants.ts` | 8 novas entradas em `DIRECTORIES` |
| 2 | `src/modules/graphql/generateGraphQLSchema.ts` | Actualizar todos os path helpers para usar as novas constantes |

---

## Resumo do Plano

| Fase | Nome | Templates novos | Templates modificados | Ficheiros TS | Complexidade |
|---|---|---|---|---|---|
| 1 | Correções existentes | 0 | 4 | 2 | S |
| 2 | common.graphqls + Node + @deprecated | 1 | 3 | 4 | S |
| 3 | Relay Cursor Pagination | 4 | 2 | 2 | M |
| 4 | Infraestrutura one-time | 2 | 0 | 2 | S |
| 5 | @PreAuthorize | 0 | 1 | 3 | S |
| 6 | Subscriptions | 3 | 1 | 3 | M |
| 7 | Filtros e Ordenação | 0 | 3 | 2 | S |
| 8 | Reorganização de pastas | 0 | 0 | 2 | S |
| **Total** | | **10 novos** | **14 modificados** | **20** | |

**Ordem de execução:** `1 → 2 → 4 → 5 → 3 → 7 → 6 → 8`

Fases 1 e 2 são pré-requisito absoluto.  
Fases 3, 4, 5, 7 são independentes entre si (após Fase 2).  
Fase 6 depende de Fases 1 e 2.  
Fase 8 é sempre a última — é puramente uma refactorização de paths.

---

## Referências

- [Spring for GraphQL — @BatchMapping](https://docs.spring.io/spring-graphql/reference/controllers.html#controllers.batch-mapping)
- [Relay Cursor Connection Specification](https://relay.dev/graphql/connections.htm)
- [GraphQL Extended Scalars](https://github.com/graphql-java/graphql-java-extended-scalars)
- [Project GraphQLExample](../../../../demo_workspace/projects/GraphQLExample) — implementação de referência com todas as boas práticas aplicadas
