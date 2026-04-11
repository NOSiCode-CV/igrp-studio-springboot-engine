/**
 * addGraphQLSchema — end-to-end tests
 *
 * One comprehensive schema (Product) that exercises every generation case:
 *   - All three collectionTypes: single, list, paginated
 *   - Mutations: with inputRef, with inputRef + extra arg, with Boolean return
 *   - Multiple inputRefs: CreateProductInput + UpdateProductInput
 *   - DataLoader: Product.category is a graphqlType attribute
 *   - ProductPage: generated because of the paginated query
 *
 * The same schema is run for both technical and domain project styles.
 */
import {addDTO, addGraphQLSchema, setEngineConfiguration} from '../src';
import {DTOConfig, GraphQLSchemaConfig} from '../src/interfaces/types';
// @ts-ignore
import {DOMAIN_OUTPUT_DIR, TECHNICAL_OUTPUT_DIR} from './outputDirPath';

// ═══════════════════════════════════════════════════════════════════════════════
// DTO MANIFESTS — prerequisites (seeded in beforeAll)
// ═══════════════════════════════════════════════════════════════════════════════

// Shared — no dependencies
const categoryType: DTOConfig = {
  type: 'graphqlType',
  name: 'Category',
  module: 'shared',
  template: 'classic',
  attributes: [
    {name: 'id',    objectType: 'java', type: 'uuid',   required: true, primaryKey: true},
    {name: 'label', objectType: 'java', type: 'string', required: true},
  ],
};

// Catalog — has a graphqlType attribute (category) → triggers DataLoader in productSchema
const productType: DTOConfig = {
  type: 'graphqlType',
  name: 'Product',
  module: 'catalog',
  template: 'classic',
  attributes: [
    {name: 'id',       objectType: 'java',        type: 'uuid',     required: true, primaryKey: true},
    {name: 'name',     objectType: 'java',        type: 'string',   required: true},
    {name: 'price',    objectType: 'java',        type: 'double',   required: true},
    {name: 'active',   objectType: 'java',        type: 'boolean',  required: false},
    {name: 'category', objectType: 'graphqlType', type: 'Category', required: false, module: 'shared'},
  ],
};

const createProductInput: DTOConfig = {
  type: 'graphqlInput',
  name: 'CreateProductInput',
  module: 'catalog',
  template: 'classic',
  attributes: [
    {name: 'name',       objectType: 'java', type: 'string', required: true,  maxLength: 255},
    {name: 'price',      objectType: 'java', type: 'double', required: true},
    {name: 'categoryId', objectType: 'java', type: 'uuid',   required: false},
  ],
};

const updateProductInput: DTOConfig = {
  type: 'graphqlInput',
  name: 'UpdateProductInput',
  module: 'catalog',
  template: 'record',
  attributes: [
    {name: 'name',  objectType: 'java', type: 'string', required: false, maxLength: 255},
    {name: 'price', objectType: 'java', type: 'double', required: false},
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCHEMA CONFIG — one schema, all use cases
// ═══════════════════════════════════════════════════════════════════════════════

const productSchema: GraphQLSchemaConfig = {
  type: 'graphql',
  name: 'Product',
  module: 'catalog',
  typeRef: 'Product',
  inputRefs: ['CreateProductInput', 'UpdateProductInput'],
  queries: [
    // single — returns one Product
    {name: 'findProductById',  args: [{name: 'id', type: 'uuid', nullable: false}], returnTypeRef: 'Product', collectionType: 'single'},
    // list — returns List<Product>
    {name: 'findAllProducts',  returnTypeRef: 'Product', collectionType: 'list'},
    // paginated — triggers ProductPage manifest + ProductPage.java
    {name: 'findProductsPage',args: [{name: 'page', type: 'integer', nullable: false},{name: 'size', type: 'integer', nullable: false}], returnTypeRef: 'Product', collectionType: 'paginated'},
  ],
  mutations: [
    // inputRef only — create
    {name: 'createProduct', inputRef: 'CreateProductInput', returnTypeRef: 'Product'},
    // inputRef + extra arg — update
    {name: 'updateProduct', inputRef: 'UpdateProductInput', args: [{name: 'id', type: 'uuid', nullable: false}], returnTypeRef: 'Product'},
    // Boolean return — no input, no type wrapping
    {name: 'deleteProduct', args: [{name: 'id', type: 'uuid', nullable: false}], returnType: 'Boolean'},
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// SETUP
// ═══════════════════════════════════════════════════════════════════════════════

beforeAll(async () => {
  setEngineConfiguration({environment: 'development'});
  for (const dir of [TECHNICAL_OUTPUT_DIR, DOMAIN_OUTPUT_DIR]) {
    await addDTO(categoryType,       dir); // shared — no deps
    await addDTO(productType,        dir); // catalog — depends on Category
    await addDTO(createProductInput, dir);
    await addDTO(updateProductInput, dir);
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('addGraphQLSchema — technical', () => {
  it('generates schema, resolver, service interface, service impl, DataLoader and ProductPage', async () => {
    await addGraphQLSchema(productSchema, TECHNICAL_OUTPUT_DIR);
  });

  it('second call does not overwrite service implementation', async () => {
    await addGraphQLSchema(productSchema, TECHNICAL_OUTPUT_DIR);
  });
});

describe('addGraphQLSchema — domain', () => {
  it('generates schema, resolver, DataLoader and ProductPage under the module path', async () => {
    await addGraphQLSchema(productSchema, DOMAIN_OUTPUT_DIR);
  });

  it('second call does not overwrite service implementation', async () => {
    await addGraphQLSchema(productSchema, DOMAIN_OUTPUT_DIR);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// VALIDATION
// ═══════════════════════════════════════════════════════════════════════════════

describe('addGraphQLSchema — validation', () => {
  it('should throw when config type is wrong', async () => {
    const invalid: any = {type: 'controller', name: 'Bad'};
    await expect(addGraphQLSchema(invalid, TECHNICAL_OUTPUT_DIR)).rejects.toBeTruthy();
  });

  it('should throw when name is missing', async () => {
    const invalid: any = {type: 'graphql'};
    await expect(addGraphQLSchema(invalid, TECHNICAL_OUTPUT_DIR)).rejects.toBeTruthy();
  });

  it('should throw when typeRef manifest does not exist', async () => {
    const invalid: GraphQLSchemaConfig = {
      type: 'graphql',
      name: 'Ghost',
      module: 'shared',
      typeRef: 'NonExistentType',
      queries: [{name: 'findGhost', args: [{name: 'id', type: 'uuid', nullable: false}], returnTypeRef: 'NonExistentType', collectionType: 'single'}],
    };
    await expect(addGraphQLSchema(invalid, TECHNICAL_OUTPUT_DIR)).rejects.toBeTruthy();
  });
});
