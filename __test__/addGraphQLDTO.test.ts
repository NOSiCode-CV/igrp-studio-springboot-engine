import {addDTO, setEngineConfiguration} from '../src';
import {DTOConfig} from '../src/interfaces/types';
// @ts-ignore
import {DOMAIN_OUTPUT_DIR, TECHNICAL_OUTPUT_DIR} from './outputDirPath';

beforeAll(async () => {
  setEngineConfiguration({ environment: 'development' });
});

// ─── graphqlType configs ───────────────────────────────────────────────────────

const categoryTypeClassic: DTOConfig = {
  type: 'graphqlType',
  name: 'Category',
  module: 'shared',
  template: 'classic',
  attributes: [
    { name: 'id', objectType: 'java', type: 'uuid', required: true },
    { name: 'label', objectType: 'java', type: 'string', required: true },
    { name: 'active', objectType: 'java', type: 'boolean', required: false },
  ],
};

const categoryTypeRecord: DTOConfig = {
  type: 'graphqlType',
  name: 'Category',
  module: 'shared',
  template: 'record',
  attributes: [
    { name: 'id', objectType: 'java', type: 'uuid', required: true },
    { name: 'label', objectType: 'java', type: 'string', required: true },
    { name: 'active', objectType: 'java', type: 'boolean', required: false },
  ],
};

const productTypeClassic: DTOConfig = {
  type: 'graphqlType',
  name: 'Product',
  module: 'demo',
  template: 'classic',
  attributes: [
    { name: 'id', objectType: 'java', type: 'uuid', required: true },
    { name: 'name', objectType: 'java', type: 'string', required: true },
    { name: 'price', objectType: 'java', type: 'double', required: false },
    { name: 'createdAt', objectType: 'java', type: 'datetime', required: false },
  ],
};

// ─── graphqlInput configs ──────────────────────────────────────────────────────

const createCategoryInputClassic: DTOConfig = {
  type: 'graphqlInput',
  name: 'CreateCategory',
  module: 'shared',
  template: 'classic',
  attributes: [
    { name: 'label', objectType: 'java', type: 'string', required: true, maxLength: 100 },
    { name: 'active', objectType: 'java', type: 'boolean', required: false },
  ],
};

const createCategoryInputRecord: DTOConfig = {
  type: 'graphqlInput',
  name: 'CreateCategory',
  module: 'shared',
  template: 'record',
  attributes: [
    { name: 'label', objectType: 'java', type: 'string', required: true, maxLength: 100 },
    { name: 'active', objectType: 'java', type: 'boolean', required: false },
  ],
};

const updateProductInputClassic: DTOConfig = {
  type: 'graphqlInput',
  name: 'UpdateProduct',
  module: 'demo',
  template: 'classic',
  attributes: [
    { name: 'name', objectType: 'java', type: 'string', required: false, maxLength: 255 },
    { name: 'price', objectType: 'java', type: 'double', required: false },
  ],
};

// ─── Tests — technical style ───────────────────────────────────────────────────

describe('addDTO graphqlType — technical style', () => {
  it('should generate graphqlType class (classic)', async () => {
    await addDTO(categoryTypeClassic, TECHNICAL_OUTPUT_DIR);
  });

  it('should generate graphqlType record', async () => {
    await addDTO(categoryTypeRecord, TECHNICAL_OUTPUT_DIR);
  });

  it('should generate graphqlType with uuid and datetime fields', async () => {
    await addDTO(productTypeClassic, TECHNICAL_OUTPUT_DIR);
  });
});

describe('addDTO graphqlInput — technical style', () => {
  it('should generate graphqlInput class with Jakarta validation (classic)', async () => {
    await addDTO(createCategoryInputClassic, TECHNICAL_OUTPUT_DIR);
  });

  it('should generate graphqlInput record with Jakarta validation', async () => {
    await addDTO(createCategoryInputRecord, TECHNICAL_OUTPUT_DIR);
  });

  it('should generate graphqlInput class for another module', async () => {
    await addDTO(updateProductInputClassic, TECHNICAL_OUTPUT_DIR);
  });
});

// ─── Tests — domain style ─────────────────────────────────────────────────────

describe('addDTO graphqlType — domain style', () => {
  it('should generate graphqlType class (classic)', async () => {
    await addDTO(categoryTypeClassic, DOMAIN_OUTPUT_DIR);
  });

  it('should generate graphqlType record', async () => {
    await addDTO(categoryTypeRecord, DOMAIN_OUTPUT_DIR);
  });
});

describe('addDTO graphqlInput — domain style', () => {
  it('should generate graphqlInput class with Jakarta validation (classic)', async () => {
    await addDTO(createCategoryInputClassic, DOMAIN_OUTPUT_DIR);
  });

  it('should generate graphqlInput record with Jakarta validation', async () => {
    await addDTO(createCategoryInputRecord, DOMAIN_OUTPUT_DIR);
  });
});
