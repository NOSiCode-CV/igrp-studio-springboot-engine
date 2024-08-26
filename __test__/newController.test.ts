import path from 'path';
import fs from 'fs-extra';
import { newApi } from '../src/index';
import { getMainPath } from '../src/utils/helpers';
import { newController } from '../src/index';
import { modelResourceGenerator } from '../src/index';
import { ApiConfig, ControllerConfig, ModelConfig } from '../src/interfaces/types';
import { COMMON_FILES, DIRECTORIES, ERROR_MESSAGE } from '../src/utils/constants';

const OUTPUT_DIR = ''

const controllerConfig: ControllerConfig = {
  type: 'controller',
  name: 'Library',
  basePath: '/libraries',
  actions: [
    {
      path: 'library',
      method: 'POST',
      name: 'createLibrary',
      pathParams: [{ type: 'Library', name: 'newLibrary' }],
      response: 'String',
    },
    {
      path: 'library',
      method: 'GET',
      name: 'getLibrary',
      pathParams: [{ type: 'Long', name: 'id' }],
      response: 'Library',
    },

    {
      path: 'library',
      method: 'GET',
      name: 'getLibraries',
      pathParams: [],
      response: 'List',
    },
    {
      path: 'deleteLibrary',
      method: 'DELETE',
      name: 'deleteLibrary',
      pathParams: [{ type: 'Long', name: 'id' }],
      response: 'String',
    },
  ],
};

const model: ModelConfig = {
  type: 'model',
  name: 'Library',
  attributes: [
    {
      type: 'String',
      name: 'name',
      unique: false,
      notNull: true,
    },
    {
      type: 'String',
      name: 'address',
      unique: true,
      notNull: true,
    },
  ],
};

const apiConfig: ApiConfig = {
  type: 'baseApi',
  apiName: 'api-rest',
  group: 'nosi',
  artifact: 'igrp',
  description: 'API-TEST',
  database: 'MySQL'
};

beforeAll(async () => {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await newApi(apiConfig, OUTPUT_DIR);
  await modelResourceGenerator(model, OUTPUT_DIR);
});

afterAll(async () => {
  await fs.rm(OUTPUT_DIR, { recursive: true });
});

describe('Controller Module', () => {
  const { group, artifact } = apiConfig;
  const invaliControllerConfig: ControllerConfig = { ...controllerConfig, name: '' };

  it('should fail because the controller configuration file is invalid', async () => {
    expect(async () => await newController(invaliControllerConfig, OUTPUT_DIR)).rejects.toEqual(
      ERROR_MESSAGE.INVALID_CONTROLLER_CONFIG,
    );
  });

  it('should create the controller class and the service interface', async () => {
    await newController(controllerConfig, OUTPUT_DIR);

    const controllerPath = path.join(
      OUTPUT_DIR,
      getMainPath(group, artifact),
      DIRECTORIES.CONTROLLERS,
      controllerConfig.name,
      `${controllerConfig.name}${COMMON_FILES.CONTROLLER}`
    );

    const servicePath = path.join(
      OUTPUT_DIR,
      getMainPath(group, artifact),
      DIRECTORIES.CONTROLLERS,
      controllerConfig.name,
      `${controllerConfig.name}${COMMON_FILES.SERVICE}`
    );

    const existsControllerPath = await fs.pathExists(controllerPath)
    const existsServicePath = await fs.pathExists(servicePath)

    expect(existsControllerPath).toBeTruthy();
    expect(existsServicePath).toBeTruthy();
  });
});
