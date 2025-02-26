import fs from 'fs-extra';
import { addEnum } from '../src';
import { EnumConfig } from '../src/interfaces/types';
// @ts-ignore
import { DOMAIN_OUTPUT_DIR, TECHNICAL_OUTPUT_DIR } from './outputDirPath';

const domainEnumConfig : EnumConfig = {
  id: 'bipojm4zvl',
  type: 'enum',
  name: "Level",
  module: "shared",
  values: [
    { name: "HIGH", attributes: ["1", "High"] },
    { name: "LOW", attributes: ["0", "Low"] }
  ],
  attributes: [{ name: 'code', type: 'string' }, { name: 'description', type: 'string' }]
};

const technicalEnumConfig: EnumConfig = {
  id: 'ctdhem8cim',
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
