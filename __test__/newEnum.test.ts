import fs from 'fs-extra';
import { addEnum, addModule } from '../src/index';
import { EnumConfig, ModuleConfig } from '../src/interfaces/types';

const OUTPUT_DIR = 'C:\\spring-engine\\generatedNewVersion'

const fullEnumConfig: EnumConfig = {
  type: 'enum',
  name: "SuperLevel",
  values: [
    { name: "HIGH", attributes: [1, "High"] },
    { name: "LOW", attributes: [0, "Low"] }
  ],
  attributes: [{ name: 'code', type: 'integer' }, { name: 'description', type: 'string' }]
};

const simpleEnumConfig: EnumConfig = {
  type: 'enum',
  name: "Level",
  values: [
    { name: "HIGH" },
    { name: "LOW" }
  ]
};

beforeEach(async () => {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
});

afterEach(async () => {
  // await fs.rm(OUTPUT_DIR, { recursive: true });
});

describe('New Enum', () => {

  it('should create the enum class.', async () => {
    await addEnum(fullEnumConfig, OUTPUT_DIR);
  });
});
