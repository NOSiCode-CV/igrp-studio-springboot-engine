import fs from 'fs-extra';
import { addController } from '../src';
import { ControllerConfig } from '../src/interfaces/types';
import { debugSchema } from '../src/schema/controllerConfig';

const OUTPUT_DIR = 'C:\\spring-engine\\generatedNewVersion'
const controllerConfig: ControllerConfig = {
  "type": "controller",
  "name": "Cats",
  "basePath": "cats",
  "actions": [
    {
      "actionName": "getCat",
      "path": "get-cat",
      "method": "GET",
      "requestBody": {
        "content": {
          "multipart/form-data": {
            "schema": {
              "type": "object",
              "properties": {
                "cod": {
                  "type": "CatDTO",
                  "objectType": "dto",
                  "properties": {
                  },
                  "description": "bb"
                }
              }
            }
          }
        }
      },
      "responses": {
        "200": {
          "module": "gest",
          "name": "OK",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "cod": {
                    "type": "CatDTO",
                    "objectType": "dto",
                    "properties": {
                    },
                    "description": "bb"
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
    },
    {
      "actionName": "deleteCat",
      "path": "delete-cat",
      "method": "DELETE",
      "responses": {
        "200": {
          "name": "OK",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "New Field 1": {
                    "type": "string",
                    "description": "e"
                  }
                }
              }
            }
          }
        }
      }
    }
  ],
  "module": "Gest"
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
