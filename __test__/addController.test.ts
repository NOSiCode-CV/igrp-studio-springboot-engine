import path from 'path';
import fs from 'fs-extra';
import { getMainPath } from '../src/utils/helpers';
import { addController } from '../src/index';
import { ApiConfig, ControllerConfig } from '../src/interfaces/types';
import { COMMON_FILES, DIRECTORIES, ERROR_MESSAGE } from '../src/utils/constants';
import { HttpMethod } from '../src/interfaces/types';

const OUTPUT_DIR = 'C:/Users/Eduardo Fernando/Downloads/api'
const GET: HttpMethod = 'GET';
const POST: HttpMethod = 'POST';
const controllerConfig: ControllerConfig = {
  type: "controller",
  name: "Sips",
  basePath: "sips",
  actions: [
    {
      path: 'sipst',
      method: 'GET',
      name: 'saludo',
      pathParams: [],
      response: 'String',
      isResponseList: false,
    },
    {
      path: 'sipst',
      method: 'POST',
      name: 'addSips',
      isResponseList: true,
      requestBody: 'pessoa',
      pathParams: [{ type: 'Long', name: 'idSips' }],
      response: 'Object'
    },
    {
      path: 'sipst',
      method: 'GET',
      isResponseList: false,
      name: 'getSips',
      pathParams: [{ type: 'Long', name: 'id' }],
      response: 'String',
    }
  ]
};

beforeAll(async () => {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
});

afterAll(async () => {
  // await fs.rm(OUTPUT_DIR, { recursive: true });
});

describe('Controller Module', () => {

  const invaliControllerConfig: ControllerConfig = { ...controllerConfig, name: '' };

  // it('should fail because the controller configuration file is invalid', async () => {
  //   expect(async () => await addController(invaliControllerConfig, OUTPUT_DIR)).rejects.toEqual(
  //     ERROR_MESSAGE.INVALID_CONTROLLER_CONFIG,
  //   );
  // });

  it('should create the controller class and the service interface', async () => {
    await addController(controllerConfig, OUTPUT_DIR);

    // const controllerPath = path.join(
    //   OUTPUT_DIR,
    //   getMainPath(group, artifact),
    //   DIRECTORIES.CONTROLLERS,
    //   controllerConfig.name,
    //   `${controllerConfig.name}${COMMON_FILES.CONTROLLER}`
    // );

    // const servicePath = path.join(
    //   OUTPUT_DIR,
    //   getMainPath(group, artifact),
    //   DIRECTORIES.CONTROLLERS,
    //   controllerConfig.name,
    //   `${controllerConfig.name}${COMMON_FILES.SERVICE}`
    // );

    // const existsControllerPath = await fs.pathExists(controllerPath)
    // const existsServicePath = await fs.pathExists(servicePath)

    // expect(existsControllerPath).toBeTruthy();
    // expect(existsServicePath).toBeTruthy();
  });
});
