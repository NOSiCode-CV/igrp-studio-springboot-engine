import fs from 'fs-extra';
import { addEnum, addModule } from '../src/index';
import { EnumConfig, ModuleConfig } from '../src/interfaces/types';

const OUTPUT_DIR = 'C:\\spring-engine\\generatedNewVersion'

const fullEnumConfig: EnumConfig = {
  type: 'enum',
  name: "SuperLevel",
  values: [
    { name: "HIGH", attributes: ["1", "High"] },
    { name: "LOW", attributes: ["0", "Low"] }
  ],
  attributes: [{ name: 'code', type: 'string' }, { name: 'description', type: 'string' }]
};

const simpleEnumConfig: EnumConfig = {
  type: 'enum',
  name: "Level",
  values: [
    { name: "HIGH" },
    { name: "LOW" }
  ]
};

const testEnum: EnumConfig = {
  "type": "enum",
  "module": "shared",
  "name": "ewewe",
  "values": [
    {
      "name": "ew",
      "attributes": [
        'ew',
        'edsgh'
      ]
    },
    {
      "name": "eweewew",
      "attributes": [
        'we',
        'ee'
      ]
    }
  ],
  "attributes": [
    { name: 'code', type: 'string' },
    { name: 'description', type: 'string' },
  ]
}

beforeEach(async () => {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
});

afterEach(async () => {
  // await fs.rm(OUTPUT_DIR, { recursive: true });
});

describe('New Enum', () => {

  it('should create the enum class.', async () => {
    await addEnum(testEnum, OUTPUT_DIR);
  });
});
