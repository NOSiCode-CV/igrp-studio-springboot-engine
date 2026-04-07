import {addGraphQLSchema, setEngineConfiguration} from '../src';
import {GraphQLSchemaConfig} from '../src/interfaces/types';
// @ts-ignore
import {DOMAIN_OUTPUT_DIR, TECHNICAL_OUTPUT_DIR} from './outputDirPath';

beforeAll(async () => {
  setEngineConfiguration({ environment: 'development' });
});

// ─── Configs ──────────────────────────────────────────────────────────────────

const productConfig: GraphQLSchemaConfig = {
  type: 'graphql',
  name: 'Product',
  module: 'shared',
  fields: [
    { name: 'id', type: 'uuid', nullable: false },
    { name: 'name', type: 'string', nullable: false },
    { name: 'price', type: 'double', nullable: true },
    { name: 'active', type: 'boolean', nullable: true },
    { name: 'createdAt', type: 'datetime', nullable: true },
  ],
  queries: [
    { name: 'findProductById', args: [{ name: 'id', type: 'uuid', nullable: false }] },
    { name: 'findAllProducts', paginated: true },
  ],
  mutations: [
    { name: 'createProduct' },
    { name: 'updateProduct', args: [{ name: 'id', type: 'uuid', nullable: false }] },
    { name: 'deleteProduct', args: [{ name: 'id', type: 'uuid', nullable: false }], returnType: 'Boolean' },
  ],
};

const orderConfig: GraphQLSchemaConfig = {
  type: 'graphql',
  name: 'Order',
  module: 'demo',        // 'demo' exists in both projects
  fields: [
    { name: 'id', type: 'uuid', nullable: false },
    { name: 'total', type: 'double', nullable: false },
    { name: 'status', type: 'string', nullable: false },
  ],
  queries: [
    { name: 'findOrderById', args: [{ name: 'id', type: 'uuid', nullable: false }] },
    { name: 'findAllOrders', paginated: true },
  ],
  mutations: [
    { name: 'createOrder' },
    { name: 'cancelOrder', args: [{ name: 'id', type: 'uuid', nullable: false }], returnType: 'Boolean' },
  ],
};

const invoiceConfig: GraphQLSchemaConfig = {
  type: 'graphql',
  name: 'Invoice',
  module: 'core',        // 'core' exists in demoTechnical
  fields: [
    { name: 'id', type: 'uuid', nullable: false },
    { name: 'amount', type: 'double', nullable: false },
  ],
  queries: [
    { name: 'findInvoiceById', args: [{ name: 'id', type: 'uuid', nullable: false }] },
  ],
  relations: [
    { entity: 'CustomerEntity', fieldName: 'customer' },
    { entity: 'ProductEntity', fieldName: 'lineItems' },
  ],
};

const categoryConfig: GraphQLSchemaConfig = {
  type: 'graphql',
  name: 'Category',
  module: 'shared',
  fields: [
    { name: 'id', type: 'uuid', nullable: false },
    { name: 'label', type: 'string', nullable: false },
  ],
  queries: [
    { name: 'findCategoryById', args: [{ name: 'id', type: 'uuid', nullable: false }] },
  ],
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('addGraphQLSchema — technical style', () => {
  it('should generate with direct fields', async () => {
    await addGraphQLSchema(productConfig, TECHNICAL_OUTPUT_DIR);
  });

  it('should generate with queries and mutations', async () => {
    await addGraphQLSchema(orderConfig, TECHNICAL_OUTPUT_DIR);
  });

  it('should generate with relations (triggers DataLoader)', async () => {
    await addGraphQLSchema(invoiceConfig, TECHNICAL_OUTPUT_DIR);
  });

  it('should generate without relations (no DataLoader)', async () => {
    await addGraphQLSchema(categoryConfig, TECHNICAL_OUTPUT_DIR);
  });

  it('should not overwrite service file on second call', async () => {
    await addGraphQLSchema(productConfig, TECHNICAL_OUTPUT_DIR);
    await addGraphQLSchema(productConfig, TECHNICAL_OUTPUT_DIR);
  });
});

describe('addGraphQLSchema — domain style', () => {
  it('should generate with direct fields', async () => {
    await addGraphQLSchema(productConfig, DOMAIN_OUTPUT_DIR);
  });

  it('should generate with queries and mutations', async () => {
    await addGraphQLSchema(orderConfig, DOMAIN_OUTPUT_DIR);
  });

  it('should generate without relations', async () => {
    await addGraphQLSchema(categoryConfig, DOMAIN_OUTPUT_DIR);
  });
});

describe('addGraphQLSchema — module fallback', () => {
  it('should fall back to shared when module does not exist', async () => {
    const config: GraphQLSchemaConfig = {
      type: 'graphql',
      name: 'Report',
      module: 'nonexistent',
      fields: [{ name: 'id', type: 'uuid', nullable: false }],
      queries: [{ name: 'findReportById', args: [{ name: 'id', type: 'uuid' }] }],
    };

    await addGraphQLSchema(config, TECHNICAL_OUTPUT_DIR);
    await addGraphQLSchema(config, DOMAIN_OUTPUT_DIR);
  });
});

describe('addGraphQLSchema — validation', () => {
  it('should throw when config type is wrong', async () => {
    const invalid: any = { type: 'controller', name: 'Bad' };
    await expect(addGraphQLSchema(invalid, TECHNICAL_OUTPUT_DIR)).rejects.toBeTruthy();
  });

  it('should throw when name is missing', async () => {
    const invalid: any = { type: 'graphql' };
    await expect(addGraphQLSchema(invalid, TECHNICAL_OUTPUT_DIR)).rejects.toBeTruthy();
  });
});
