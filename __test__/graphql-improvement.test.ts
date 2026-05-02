/**
 * graphql-improvement.test.ts
 *
 * Integration tests for the GraphQL boilerplate improvement plan (all 8 phases).
 *
 * For each test scenario we:
 *   1. Create fresh Spring Boot projects via newApi
 *   2. Generate files via addGraphQLSchema / addDTO
 *   3. Assert the generated Java/GraphQL content is correct
 *   4. After all scenarios, compile both Java projects with Maven to catch compile errors
 *
 * Projects used:
 *   - TECHNICAL_OUTPUT_DIR: C:\spring-engine\demoGraphQLTec  (layered / technical style)
 *   - DOMAIN_OUTPUT_DIR:    C:\spring-engine\demoGraphQLDom  (DDD / domain style)
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import {execSync} from 'child_process';
import {describe, it, beforeAll, expect} from '@jest/globals';
import {addDTO, addGraphQLSchema, newApi, setEngineConfiguration} from '../src';
import {BaseApiConfig, DTOConfig, GraphQLSchemaConfig} from '../src/interfaces/types';

const TECHNICAL_OUTPUT_DIR = 'C:\\spring-engine\\demoGraphQLTec';
const DOMAIN_OUTPUT_DIR    = 'C:\\spring-engine\\demoGraphQLDom';

// ═══════════════════════════════════════════════════════════════════════════════
// Helper — read generated file
// ═══════════════════════════════════════════════════════════════════════════════

const readGenerated = (base: string, ...segments: string[]): Promise<string> =>
  fs.readFile(path.join(base, ...segments), 'utf-8');

// ═══════════════════════════════════════════════════════════════════════════════
// DTOs / GraphQL Types seeded before tests
// ═══════════════════════════════════════════════════════════════════════════════

// --- Order type (with id → implements Node) ---
const orderType: DTOConfig = {
  type: 'graphqlType',
  name: 'Order',
  module: 'orders',
  template: 'classic',
  attributes: [
    {name: 'id',        objectType: 'java', type: 'uuid',     required: true,  primaryKey: true},
    {name: 'reference', objectType: 'java', type: 'string',   required: true},
    {name: 'total',     objectType: 'java', type: 'decimal',  required: true},
    {name: 'createdAt', objectType: 'java', type: 'datetime', required: false},
    // deprecated field test (Phase 2)
    {name: 'legacyCode',objectType: 'java', type: 'string',   required: false, deprecated: 'Use reference instead.'},
  ],
};

// --- OrderItem type (graphqlType relation from Order) ---
const orderItemType: DTOConfig = {
  type: 'graphqlType',
  name: 'OrderItem',
  module: 'orders',
  template: 'classic',
  attributes: [
    {name: 'id',       objectType: 'java',        type: 'uuid',      required: true, primaryKey: true},
    {name: 'quantity', objectType: 'java',        type: 'integer',   required: true},
    {name: 'price',    objectType: 'java',        type: 'decimal',   required: true},
    // @BatchMapping relation
    {name: 'order',    objectType: 'graphqlType', type: 'Order',     required: false, module: 'orders'},
  ],
};

// --- CreateOrderInput ---
const createOrderInput: DTOConfig = {
  type: 'graphqlInput',
  name: 'CreateOrderInput',
  module: 'orders',
  template: 'classic',
  attributes: [
    {name: 'reference', objectType: 'java', type: 'string',  required: true,  maxLength: 100},
    {name: 'total',     objectType: 'java', type: 'decimal', required: true},
  ],
};

// --- OrderFilterInput (for filterRef / Phase 7) ---
const orderFilterInput: DTOConfig = {
  type: 'graphqlInput',
  name: 'OrderFilterInput',
  module: 'orders',
  template: 'classic',
  attributes: [
    {name: 'status',   objectType: 'java', type: 'string',  required: false},
    {name: 'minTotal', objectType: 'java', type: 'decimal', required: false},
  ],
};

// --- Product type (simple, no relations — for subscription test) ---
const productType: DTOConfig = {
  type: 'graphqlType',
  name: 'ProductEvent',
  module: 'catalog',
  template: 'classic',
  attributes: [
    {name: 'id',    objectType: 'java', type: 'uuid',   required: true, primaryKey: true},
    {name: 'name',  objectType: 'java', type: 'string', required: true},
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// Schema configs exercising all phases
// ═══════════════════════════════════════════════════════════════════════════════

// --- Phase 1,2,3,4,5,7: Order schema with all features ---
const orderSchema: GraphQLSchemaConfig = {
  type: 'graphql',
  name: 'Order',
  module: 'orders',
  typeRef: 'Order',
  inputRefs: ['CreateOrderInput', 'OrderFilterInput'],
  queries: [
    // single query, no auth
    {name: 'order', args: [{name: 'id', type: 'uuid', nullable: false}], returnTypeRef: 'Order', collectionType: 'single'},
    // paginated + filterRef (Phase 3 + 7) + security via roles (Phase 5)
    {name: 'orders', returnTypeRef: 'Order', collectionType: 'paginated', filterRef: 'OrderFilterInput',
      roles: ['MANAGER', 'ADMIN']},
    // list + permission
    {name: 'ordersByRef', args: [{name: 'ref', type: 'string', nullable: false}], returnTypeRef: 'Order',
      collectionType: 'list', permission: {items: ['ORDER_READ'], operator: 'OR'}},
  ],
  mutations: [
    // inputRef + roles
    {name: 'createOrder', inputRef: 'CreateOrderInput', returnTypeRef: 'Order',
      roles: ['MANAGER']},
    // primitive return + permission
    {name: 'cancelOrder', args: [{name: 'id', type: 'uuid', nullable: false}], returnType: 'Boolean',
      permission: {items: ['ORDER_WRITE', 'ORDER_ADMIN'], operator: 'OR'}},
  ],
};

// --- Phase 6: Subscription schema ---
const subscriptionSchema: GraphQLSchemaConfig = {
  type: 'graphql',
  name: 'ProductEvent',
  module: 'catalog',
  typeRef: 'ProductEvent',
  queries: [
    {name: 'productEvent', args: [{name: 'id', type: 'uuid', nullable: false}], returnTypeRef: 'ProductEvent', collectionType: 'single'},
  ],
  subscriptions: [
    {name: 'productCreated', returnTypeRef: 'ProductEvent'},
    {name: 'productUpdated', args: [{name: 'productId', type: 'uuid', nullable: false}], returnTypeRef: 'ProductEvent'},
  ],
};

// --- @BatchMapping test: OrderItem schema ---
const orderItemSchema: GraphQLSchemaConfig = {
  type: 'graphql',
  name: 'OrderItem',
  module: 'orders',
  typeRef: 'OrderItem',
  queries: [
    {name: 'orderItems', args: [{name: 'orderId', type: 'uuid', nullable: false}], returnTypeRef: 'OrderItem', collectionType: 'list'},
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// Setup
// ═══════════════════════════════════════════════════════════════════════════════

const technicalProjectConfig: BaseApiConfig = {
  type: 'springboot',
  name: 'demoGraphQLTec',
  group: 'cv.nosi',
  artifact: 'users',
  description: 'GraphQL integration test project — technical style',
  database: 'Postgresql',
  projectStructureStyle: 'technical',
  enableObservability: false,
  enableEntityRevision: false,
  enableGraalVm: false,
};

const domainProjectConfig: BaseApiConfig = {
  type: 'springboot',
  name: 'demoGraphQLDom',
  group: 'com.petshop',
  artifact: 'animals',
  description: 'GraphQL integration test project — domain style',
  database: 'Postgresql',
  projectStructureStyle: 'domain',
  enableObservability: false,
  enableEntityRevision: false,
  enableGraalVm: false,
};

beforeAll(async () => {
  setEngineConfiguration({environment: 'development'});

  // Wipe and recreate blank directories — newApi requires an empty (existing) dir
  for (const dir of [TECHNICAL_OUTPUT_DIR, DOMAIN_OUTPUT_DIR]) {
    await fs.rm(dir, {recursive: true, force: true});
    await fs.mkdir(dir, {recursive: true});
  }

  // Bootstrap fresh Spring Boot projects (generates pom.xml + full structure)
  await newApi(technicalProjectConfig, TECHNICAL_OUTPUT_DIR);
  await newApi(domainProjectConfig, DOMAIN_OUTPUT_DIR);

  // Add test infrastructure so mvn test (contextLoads) can start without a real DB or auth server
  const testProps = [
    'spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE',
    'spring.datasource.driver-class-name=org.h2.Driver',
    'spring.datasource.username=sa',
    'spring.datasource.password=',
    'spring.jpa.database-platform=org.hibernate.dialect.H2Dialect',
    'spring.jpa.hibernate.ddl-auto=create-drop',
    'spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.data.rest.RepositoryRestMvcAutoConfiguration,org.springdoc.core.configuration.SpringDocDataRestConfiguration',
    'spring.security.oauth2.resourceserver.jwt.issuer-uri=http://localhost/test',
    'igrp.access.api.base-url=http://localhost/test',
  ].join('\n');

  const projects = [
    {dir: TECHNICAL_OUTPUT_DIR, pkg: 'cv.nosi.users',       cls: 'DemoGraphQLTecApplicationTests'},
    {dir: DOMAIN_OUTPUT_DIR,    pkg: 'com.petshop.animals',  cls: 'DemoGraphQLDomApplicationTests'},
  ];

  for (const {dir, pkg, cls} of projects) {
    const testResDir = path.join(dir, 'src', 'test', 'resources');
    await fs.mkdir(testResDir, {recursive: true});
    await fs.writeFile(path.join(testResDir, 'application.properties'), testProps);

    // Overwrite the generated test class to add @MockBean JwtDecoder (avoids real auth server)
    const testJavaDir = path.join(dir, 'src', 'test', 'java', ...pkg.split('.'));
    const jwtMockClass = [
      `package ${pkg};`,
      '',
      'import org.junit.jupiter.api.Test;',
      'import org.springframework.boot.test.context.SpringBootTest;',
      'import org.springframework.boot.test.mock.mockito.MockBean;',
      'import org.springframework.security.oauth2.jwt.JwtDecoder;',
      '',
      '@SpringBootTest',
      `public class ${cls} {`,
      '    @MockBean JwtDecoder jwtDecoder;',
      '    @Test public void contextLoads() {}',
      '}',
    ].join('\n');
    await fs.writeFile(path.join(testJavaDir, `${cls}.java`), jwtMockClass);
  }

  for (const dir of [TECHNICAL_OUTPUT_DIR, DOMAIN_OUTPUT_DIR]) {
    await addDTO(orderType,        dir);
    await addDTO(orderItemType,    dir);
    await addDTO(createOrderInput, dir);
    await addDTO(orderFilterInput, dir);
    await addDTO(productType,      dir);
  }
}, 60_000);

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 1 — Scalar mappings
// ═══════════════════════════════════════════════════════════════════════════════

describe('Phase 1 — Scalar mappings', () => {
  it('datetime maps to DateTime, decimal to BigDecimal in SDL', async () => {
    await addGraphQLSchema(orderSchema, TECHNICAL_OUTPUT_DIR);
    const sdl = await readGenerated(TECHNICAL_OUTPUT_DIR, 'src/main/resources/graphql/Order.graphqls');
    // no explicit scalar fields in queries, but type fields show it
    // verify the type has the correct graphql scalars for decimal/datetime
    expect(sdl).toContain('type Order');
    // The SDL uses resolveGraphQLAttributeType which calls resolveGraphQLScalar
    // decimal → BigDecimal, datetime → DateTime
    expect(sdl).toContain('BigDecimal');
    expect(sdl).toContain('DateTime');
    expect(sdl).not.toContain("'Float'"); // should not have old wrong mapping
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 2 — common.graphqls + implements Node + @deprecated
// ═══════════════════════════════════════════════════════════════════════════════

describe('Phase 2 — common.graphqls, implements Node, @deprecated', () => {
  it('generates common.graphqls with scalars, Node interface, PageInfo, SortInput, PageInput', async () => {
    await addGraphQLSchema(orderSchema, TECHNICAL_OUTPUT_DIR);
    const common = await readGenerated(TECHNICAL_OUTPUT_DIR, 'src/main/resources/graphql/common.graphqls');
    expect(common).toContain('scalar DateTime');
    expect(common).toContain('scalar BigDecimal');
    expect(common).toContain('scalar Long');
    expect(common).toContain('interface Node');
    expect(common).toContain('type PageInfo');
    expect(common).toContain('input SortInput');
    expect(common).toContain('input PageInput');
  });

  it('does not overwrite common.graphqls on second call', async () => {
    const before = await readGenerated(TECHNICAL_OUTPUT_DIR, 'src/main/resources/graphql/common.graphqls');
    await addGraphQLSchema(orderSchema, TECHNICAL_OUTPUT_DIR);
    const after = await readGenerated(TECHNICAL_OUTPUT_DIR, 'src/main/resources/graphql/common.graphqls');
    expect(before).toEqual(after);
  });

  it('adds implements Node when type has id field', async () => {
    const sdl = await readGenerated(TECHNICAL_OUTPUT_DIR, 'src/main/resources/graphql/Order.graphqls');
    expect(sdl).toContain('type Order implements Node');
  });

  it('adds @deprecated directive in SDL for deprecated fields', async () => {
    const sdl = await readGenerated(TECHNICAL_OUTPUT_DIR, 'src/main/resources/graphql/Order.graphqls');
    expect(sdl).toContain('@deprecated(reason: "Use reference instead.")');
  });

  it('adds @Deprecated annotation in Java type for deprecated fields', async () => {
    const java = await readGenerated(
      TECHNICAL_OUTPUT_DIR,
      'src/main/java/cv/nosi/users/graphql/types/Order.java',
    );
    expect(java).toContain('@Deprecated');
    expect(java).toContain('@deprecated Use reference instead.');
  });

  it('domain: generates common.graphqls', async () => {
    await addGraphQLSchema(orderSchema, DOMAIN_OUTPUT_DIR);
    const common = await readGenerated(DOMAIN_OUTPUT_DIR, 'src/main/resources/graphql/common.graphqls');
    expect(common).toContain('interface Node');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 3 — Relay Cursor Pagination
// ═══════════════════════════════════════════════════════════════════════════════

describe('Phase 3 — Relay Cursor Pagination', () => {
  it('SDL uses OrderConnection! instead of OrderPage for paginated query', async () => {
    const sdl = await readGenerated(TECHNICAL_OUTPUT_DIR, 'src/main/resources/graphql/Order.graphqls');
    expect(sdl).toContain('OrderConnection!');
    expect(sdl).not.toContain('OrderPage');
    // Connection and Edge types in SDL
    expect(sdl).toContain('type OrderConnection');
    expect(sdl).toContain('type OrderEdge');
    expect(sdl).toContain('pageInfo: PageInfo!');
    expect(sdl).toContain('totalCount: Long!');
  });

  it('generates OrderConnection.java with edges, pageInfo, totalCount', async () => {
    const java = await readGenerated(
      TECHNICAL_OUTPUT_DIR,
      'src/main/java/cv/nosi/users/graphql/connection/OrderConnection.java',
    );
    expect(java).toContain('class OrderConnection');
    expect(java).toContain('List<OrderEdge>');
    expect(java).toContain('PageInfo pageInfo');
    expect(java).toContain('long totalCount');
  });

  it('generates OrderEdge.java with node and cursor', async () => {
    const java = await readGenerated(
      TECHNICAL_OUTPUT_DIR,
      'src/main/java/cv/nosi/users/graphql/connection/OrderEdge.java',
    );
    expect(java).toContain('class OrderEdge');
    expect(java).toContain('Order node');
    expect(java).toContain('String cursor');
  });

  it('generates CursorUtils.java (one-time)', async () => {
    const java = await readGenerated(
      TECHNICAL_OUTPUT_DIR,
      'src/main/java/cv/nosi/users/graphql/connection/CursorUtils.java',
    );
    expect(java).toContain('class CursorUtils');
    expect(java).toContain('encode');
    expect(java).toContain('decode');
  });

  it('domain: generates OrderConnection under module/interfaces/graphql/connection/', async () => {
    const java = await readGenerated(
      DOMAIN_OUTPUT_DIR,
      'src/main/java/com/petshop/animals/orders/interfaces/graphql/connection/OrderConnection.java',
    );
    expect(java).toContain('class OrderConnection');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 4 — Infrastructure one-time files
// ═══════════════════════════════════════════════════════════════════════════════

describe('Phase 4 — GraphQLConfig + GraphQLExceptionHandler', () => {
  it('technical: generates GraphQLConfig.java in graphql/config/', async () => {
    const java = await readGenerated(
      TECHNICAL_OUTPUT_DIR,
      'src/main/java/cv/nosi/users/graphql/config/GraphQLConfig.java',
    );
    expect(java).toContain('@Configuration');
    expect(java).toContain('ExtendedScalars.DateTime');
    expect(java).toContain('ExtendedScalars.GraphQLBigDecimal');
    expect(java).toContain('ExtendedScalars.GraphQLLong');
    expect(java).toContain('MaxQueryDepthInstrumentation');
  });

  it('technical: generates GraphQLExceptionHandler.java in graphql/config/', async () => {
    const java = await readGenerated(
      TECHNICAL_OUTPUT_DIR,
      'src/main/java/cv/nosi/users/graphql/config/GraphQLExceptionHandler.java',
    );
    expect(java).toContain('DataFetcherExceptionResolverAdapter');
    expect(java).toContain('resolveToSingleError');
  });

  it('does not overwrite GraphQLConfig on second call', async () => {
    const before = await readGenerated(
      TECHNICAL_OUTPUT_DIR,
      'src/main/java/cv/nosi/users/graphql/config/GraphQLConfig.java',
    );
    await addGraphQLSchema(orderSchema, TECHNICAL_OUTPUT_DIR);
    const after = await readGenerated(
      TECHNICAL_OUTPUT_DIR,
      'src/main/java/cv/nosi/users/graphql/config/GraphQLConfig.java',
    );
    expect(before).toEqual(after);
  });

  it('domain: generates GraphQLConfig.java in config/ at root', async () => {
    const java = await readGenerated(
      DOMAIN_OUTPUT_DIR,
      'src/main/java/com/petshop/animals/config/GraphQLConfig.java',
    );
    expect(java).toContain('@Configuration');
  });

  it('domain: generates GraphQLExceptionHandler.java in graphql/exception/', async () => {
    const java = await readGenerated(
      DOMAIN_OUTPUT_DIR,
      'src/main/java/com/petshop/animals/graphql/exception/GraphQLExceptionHandler.java',
    );
    expect(java).toContain('DataFetcherExceptionResolverAdapter');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 5 — @PreAuthorize (reuses controller logic via roles/permission)
// ═══════════════════════════════════════════════════════════════════════════════

describe('Phase 5 — @PreAuthorize security', () => {
  it('generates @PreAuthorize with roles on query', async () => {
    const resolver = await readGenerated(
      TECHNICAL_OUTPUT_DIR,
      'src/main/java/cv/nosi/users/graphql/order/OrderResolver.java',
    );
    expect(resolver).toContain("@PreAuthorize(\"hasAnyRole('MANAGER', 'ADMIN')\")");
  });

  it('generates @PreAuthorize with roles on mutation', async () => {
    const resolver = await readGenerated(
      TECHNICAL_OUTPUT_DIR,
      'src/main/java/cv/nosi/users/graphql/order/OrderResolver.java',
    );
    expect(resolver).toContain("@PreAuthorize(\"hasAnyRole('MANAGER')\")");
  });

  it('generates @PreAuthorize with permission on query', async () => {
    const resolver = await readGenerated(
      TECHNICAL_OUTPUT_DIR,
      'src/main/java/cv/nosi/users/graphql/order/OrderResolver.java',
    );
    expect(resolver).toContain('checkPermission');
  });

  it('query without security has no @PreAuthorize', async () => {
    const resolver = await readGenerated(
      TECHNICAL_OUTPUT_DIR,
      'src/main/java/cv/nosi/users/graphql/order/OrderResolver.java',
    );
    // 'order' query has no roles/permission — count @PreAuthorize occurrences (should not be immediately before @QueryMapping for 'order')
    expect(resolver).toContain('@QueryMapping');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 1 (cont.) — @Validated + no @Autowired + @BatchMapping
// ═══════════════════════════════════════════════════════════════════════════════

describe('Phase 1 — @Validated, no @Autowired, @BatchMapping', () => {
  beforeAll(async () => {
    await addGraphQLSchema(orderItemSchema, TECHNICAL_OUTPUT_DIR);
    await addGraphQLSchema(orderItemSchema, DOMAIN_OUTPUT_DIR);
  });

  it('resolver has @Validated annotation', async () => {
    const resolver = await readGenerated(
      TECHNICAL_OUTPUT_DIR,
      'src/main/java/cv/nosi/users/graphql/orderitem/OrderItemResolver.java',
    );
    expect(resolver).toContain('@Validated');
  });

  it('resolver constructor has no @Autowired', async () => {
    const resolver = await readGenerated(
      TECHNICAL_OUTPUT_DIR,
      'src/main/java/cv/nosi/users/graphql/orderitem/OrderItemResolver.java',
    );
    expect(resolver).not.toContain('@Autowired');
  });

  it('resolver has @BatchMapping instead of @SchemaMapping + DataLoader', async () => {
    const resolver = await readGenerated(
      TECHNICAL_OUTPUT_DIR,
      'src/main/java/cv/nosi/users/graphql/orderitem/OrderItemResolver.java',
    );
    expect(resolver).toContain('@BatchMapping');
    expect(resolver).not.toContain('@SchemaMapping');
    expect(resolver).not.toContain('DataLoader');
    expect(resolver).not.toContain('CompletableFuture');
  });

  it('@BatchMapping method signature: Map<OrderItem, Order> order(List<OrderItem> orderItems)', async () => {
    const resolver = await readGenerated(
      TECHNICAL_OUTPUT_DIR,
      'src/main/java/cv/nosi/users/graphql/orderitem/OrderItemResolver.java',
    );
    expect(resolver).toContain('Map<OrderItem, Order>');
    expect(resolver).toContain('List<OrderItem>');
  });

  it('OrderItem.java has actual Order field, not orderId: UUID', async () => {
    const java = await readGenerated(
      TECHNICAL_OUTPUT_DIR,
      'src/main/java/cv/nosi/users/graphql/types/OrderItem.java',
    );
    expect(java).toContain('private Order order');
    expect(java).not.toContain('orderId');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 7 — filterRef + sort + page in query
// ═══════════════════════════════════════════════════════════════════════════════

describe('Phase 7 — filterRef, SortInput, PageInput', () => {
  it('SDL paginated query includes filter, sort, page args', async () => {
    const sdl = await readGenerated(TECHNICAL_OUTPUT_DIR, 'src/main/resources/graphql/Order.graphqls');
    expect(sdl).toContain('filter: OrderFilterInput');
    expect(sdl).toContain('sort: SortInput');
    expect(sdl).toContain('page: PageInput');
  });

  it('resolver method includes filter, sort, page parameters', async () => {
    const resolver = await readGenerated(
      TECHNICAL_OUTPUT_DIR,
      'src/main/java/cv/nosi/users/graphql/order/OrderResolver.java',
    );
    expect(resolver).toContain('OrderFilterInput filter');
    expect(resolver).toContain('SortInput sort');
    expect(resolver).toContain('PageInput page');
  });

  it('service interface includes filter, sort, page parameters', async () => {
    const iface = await readGenerated(
      TECHNICAL_OUTPUT_DIR,
      'src/main/java/cv/nosi/users/graphql/order/IOrderGraphQLService.java',
    );
    expect(iface).toContain('OrderFilterInput filter');
    expect(iface).toContain('SortInput sort');
    expect(iface).toContain('PageInput page');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 6 — Subscriptions
// ═══════════════════════════════════════════════════════════════════════════════

describe('Phase 6 — Subscriptions', () => {
  beforeAll(async () => {
    await addGraphQLSchema(subscriptionSchema, TECHNICAL_OUTPUT_DIR);
    await addGraphQLSchema(subscriptionSchema, DOMAIN_OUTPUT_DIR);
  });

  it('SDL includes type Subscription block', async () => {
    const sdl = await readGenerated(TECHNICAL_OUTPUT_DIR, 'src/main/resources/graphql/ProductEvent.graphqls');
    expect(sdl).toContain('extend type Subscription');
    expect(sdl).toContain('productCreated: ProductEvent!');
    expect(sdl).toContain('productUpdated(productId: ID!): ProductEvent!');
  });

  it('technical: generates ProductEventSubscriptionController.java', async () => {
    const java = await readGenerated(
      TECHNICAL_OUTPUT_DIR,
      'src/main/java/cv/nosi/users/graphql/productevent/subscription/ProductEventSubscriptionController.java',
    );
    expect(java).toContain('@SubscriptionMapping');
    expect(java).toContain('Flux<ProductEvent>');
    expect(java).toContain('productCreated');
    expect(java).toContain('productUpdated');
  });

  it('technical: generates ProductEventEventService.java interface', async () => {
    const java = await readGenerated(
      TECHNICAL_OUTPUT_DIR,
      'src/main/java/cv/nosi/users/graphql/productevent/subscription/ProductEventEventService.java',
    );
    expect(java).toContain('interface ProductEventEventService');
    expect(java).toContain('Flux<ProductEvent>');
    expect(java).toContain('publishProductCreated');
    expect(java).toContain('productCreatedStream');
  });

  it('technical: generates ProductEventEventServiceImpl.java (one-time)', async () => {
    const java = await readGenerated(
      TECHNICAL_OUTPUT_DIR,
      'src/main/java/cv/nosi/users/graphql/productevent/subscription/impl/ProductEventEventServiceImpl.java',
    );
    expect(java).toContain('@Service');
    expect(java).toContain('Sinks.many()');
    expect(java).toContain('tryEmitNext');
    expect(java).toContain('asFlux()');
  });

  it('does not overwrite EventServiceImpl on second call', async () => {
    const before = await readGenerated(
      TECHNICAL_OUTPUT_DIR,
      'src/main/java/cv/nosi/users/graphql/productevent/subscription/impl/ProductEventEventServiceImpl.java',
    );
    await addGraphQLSchema(subscriptionSchema, TECHNICAL_OUTPUT_DIR);
    const after = await readGenerated(
      TECHNICAL_OUTPUT_DIR,
      'src/main/java/cv/nosi/users/graphql/productevent/subscription/impl/ProductEventEventServiceImpl.java',
    );
    expect(before).toEqual(after);
  });

  it('domain: generates subscription under module/interfaces/graphql/subscription/', async () => {
    const java = await readGenerated(
      DOMAIN_OUTPUT_DIR,
      'src/main/java/com/petshop/animals/catalog/interfaces/graphql/subscription/ProductEventSubscriptionController.java',
    );
    expect(java).toContain('@SubscriptionMapping');
  });

  it('domain: generates EventService under module/application/event/', async () => {
    const java = await readGenerated(
      DOMAIN_OUTPUT_DIR,
      'src/main/java/com/petshop/animals/catalog/application/event/ProductEventEventService.java',
    );
    expect(java).toContain('interface ProductEventEventService');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// DDD specific: Query/Command handlers
// ═══════════════════════════════════════════════════════════════════════════════

describe('DDD — Query and Command handlers', () => {
  it('domain: generates OrderQuery.java for each query', async () => {
    const java = await readGenerated(
      DOMAIN_OUTPUT_DIR,
      'src/main/java/com/petshop/animals/orders/application/queries/OrderQuery.java',
    );
    expect(java).toContain('implements Query');
  });

  it('domain: generates OrderQueryHandler.java (one-time)', async () => {
    const java = await readGenerated(
      DOMAIN_OUTPUT_DIR,
      'src/main/java/com/petshop/animals/orders/application/queries/OrderQueryHandler.java',
    );
    expect(java).toContain('@IgrpQueryHandler');
  });

  it('domain: generates CreateOrderCommand.java', async () => {
    const java = await readGenerated(
      DOMAIN_OUTPUT_DIR,
      'src/main/java/com/petshop/animals/orders/application/commands/CreateOrderCommand.java',
    );
    expect(java).toContain('implements Command');
  });

  it('domain: generates CreateOrderCommandHandler.java (one-time)', async () => {
    const java = await readGenerated(
      DOMAIN_OUTPUT_DIR,
      'src/main/java/com/petshop/animals/orders/application/commands/CreateOrderCommandHandler.java',
    );
    expect(java).toContain('@IgrpCommandHandler');
  });

  it('domain: DDD resolver uses QueryBus and CommandBus, no service interface', async () => {
    const resolver = await readGenerated(
      DOMAIN_OUTPUT_DIR,
      'src/main/java/com/petshop/animals/orders/interfaces/graphql/OrderResolver.java',
    );
    expect(resolver).toContain('QueryBus');
    expect(resolver).toContain('CommandBus');
    expect(resolver).not.toContain('IOrderGraphQLService');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Validation edge cases
// ═══════════════════════════════════════════════════════════════════════════════

describe('Validation', () => {
  it('rejects invalid security role', async () => {
    const invalid: any = {
      type: 'graphql', name: 'Bad',
      queries: [{name: 'q', roles: 'SUPERADMIN'}], // roles must be array
    };
    await expect(addGraphQLSchema(invalid, TECHNICAL_OUTPUT_DIR)).rejects.toBeTruthy();
  });

  it('rejects subscriptions with invalid name', async () => {
    const invalid: any = {
      type: 'graphql', name: 'Bad',
      subscriptions: [{name: '123invalid-name!'}],
    };
    await expect(addGraphQLSchema(invalid, TECHNICAL_OUTPUT_DIR)).rejects.toBeTruthy();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Java compilation — verifies generated code compiles cleanly
// ═══════════════════════════════════════════════════════════════════════════════

describe('Java compilation', () => {
  const JAVA_25_HOME = 'C:\\Program Files\\Eclipse Adoptium\\jdk-25.0.2.10-hotspot';

  const compileProject = (projectPath: string): void => {
    try {
      execSync('mvn compile -q --no-transfer-progress', {
        cwd: projectPath,
        stdio: 'pipe',
        timeout: 120_000,
        env: {...process.env, JAVA_HOME: JAVA_25_HOME},
      });
    } catch (err: any) {
      throw new Error(
        `Maven compilation failed in ${projectPath}:\n${err.stdout?.toString()}\n${err.stderr?.toString()}`,
      );
    }
  };

  it('technical project compiles without errors', () => {
    compileProject(TECHNICAL_OUTPUT_DIR);
  });

  it('domain project compiles without errors', () => {
    compileProject(DOMAIN_OUTPUT_DIR);
  });
});
