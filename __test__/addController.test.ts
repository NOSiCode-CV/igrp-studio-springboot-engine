import {addController, setEngineConfiguration} from '../src';
import {ControllerConfig} from '../src/interfaces/types';
// @ts-ignore
import {INSS_PATH_PROJECT, TEST_OUTPUT_DIR, TEST_OUTPUT_TEC} from './outputDirPath';

const domainControllerConfig: ControllerConfig = {
  id: "avtjtb5d2g",
  type: "controller",
  name: "cadastro",
  basePath: "animals",
  module: "shared",
  description: "Controller for managing animals",
  actions: [
    {
      actionName: "getAnimalsByIds",
      path: "by-ids",
      method: "GET",
      requestParams: [
        {
          name: "ids",
          type: "string",
          collectionType: "list",
          isRequired: true
        }
      ],
      responses: {
        "200": {
          name: "OK",
          content: {
            "application/json": {
              schema: {
                type: "string",
                collectionType: "list"
              }
            }
          }
        }
      }
    },
    {
      actionName: "updateAnimal",
      path: "update-animal",
      method: "PUT",
      requestBody: {
        id: 'g1OmlhfeUB',
        content: {
          "application/json": {
            schema: {
              type: "string",
              objectType: "java",
              module: "shared",
            },
          },
        },
      },
      responses: {
        "204": {
          name: "OK",
          content: {
            "application/json": {
              schema: {
                type: "string",
                collectionType: "none"
              }
            }
          }
        }
      },
    },

    /*{
      actionName: "detalhesContribuinte",
      path: "{contribuinteId}",
      method: "GET",
      responses: {
        "200": {
          name: "OK",
          description: "Obter contribuinte por ID",
          content: {
            "application/json": {
              schema: {
                type: "string",
                objectType: "java",
                collectionType: "none",
                module: "contribuinte"
              }
            }
          }
        }
      },
      pathVariables: [
        {
          name: "contribuinteId",
          type: "string",
          isRequired: true
        }
      ]
    }*/
  ]
};




beforeAll(async () => {
  //await fs.mkdir(TECHNICAL_OUTPUT_DIR, { recursive: true });
  //await fs.mkdir(DOMAIN_OUTPUT_DIR, { recursive: true });
  setEngineConfiguration({ environment: 'development' });
});

afterAll(async () => {
  // await fs.rm(OUTPUT_DIR, { recursive: true });
});

describe('Domain Controller Module', () => {
  it('should create the controller class and the handlers in domain driven design style', async () => {
    //await addController(domainControllerConfig, TEST_OUTPUT_DIR);
  });
});

describe('Technical Controller Module', () => {
  it('should create the controller class and the service interface in technical style', async () => {
    await addController(domainControllerConfig, INSS_PATH_PROJECT);
  });
});

describe('Test Controller Module', () => {
  it('should create the controller class and the service interface in technical style', async () => {
    //await addController(testControllerConfig, TEST_OUTPUT_DIR);
  });
});