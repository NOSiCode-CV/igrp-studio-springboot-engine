import {newApi, setEngineConfiguration} from '../src';
import {BaseApiConfig} from '../src/interfaces/types';
// @ts-ignore
import {DOMAIN_OUTPUT_DIR, TEST_OUTPUT_DIR, TEST_OUTPUT_TEC} from './outputDirPath';


const domainApiConfig: BaseApiConfig = {
  type: 'springboot',
  name: 'demoDomain',
  group: 'com.petshop',
  artifact: 'animals',
  description: 'Demo project for Spring Boot',
  database: 'Postgresql',
  projectStructureStyle: 'domain',
  enableObservability: true,
  enableEntityRevision: false,
  enableGraalVm: false
};

const technicalApiConfig: BaseApiConfig = {
  type: 'springboot',
  name: 'demoTechnical',
  group: 'cv.nosi',
  artifact: 'users',
  description: 'Demo project for Spring Boot',
  database: 'Postgresql',
  projectStructureStyle: 'technical',
  enableObservability: true,
  enableEntityRevision: false,
  enableGraalVm: false
};

const testApiConfig: BaseApiConfig = {
  type: "springboot",
  name: "igrp_platform_process_manager_studio",
  group: "cv.igrp.platform",
  artifact: "process_manager_studio",
  package : "studio",
  database: "Postgresql",
  description: "IGRP Platform Process Manager Studio",
  projectStructureStyle: "domain",
  enableObservability: true,
  enableEntityRevision: false,
  enableGraalVm: false,
  version: "1.0.0",
}

beforeAll(async () => {
  //await fs.mkdir(TECHNICAL_OUTPUT_DIR, { recursive: true });
  //await fs.mkdir(DOMAIN_OUTPUT_DIR, { recursive: true });
  setEngineConfiguration({ environment: 'development' });
});

afterEach(async () => {
  // await fs.rm(OUTPUT_DIR, { recursive: true });
});

describe('New API Module', () => {

  it('should create the project structure with all the directories and templates in domain driven design style.', async () => {
    await newApi(domainApiConfig, DOMAIN_OUTPUT_DIR);
  });

  it('should create the project structure with all the directories and templates in technical style.', async () => {
    //await newApi(technicalApiConfig, TEST_OUTPUT_TEC);
  });

});
