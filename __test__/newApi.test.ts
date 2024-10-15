import path from 'path';
import fs from 'fs-extra';
import { newApi } from '../src/index';
import { getMainPath } from '../src/utils/helpers';
import { ApiConfig } from '../src/interfaces/types';
import { COMMON_FILES, DIRECTORIES, ERROR_MESSAGE } from '../src/utils/constants';


const OUTPUT_DIR = ''


const apiConfig: ApiConfig = {
  type: 'baseApi',
  apiName: 'apiDemo', //Names with hyphens or spaces are not accepted.
  group: 'com',
  artifact: 'demo',
  description: 'Demo project for Spring Boot',
  database: 'Postgresql' // you can choose between MySQL and PostgreSQL
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
