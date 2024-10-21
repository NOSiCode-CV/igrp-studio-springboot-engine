import fs from 'fs-extra';
import { newApi } from '../src/index';
import { ApiConfig } from '../src/interfaces/types';


const OUTPUT_DIR = ''


const apiConfig: ApiConfig = {
  type: 'baseApi',
  apiName: 'apiDemo',
  group: 'com',
  artifact: 'demo',
  description: 'Demo project for Spring Boot',
  database: 'Postgresql'
};

beforeEach(async () => {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
});

afterEach(async () => {
  // await fs.rm(OUTPUT_DIR, { recursive: true });
});

describe('New API Module', () => {

  it('should create the project structure with all the directories and templates.', async () => {
    await newApi(apiConfig, OUTPUT_DIR);   
  });
});
