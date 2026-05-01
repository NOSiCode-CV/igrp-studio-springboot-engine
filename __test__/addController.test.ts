import {addController, setEngineConfiguration} from '../src';
import {ControllerConfig} from '../src/interfaces/types';
// @ts-ignore
import {DOMAIN_OUTPUT_DIR, TECHNICAL_OUTPUT_DIR} from './outputDirPath';


beforeAll(async () => {
  //await fs.mkdir(TECHNICAL_OUTPUT_DIR, { recursive: true });
  //await fs.mkdir(DOMAIN_OUTPUT_DIR, { recursive: true });
  setEngineConfiguration({ environment: 'development' });
});

afterAll(async () => {
  // await fs.rm(OUTPUT_DIR, { recursive: true });
});


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


describe('Custom tag field', () => {
  it('should use tag field in @Tag annotation when provided', async () => {
    const config: ControllerConfig = {
      type: 'controller',
      name: 'Animal',
      module: 'veterinary',
      tag: 'Gestão de Animais',
      basePath: 'animals',
      description: 'Animal management',
      actions: [{ actionName: 'list', method: 'GET' }],
    };

    await addController(config, DOMAIN_OUTPUT_DIR);
    await addController(config, TECHNICAL_OUTPUT_DIR);
  });

  it('should fallback to module/name when tag is not provided', async () => {
    const config: ControllerConfig = {
      type: 'controller',
      name: 'Animal',
      module: 'veterinary',
      basePath: 'animals',
      description: 'Animal management',
      actions: [{ actionName: 'list', method: 'GET' }],
    };

    await addController(config, DOMAIN_OUTPUT_DIR);
    await addController(config, TECHNICAL_OUTPUT_DIR);
  });
});

describe('UUID Path Variable', () => {
  it('should generate a controller with a uuid path variable', async () => {
    const uuidPathVarConfig: ControllerConfig = {
      type: 'controller',
      name: 'Animal',
      basePath: 'animals',
      description: 'Controller for managing animals by UUID',
      actions: [
        {
          actionName: 'getById',
          method: 'GET',
          pathVariables: [
            {
              name: 'id',
              type: 'uuid',
              isRequired: true,
            },
          ],
          responses: {
            '200': {
              content: {
                'application/json': {
                  schema: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      ],
    };

    await addController(uuidPathVarConfig, DOMAIN_OUTPUT_DIR);
    await addController(uuidPathVarConfig, TECHNICAL_OUTPUT_DIR);
  });
});

describe('Path Variable type restriction', () => {
  it.each(['date', 'boolean', 'file'])(
    'should reject "%s" as a path variable type',
    async (invalidType) => {
      const config: ControllerConfig = {
        type: 'controller',
        name: 'Test',
        basePath: 'test',
        description: 'Test controller',
        actions: [
          {
            actionName: 'getById',
            method: 'GET',
            pathVariables: [{ name: 'id', type: invalidType as any, isRequired: true }],
          },
        ],
      };
      await expect(addController(config, DOMAIN_OUTPUT_DIR)).rejects.toBeDefined();
    },
  );
});

describe('Date RequestParam', () => {
  it('should generate a controller with a date request param', async () => {
    const dateRequestParamConfig: ControllerConfig = {
      type: 'controller',
      name: 'Animal',
      basePath: 'reports',
      description: 'Controller for filtering reports by date',
      actions: [
        {
          actionName: 'getByDate',
          method: 'GET',
          requestParams: [
            {
              name: 'startDate',
              type: 'date',
              isRequired: true,
            },
            {
              name: 'endDate',
              type: 'date',
              isRequired: false,
            },
          ],
          responses: {
            '200': {
              content: {
                'application/json': {
                  schema: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      ],
    };

    await addController(dateRequestParamConfig, DOMAIN_OUTPUT_DIR);
    await addController(dateRequestParamConfig, TECHNICAL_OUTPUT_DIR);
  });
});

describe('Collection RequestParam', () => {
  it('should generate a controller with collection type request params', async () => {
    const collectionRequestParamConfig: ControllerConfig = {
      type: 'controller',
      name: 'Tag',
      basePath: 'tags',
      description: 'Controller for filtering by multiple tags',
      module : 'demo',
      actions: [
        {
          actionName: 'getByTags',
          method: 'POST',
          requestParams: [
            {
              name: 'tags',
              type: 'uuid',
              collectionType: 'list',
              isRequired: false,
            },
            {
              name: 'ids',
              type: 'long',
              isRequired: false,
            },
          ],
          responses: {
            '200': {
              content: {
                'application/json': {
                  schema: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      ],
    };

    await addController(collectionRequestParamConfig, DOMAIN_OUTPUT_DIR);
    await addController(collectionRequestParamConfig, TECHNICAL_OUTPUT_DIR);
  });
});