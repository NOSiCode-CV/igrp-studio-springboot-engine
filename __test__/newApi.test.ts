
import { newApi } from '../src';
import { ApiConfig, BaseApiConfig } from '../src/interfaces/types';
// @ts-ignore
import { DOMAIN_OUTPUT_DIR, TECHNICAL_OUTPUT_DIR, TEST_OUTPUT_DIR } from './outputDirPath';

const domainApiConfig: BaseApiConfig = {
  type: 'springboot',
  name: 'demoDomain',
  group: 'com.petshop',
  artifact: 'animals',
  description: 'Demo project for Spring Boot',
  database: 'Postgresql',
  projectStructureStyle: 'domain',
  enableObservability: true,
  enableEntityRevision: true,
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
  enableGraalVm: true
};

const testApiConfig: BaseApiConfig = {
  type: "springboot",
  name: "igrp_platform_access_management",
  group: "cv.igrp.platform",
  artifact: "access-management",
  database: "Postgresql",
  description: "IGRP Platform Access Management",
  projectStructureStyle: "domain",
  enableObservability: true,
  enableEntityRevision: true,
  enableGraalVm: true
}

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
    await newApi(testApiConfig, TEST_OUTPUT_DIR);
  });

});
