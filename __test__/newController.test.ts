import fs from 'fs-extra';
import path from 'path';
import { OUTPUT_DIR } from '../src/utils/constants';
import { newController } from '../src/newController';
import { ControllerConfig } from '../src/interfaces/types';

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

beforeAll(async () => {});

afterAll(async () => {});

describe('Controller Module', () => {
  it('should fil because the controller configuration file is invalid', async () => {
    await newController(config, OUTPUT_DIR)
  });
});
