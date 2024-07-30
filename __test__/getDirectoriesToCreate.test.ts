import fs from 'fs-extra'
import { DIRECTORIES, ERROR_MESSAGE, OUTPUT_DIR } from "../src/utils/constants";
import { ApiConfig } from '../src/interfaces/types';
import { getDirectoriesToCreate } from '../src/modules/createAppDirectories';
import path from 'path';
import { getMainPath, getTestPath } from '../src/utils/helpers';

const apiConfig: ApiConfig = {
  type: 'baseApi',
  apiName: 'api-rest',
  group: '',
  artifact: 'igrp',
  description: 'API-TEST',
};

beforeAll(async () => {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
});

afterAll(async () => {
  await fs.rm(OUTPUT_DIR, { recursive: true });
  
});


// null config
it(`Should return an invalid API configuration error.`, () => {
  expect(() => getDirectoriesToCreate(apiConfig, OUTPUT_DIR)).toThrow(ERROR_MESSAGE.INVALID_API_CONFIG);
});

// null output path
it('Should return an invalid or does not exist output path error.', () => {
  apiConfig.group = 'nosi';
  expect(() => getDirectoriesToCreate(apiConfig, '')).toThrow(ERROR_MESSAGE.INVALID_OUTPUT_PATH);
});

// expected params 
it('Should return the list of directories to create', () => {
  apiConfig.group = 'nosi';

  const { group, artifact } = apiConfig;

  const mainPath = path.join(OUTPUT_DIR, getMainPath(group, artifact));
  const testPath = path.join(OUTPUT_DIR, getTestPath(group, artifact));
  const igrpstudioPath = path.join(OUTPUT_DIR, DIRECTORIES.IGRPSTUDIO);

  const dirsToCreate = getDirectoriesToCreate(apiConfig, OUTPUT_DIR);

  const expectedDirs = [
    path.join(OUTPUT_DIR, DIRECTORIES.RESOURCES),
    path.join(mainPath, DIRECTORIES.MODELS),
    path.join(mainPath, DIRECTORIES.SERVICES),
    path.join(mainPath, DIRECTORIES.CONTROLLERS),
    path.join(testPath, DIRECTORIES.REPOSITORIES),
    path.join(testPath, DIRECTORIES.SERVICES),
    path.join(igrpstudioPath, DIRECTORIES.CONTROLLERS),
    path.join(igrpstudioPath, DIRECTORIES.MODELS),
  ];

  expect(dirsToCreate).toEqual(expectedDirs);
});

