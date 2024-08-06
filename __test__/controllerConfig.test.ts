import { controllerConfigGenerator } from '../src/modules/controller/controllerConfigGenrator';
import { controllerInterfaceGenerator } from '../src/modules/controller/controllerInterfaceGenerator';
import { ApiConfig, ControllerConfig, ModelConfig } from '../src/interfaces/types';
import { newControllerConfig } from '../src/newControllerConfig';
import { DIRECTORIES, EXTENSIONS, OUTPUT_DIR } from '../src/utils/constants';
import fs from 'fs-extra';
import path from 'path';
import { newApi } from '../src/newApi';
import { newModelConfig } from '../src/newModelConfig';
import { modelResourceGenerator } from '../src/newModelResources';

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
}

const config: ControllerConfig = {
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
    }
  ],
};

beforeAll(async () =>{
  await fs.mkdir(OUTPUT_DIR, {recursive: true});
  await newApi(apiConfig, OUTPUT_DIR);
  await newModelConfig(model, OUTPUT_DIR);
  await modelResourceGenerator(model, OUTPUT_DIR);
});

afterAll(async () => {
  await fs.rm(OUTPUT_DIR, {recursive: true});
});


describe('', ()=> {
  it('should create a new controller configuration json file', async () => {
    await newControllerConfig(config, OUTPUT_DIR);
    const controllerConfigPath = path.join(OUTPUT_DIR, DIRECTORIES.CONFIG_CONTROLLER, `${config.name}${EXTENSIONS.JSON}`)
    expect(await fs.pathExists(controllerConfigPath)).toBeTruthy();
  });

})


