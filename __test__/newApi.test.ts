import path from 'path';
import fs from 'fs-extra';
import { newApi } from '../src/index';
import { getMainPath } from '../src/utils/helpers';
import { ApiConfig } from '../src/interfaces/types';
import { COMMON_FILES, DIRECTORIES, ERROR_MESSAGE } from '../src/utils/constants';

const OUTPUT_DIR = 'C:/Users/Eduardo Fernando/Downloads/api'

const apiConfig: ApiConfig = {
  type: 'baseApi',
  apiName: 'ssss', //Names with hyphens or spaces are not accepted.
  group: 'com',
  artifact: 'demo',
  description: 'Demo project for Spring Boot',
  database: 'Postgresql' // you can choose between MySQL and PostgreSQL
};

beforeEach(async () => {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
});

afterEach(async () => {
  await fs.rm(OUTPUT_DIR, { recursive: true });
});

describe('New API Module', () => {
  // To run this test you need to provide a non-empty directory.
  it('Sshould fail because the directory is not empty', async () => {
    expect(async () => await newApi(apiConfig, OUTPUT_DIR)).rejects.toThrow(ERROR_MESSAGE.DIRECTORY_ALREADY_IN_USE);
  });

  it('should fail when trying to create a new api with empty fields or apiName with hyphen or space', async () => {
    const invalidConfig: ApiConfig = { ...apiConfig, apiName: 'api-name', group:'' };
    await expect(async () => await newApi(invalidConfig, OUTPUT_DIR)).rejects.toEqual(ERROR_MESSAGE.INVALID_API_CONFIG);
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
      path.join(OUTPUT_DIR, COMMON_FILES.DOCKERIGNORE),
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
});
