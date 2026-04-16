import {addEnum, setEngineConfiguration} from '../src';
import {EnumConfig} from '../src/interfaces/types';
// @ts-ignore
import {DOMAIN_OUTPUT_DIR, INSS_PATH_PROJECT, nick_teste, TECHNICAL_OUTPUT_DIR, TEST_OUTPUT_DIR} from './outputDirPath';


beforeEach(async () => {
  setEngineConfiguration({ environment: 'development' });
});


const domainEnumConfig : EnumConfig = {
  id: 'bipojm4zvl',
  type: 'enum',
  name: "Level",
  module: "shared",
  "readOnly": true,
  values: [
    { name: "HIGH", attributes: ["1", "High"] },
      { name: "LOW", attributes: ["2", "Low"] },
      { name: "MEDIUM", attributes: ["3", "Medium"] },
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
    setEngineConfiguration({ environment: 'development' });
  //await fs.mkdir(TECHNICAL_OUTPUT_DIR, { recursive: true });
  //await fs.mkdir(DOMAIN_OUTPUT_DIR, { recursive: true });
  //await fs.mkdir(INSS_PATH_PROJECT, { recursive: true });
});

afterEach(async () => {
  // await fs.rm(OUTPUT_DIR, { recursive: true });
});

describe('New Enum in domain driven design project style', () => {

  it('should create the enum class.', async () => {
    await addEnum(domainEnumConfig, INSS_PATH_PROJECT);
  });
});

describe('New Enum in technical project style', () => {

  it('should create the enum class.', async () => {
   // await addEnum(technicalEnumConfig, TECHNICAL_OUTPUT_DIR);
  });
});
