
import { newApi } from '../src';
import { BaseApiConfig } from '../src/interfaces/types';
// @ts-ignore
import { DOMAIN_OUTPUT_DIR, TECHNICAL_OUTPUT_DIR, TECHNICAL_OUTPUT_DIR_OTHER } from './outputDirPath';

const domainApiConfig: BaseApiConfig = {
  type: 'springboot',
  apiName: 'demoDomain',
  group: 'com.petshop',
  artifact: 'animals',
  description: 'Demo project for Spring Boot',
  database: 'Postgresql',
  projectStructureStyle: 'domain',
  enableObservability: true,
  enableEntityRevision: true,
  igrpCoreVersion: "0.0.1-alpha",
  enableGraalVm: false
};

const technicalApiConfig: BaseApiConfig = {
  type: 'springboot',
  apiName: 'demoTechnical',
  group: 'cv.nosi',
  artifact: 'users',
  description: 'Demo project for Spring Boot',
  database: 'Postgresql',
  projectStructureStyle: 'technical',
  enableObservability: true,
  enableEntityRevision: false,
  igrpCoreVersion: "0.0.1-alpha",
  enableGraalVm: true
};

beforeAll(async () => {
  //await fs.mkdir(TECHNICAL_OUTPUT_DIR, { recursive: true });
  //await fs.mkdir(DOMAIN_OUTPUT_DIR, { recursive: true });
});

afterEach(async () => {
  // await fs.rm(OUTPUT_DIR, { recursive: true });
});

describe('New API Module', () => {

  /*it('should create the project structure with all the directories and templates in domain driven design style.', async () => {
    await newApi(domainApiConfig, DOMAIN_OUTPUT_DIR);
  });*/

  it('should create the project structure with all the directories and templates in technical style.', async () => {
    await newApi(technicalApiConfig, TECHNICAL_OUTPUT_DIR_OTHER);
  });

});
