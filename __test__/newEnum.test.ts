import fs from 'fs-extra';
import { addEnum } from '../src';
import { EnumConfig } from '../src/interfaces/types';

const TECHNICAL_OUTPUT_DIR = 'C:\\spring-engine\\demoTechnical'
const DOMAIN_OUTPUT_DIR = 'C:\\spring-engine\\demoDomain'

const domainEnumConfig : EnumConfig = {
  type: 'enum',
  name: "Level",
  module: "core",
  values: [
    { name: "HIGH", attributes: ["1", "High"] },
    { name: "LOW", attributes: ["0", "Low"] }
  ],
  attributes: [{ name: 'code', type: 'string' }, { name: 'description', type: 'string' }]
};

const technicalEnumConfig: EnumConfig = {
  type: 'enum',
  name: "Level",
  values: [
    { name: "HIGH" },
    { name: "LOW" }
  ]
};

beforeEach(async () => {
  await fs.mkdir(TECHNICAL_OUTPUT_DIR, { recursive: true });
  await fs.mkdir(DOMAIN_OUTPUT_DIR, { recursive: true });
});

afterEach(async () => {
  // await fs.rm(OUTPUT_DIR, { recursive: true });
});

describe('New Enum in domain driven design project style', () => {

  it('should create the enum class.', async () => {
    await addEnum(domainEnumConfig, DOMAIN_OUTPUT_DIR);
  });
});

describe('New Enum in technical project style', () => {

  it('should create the enum class.', async () => {
    await addEnum(technicalEnumConfig, TECHNICAL_OUTPUT_DIR);
  });
});
