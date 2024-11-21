import fs from 'fs-extra';
import { deleteController } from '../src/index';
import { ControllerConfig } from '../src/interfaces/types';

const OUTPUT_DIR = 'generatedTest'
const controllerConfig: ControllerConfig = {
  type: "controller",
  name: "Greeting",
  basePath: "greetings",
  actions: [
    {
      path: 'goodbye',
      method: 'GET',
      actionName: 'goodBye',
      pathVariables:[{ type: 'Long', name: 'id' }],
      requestParams: [{ type: 'String', name: 'greetingName' }],
      response: 'List<String>'
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
  it('should delete the controller class and the service interface', async () => {
    await deleteController(controllerConfig, OUTPUT_DIR);
  });
});
