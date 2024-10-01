import fs from 'fs-extra';
import { addController } from '../src/index';
import { ControllerConfig } from '../src/interfaces/types';

const OUTPUT_DIR = ''

const controllerConfig: ControllerConfig = {
  type: "controller",
  name: "Greeting",
  basePath: "greetings",
  actions: [
    {
      path: 'hello',
      method: 'GET',
      actionName: 'hello',
      accepts: 'application/x-cdf',
      requestParams: [{ type: 'String', name: 'greetingName' }],
      response: 'String',
      isResponseList: false
    },
    {
      path: 'addGreeting',
      method: 'POST',
      actionName: 'addGreeting',
      requestBody: 'greeting',
      pathVariables:[],
      requestParams: [],
      response: 'Object',
      isResponseList: true
    },
    {
      path: 'goodbye',
      method: 'GET',
      actionName: 'goodBye',
      pathVariables:[{ type: 'Long', name: 'id' }],
      requestParams: [{ type: 'String', name: 'greetingName' }],
      response: 'List<String>',
      isResponseList: false,
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
