import fs from 'fs-extra';
import { addController } from '../src';
import { ControllerConfig } from '../src/interfaces/types';
import { debugSchema } from '../src/schema/controllerConfig';

const OUTPUT_DIR = 'C:\\spring-engine\\generatedNewVersion'
const TECHNICAL_OUTPUT_DIR = 'C:\\spring-engine\\TesteNewVersion'
const controllerConfig: ControllerConfig = {
  "type": "controller",
  "name": "Cats",
  "basePath": "cats",
  "actions": [
    {
      "actionName": "getCat",
      "path": "get-cat",
      "method": "GET",
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
      "requestBody": {
        "content": {
          "application/json": {
            "schema": {
              "type": "CatDTO",
              "objectType": "dto",
              "properties": {}
            }
          }
        }
      },
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
  "module": "gest"
}

const technicalControllerConfig: ControllerConfig = {
  "type": "controller",
  "name": "Cats",
  "basePath": "cats",
  "actions": [
    {
      "actionName": "getCat",
      "path": "get-cat",
      "method": "GET",
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
                    "type": "TesteDTO",
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
      "requestBody": {
        "content": {
          "application/json": {
            "schema": {
              "type": "TesteDTO",
              "objectType": "dto",
              "properties": {}
            }
          }
        }
      },
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
  "module": "gest"
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
    await addController(technicalControllerConfig, TECHNICAL_OUTPUT_DIR);
  });
});
