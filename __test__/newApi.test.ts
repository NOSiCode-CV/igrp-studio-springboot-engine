import path from 'path';
import fs from 'fs-extra';
import { newApi } from '../src/newApi';
import { getMainPath } from '../src/utils/helpers';
import { ApiConfig } from '../src/interfaces/types';
import { COMMON_FILES, DIRECTORIES, OUTPUT_DIR, ERROR_MESSAGE } from '../src/utils/constants';

const apiConfig: ApiConfig = {
  type: 'baseApi',
  apiName: 'api-rest',
  group: 'nosi',
  artifact: 'igrp',
  description: 'API-TEST',
};

beforeEach(async () => {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
});

afterEach(async () => {
  await fs.rm(OUTPUT_DIR, { recursive: true });
});

// Test when the output directory is not empty. To run this test, provide a non-empty directory.
it('should return output directory is not empty error', async () => {
  try {
    await newApi(apiConfig, OUTPUT_DIR);
  } catch (error) {
    expect(error).toBe(ERROR_MESSAGE.DIRECTORY_ALREADY_IN_USE);
  }
});

it('should create the project structure with all the directories and templates.', async () => {
  await newApi(apiConfig, OUTPUT_DIR);
  const mainDir = path.join(OUTPUT_DIR, getMainPath(apiConfig.group, apiConfig.artifact));

  const directories = [
    path.join(mainDir, DIRECTORIES.MODELS),
    path.join(mainDir, DIRECTORIES.SERVICES),
    path.join(mainDir, DIRECTORIES.CONTROLLERS),
    path.join(OUTPUT_DIR, DIRECTORIES.RESOURCES),
    path.join(OUTPUT_DIR, DIRECTORIES.IGRPSTUDIO, DIRECTORIES.MODELS),
    path.join(OUTPUT_DIR, DIRECTORIES.IGRPSTUDIO, DIRECTORIES.CONTROLLERS),
  ];

  const files = [
    path.join(OUTPUT_DIR, COMMON_FILES.MVNW),
    path.join(OUTPUT_DIR, DIRECTORIES.BASE_API),
    path.join(OUTPUT_DIR, COMMON_FILES.POM_XML),
    path.join(OUTPUT_DIR, COMMON_FILES.MVNW_CMD),
    path.join(OUTPUT_DIR, COMMON_FILES.GITIGNORE),
    path.join(OUTPUT_DIR, COMMON_FILES.DOCKERFILE),
    path.join(OUTPUT_DIR, COMMON_FILES.GITLAB_CI_YAML),
    path.join(OUTPUT_DIR, DIRECTORIES.RESOURCES, COMMON_FILES.APPLICATION_PROPERTIES),
  ];

  const directoryChecks = await Promise.all(directories.map((dir) => fs.pathExists(dir)));
  
  const fileChecks = await Promise.all(files.map((file) => fs.pathExists(file)));

  directoryChecks.forEach((exists, index) => {
    expect(exists).toBeTruthy();
  });

  fileChecks.forEach((exists, index) => {
    expect(exists).toBeTruthy();
  });

});
