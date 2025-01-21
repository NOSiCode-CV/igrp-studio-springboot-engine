import fs from 'fs-extra';
import { newApi } from '../src';
import { BaseApiConfig } from '../src/interfaces/types';

const TECHNICAL_OUTPUT_DIR = 'C:\\spring-engine\\demoTechnical'
const DOMAIN_OUTPUT_DIR = 'C:\\spring-engine\\demoDomain'

const domainApiConfig: BaseApiConfig = {
  type: 'springboot',
  apiName: 'demoDomain',
  group: 'com.petshop',
  artifact: 'animals',
  description: 'Demo project for Spring Boot',
  database: 'Postgresql',
  projectStructureStyle: 'domain',
  enableObservability: true,
  igrpCoreVersion: "0.0.1-20250115.133643-3"
};

const technicalApiConfig: BaseApiConfig = {
  type: 'springboot',
  apiName: 'demoTechnical',
  group: 'cv.nosi',
  artifact: 'users',
  description: 'Demo project for Spring Boot',
  database: 'Postgresql',
  projectStructureStyle: 'technical',
  enableObservability: false,
  igrpCoreVersion: "0.0.1-20250115.133643-3"
};

beforeAll(async () => {
  await fs.mkdir(TECHNICAL_OUTPUT_DIR, { recursive: true });
  await fs.mkdir(DOMAIN_OUTPUT_DIR, { recursive: true });
});

afterEach(async () => {
  // await fs.rm(OUTPUT_DIR, { recursive: true });
});

describe('New API Module', () => {

  it('should create the project structure with all the directories and templates in domain driven design style.', async () => {
    await newApi(domainApiConfig, DOMAIN_OUTPUT_DIR);
  });

  it('should create the project structure with all the directories and templates in technical style.', async () => {
    await newApi(technicalApiConfig, TECHNICAL_OUTPUT_DIR);
  });

});
