import fs from 'fs-extra';
import { newApi } from '../src/index';
import { BaseApiConfig } from '../src/interfaces/types';

const OUTPUT_DIR = 'generatedTest'
const TECHNICAL_OUTPUT_DIR = 'generatedEnvironment'

const apiConfig: BaseApiConfig = {
  type: 'baseApi',
  apiName: 'carRental',
  group: 'cv.nosi',
  artifact: 'rental',
  description: 'Demo project for Spring Boot',
  database: 'Postgresql',
  projectStructureStyle: 'domain',
  enableObservability: true
};

const apiTechnicalConfig: BaseApiConfig = {
  type: 'baseApi',
  apiName: 'books',
  group: 'cv.nosi',
  artifact: 'book-library',
  description: 'Demo project for Spring Boot',
  database: 'Postgresql',
  projectStructureStyle: 'technical',
  enableObservability: true
};

beforeEach(async () => {
  await fs.mkdir(TECHNICAL_OUTPUT_DIR, { recursive: true });
});

afterEach(async () => {
  // await fs.rm(OUTPUT_DIR, { recursive: true });
});

describe('New API Module', () => {

  it('should create the project structure with all the directories and templates in domain driven design style.', async () => {
    await newApi(apiConfig, OUTPUT_DIR);
  });

  it('should create the project structure with all the directories and templates in technical style.', async () => {
    await newApi(apiTechnicalConfig, TECHNICAL_OUTPUT_DIR);
  });

});
