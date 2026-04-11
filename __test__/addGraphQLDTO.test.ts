/**
 * addDTO — GraphQL Types & Inputs
 *
 * Two end-to-end examples covering every use case:
 *
 * Example 1 — Product Catalog (modules: shared + catalog)
 *   graphqlType: Category (primitive only, classic + record variant)
 *   graphqlType: Product  (with Category relation, cross-module)
 *   graphqlInput: CreateProductInput (Jakarta validation, classic)
 *   graphqlInput: UpdateProductInput (all optional, record)
 *
 * Example 2 — Order Management (modules: shared + orders)
 *   graphqlType: Customer   (primitive only, shared module)
 *   graphqlType: OrderItem  (single Product relation, cross-module catalog→orders)
 *   graphqlType: Order      (two relations: customer single + items list)
 *   graphqlInput: CreateOrderInput (classic)
 *
 * Output paths:
 *   technical  →  src/main/java/<group>/<pkg>/graphql/types/<Name>.java
 *   domain     →  src/main/java/<group>/<pkg>/<module>/interfaces/graphql/types/<Name>.java
 */
import {addDTO, setEngineConfiguration} from '../src';
import {DTOConfig} from '../src/interfaces/types';
// @ts-ignore
import {DOMAIN_OUTPUT_DIR, TECHNICAL_OUTPUT_DIR} from './outputDirPath';

beforeAll(() => {
  setEngineConfiguration({environment: 'development'});
});

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED CONFIGS — used across examples
// ═══════════════════════════════════════════════════════════════════════════════

// Shared primitive type — no relations
const categoryType: DTOConfig = {
  type: 'graphqlType',
  name: 'Category',
  module: 'shared',
  template: 'classic',
  attributes: [
    {name: 'id',     objectType: 'java', type: 'uuid',    required: true, primaryKey: true},
    {name: 'label',  objectType: 'java', type: 'string',  required: true},
    {name: 'active', objectType: 'java', type: 'boolean', required: false},
  ],
};

// Shared primitive type — no relations
const customerType: DTOConfig = {
  type: 'graphqlType',
  name: 'Customer',
  module: 'shared',
  template: 'classic',
  attributes: [
    {name: 'id',    objectType: 'java', type: 'uuid',   required: true, primaryKey: true},
    {name: 'name',  objectType: 'java', type: 'string', required: true},
    {name: 'email', objectType: 'java', type: 'string', required: true},
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 1 — PRODUCT CATALOG
// ═══════════════════════════════════════════════════════════════════════════════

// graphqlType: Product — has a graphqlType attribute pointing to Category (shared)
const productType: DTOConfig = {
  type: 'graphqlType',
  name: 'Product',
  module: 'catalog',
  template: 'classic',
  attributes: [
    {name: 'id',        objectType: 'java',        type: 'uuid',     required: true, primaryKey: true},
    {name: 'name',      objectType: 'java',        type: 'string',   required: true},
    {name: 'price',     objectType: 'java',        type: 'double',   required: true},
    {name: 'active',    objectType: 'java',        type: 'boolean',  required: false},
    {name: 'createdAt', objectType: 'java',        type: 'datetime', required: false},
    // Relation to Category — single, cross-module (catalog → shared)
    {name: 'category',  objectType: 'graphqlType', type: 'Category', required: false, module: 'shared'},
  ],
};

// graphqlInput: CreateProductInput — required fields + maxLength validation
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

// graphqlInput: UpdateProductInput — all optional, record template
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
// EXAMPLE 2 — ORDER MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

// graphqlType: OrderItem — has a single Product relation (cross-module orders → catalog)
const orderItemType: DTOConfig = {
  type: 'graphqlType',
  name: 'OrderItem',
  module: 'orders',
  template: 'classic',
  attributes: [
    {name: 'quantity',  objectType: 'java',        type: 'integer', required: true},
    {name: 'unitPrice', objectType: 'java',        type: 'double',  required: true},
    // Relation to Product — single, cross-module (orders → catalog)
    {name: 'product',   objectType: 'graphqlType', type: 'Product', required: true, module: 'catalog'},
  ],
};

// graphqlType: Order — two relations: customer (single) + items (list)
const orderType: DTOConfig = {
  type: 'graphqlType',
  name: 'Order',
  module: 'orders',
  template: 'classic',
  attributes: [
    {name: 'id',     objectType: 'java',        type: 'uuid',      required: true, primaryKey: true},
    {name: 'total',  objectType: 'java',        type: 'double',    required: true},
    {name: 'status', objectType: 'java',        type: 'string',    required: true},
    // Relation to Customer — single, cross-module (orders → shared)
    {name: 'customer', objectType: 'graphqlType', type: 'Customer', required: true,  module: 'shared'},
    // Relation to OrderItem — list, same module
    {name: 'items',    objectType: 'graphqlType', type: 'OrderItem', required: false, module: 'orders', collectionType: 'list'},
  ],
};

// graphqlInput: CreateOrderInput
const createOrderInput: DTOConfig = {
  type: 'graphqlInput',
  name: 'CreateOrderInput',
  module: 'orders',
  template: 'classic',
  attributes: [
    {name: 'customerId', objectType: 'java', type: 'uuid',   required: true},
    {name: 'note',       objectType: 'java', type: 'string', required: false, maxLength: 500},
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// TESTS — TECHNICAL STYLE
// ═══════════════════════════════════════════════════════════════════════════════

describe('Example 1 — Product Catalog — graphqlType (technical)', () => {
  it('Category — simple type, no relations (classic)', async () => {
    // Output: graphql/types/Category.java
    // Manifest: .igrpstudio/shared/graphql/types/Category.json
    await addDTO(categoryType, TECHNICAL_OUTPUT_DIR);
  });

  it('Category — record template variant', async () => {
    // Output: graphql/types/Category.java  (record)
    await addDTO({...categoryType, template: 'record'}, TECHNICAL_OUTPUT_DIR);
  });

  it('Product — with Category relation (cross-module catalog→shared)', async () => {
    // Output: graphql/types/Product.java
    // Validates: Category manifest exists in .igrpstudio/shared/graphql/types/
    // Generates: import for Category from graphql.types package
    await addDTO(productType, TECHNICAL_OUTPUT_DIR);
  });
});

describe('Example 1 — Product Catalog — graphqlInput (technical)', () => {
  it('CreateProductInput — required fields + maxLength validation (classic)', async () => {
    // Output: graphql/types/CreateProductInput.java
    // Annotations: @NotBlank, @Size on name; @NotNull on price
    await addDTO(createProductInput, TECHNICAL_OUTPUT_DIR);
  });

  it('UpdateProductInput — all optional fields (record template)', async () => {
    // Output: graphql/types/UpdateProductInput.java  (record)
    await addDTO(updateProductInput, TECHNICAL_OUTPUT_DIR);
  });
});

describe('Example 2 — Order Management — graphqlType (technical)', () => {
  it('Customer — simple type, shared module (classic)', async () => {
    // Output: graphql/types/Customer.java
    // Manifest: .igrpstudio/shared/graphql/types/Customer.json
    await addDTO(customerType, TECHNICAL_OUTPUT_DIR);
  });

  it('OrderItem — single Product relation (cross-module orders→catalog)', async () => {
    // Output: graphql/types/OrderItem.java
    // Validates: Product manifest exists in .igrpstudio/catalog/graphql/types/
    await addDTO(orderItemType, TECHNICAL_OUTPUT_DIR);
  });

  it('Order — two relations: customer (single) + items (list, same module)', async () => {
    // Output: graphql/types/Order.java
    // Validates: Customer (shared) + OrderItem (orders) manifests exist
    // Java fields: Customer customer; List<OrderItem> items;
    await addDTO(orderType, TECHNICAL_OUTPUT_DIR);
  });
});

describe('Example 2 — Order Management — graphqlInput (technical)', () => {
  it('CreateOrderInput — uuid + optional string with maxLength (classic)', async () => {
    // Output: graphql/types/CreateOrderInput.java
    await addDTO(createOrderInput, TECHNICAL_OUTPUT_DIR);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TESTS — DOMAIN STYLE
// Note: each describe must seed its own dependencies for DOMAIN_OUTPUT_DIR
// ═══════════════════════════════════════════════════════════════════════════════

describe('Example 1 — Product Catalog — graphqlType (domain)', () => {
  it('Category — simple type (classic)', async () => {
    // Output: <module>/interfaces/graphql/types/Category.java
    await addDTO(categoryType, DOMAIN_OUTPUT_DIR);
  });

  it('Product — with Category relation (domain paths)', async () => {
    // Validates: Category manifest in DOMAIN_OUTPUT_DIR/shared
    // Import: <group>.<pkg>.shared.interfaces.graphql.types.Category
    await addDTO(productType, DOMAIN_OUTPUT_DIR);
  });
});

describe('Example 2 — Order Management — graphqlType (domain)', () => {
  it('Customer — simple type (domain)', async () => {
    await addDTO(customerType, DOMAIN_OUTPUT_DIR);
  });

  it('OrderItem — Product relation (domain, cross-module)', async () => {
    // Product was seeded to DOMAIN_OUTPUT_DIR in Example 1 domain above
    await addDTO(orderItemType, DOMAIN_OUTPUT_DIR);
  });

  it('Order — customer + items relations (domain)', async () => {
    // Customer and OrderItem already seeded above
    await addDTO(orderType, DOMAIN_OUTPUT_DIR);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// VALIDATION
// ═══════════════════════════════════════════════════════════════════════════════

describe('addDTO graphqlType — validation', () => {
  it('should throw when type is not a valid ObjectType', async () => {
    const invalid: any = {type: 'controller', name: 'Bad', template: 'classic', attributes: []};
    await expect(addDTO(invalid, TECHNICAL_OUTPUT_DIR)).rejects.toBeTruthy();
  });

  it('should throw when graphqlType attribute references a non-existent type', async () => {
    const invalid: DTOConfig = {
      type: 'graphqlType',
      name: 'Ghost',
      module: 'shared',
      template: 'classic',
      attributes: [
        {name: 'missing', objectType: 'graphqlType', type: 'NonExistentType', required: false, module: 'shared'},
      ],
    };
    await expect(addDTO(invalid, TECHNICAL_OUTPUT_DIR)).rejects.toBeTruthy();
  });
});
