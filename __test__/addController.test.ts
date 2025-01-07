import fs from 'fs-extra';
import { addController } from '../src';
import { ControllerConfig } from '../src/interfaces/types';
import { debugSchema } from '../src/schema/controllerConfig';

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
          "name": "TestResponseOneDTO",
          "description": "OK",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "newField1": {
                    "type": "object"
                  }
                }
              }
            }
          }
        }
      }
    },
    {
      "actionName": "getDelete",
      "path": "deletePeoplo",
      "method": "POST",
      "responses": {
        "400": {
          "name": "TestResponseTwo",
          "description": "OK",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "code": {
                    "type": "string",
                    "description": ""
                  },
                  "data": {
                    "type": "object",
                    "description": "",
                    "properties": {}
                  }
                }
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
    //debugSchema(controllerConfig)
    await addController(controllerConfig, OUTPUT_DIR);
  });
});
