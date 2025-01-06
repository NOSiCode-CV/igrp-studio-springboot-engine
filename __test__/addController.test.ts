import fs from 'fs-extra';
import { addController } from '../src';
import { ControllerConfig } from '../src/interfaces/types';

const OUTPUT_DIR = 'C:\\spring-engine\\generatedNewVersion'
const controllerConfig: ControllerConfig = {
  "type": "controller",
  "name": "Peoples",
  "basePath": "peoples",
  "actions": [
    {
      "actionName": "getPeople",
      "path": "get-people",
      "method": "GET",
      "responses": {
        "200": {
          "description": "OK",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {}
              }
            }
          }
        }
      },
      "requestParams": [],
      "pathVariables": [],
      "headers": []
    }
  ],
  "module": "ModuloTetse"
}

beforeAll(async () => {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
});

afterAll(async () => {
  // await fs.rm(OUTPUT_DIR, { recursive: true });
});

describe('Controller Module', () => {
  it('should create the controller class and the service interface', async () => {
    await addController(controllerConfig, OUTPUT_DIR);
  });
});
