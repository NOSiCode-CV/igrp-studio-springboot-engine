import * as fs from 'fs/promises';
import * as path from 'path';
import { expect, describe, it, beforeAll, afterAll } from '@jest/globals';
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


describe('@Parameter annotation with description', () => {
  it('should generate @Parameter when description is set on pathVariable and requestParam', async () => {
    const config: ControllerConfig = {
      type: 'controller',
      name: 'Verify',
      basePath: 'verify',
      description: 'Verify parameter output',
      actions: [{
        actionName: 'getById',
        method: 'GET',
        pathVariables: [{ name: 'id', type: 'uuid', isRequired: true, description: 'Product unique identifier' }],
        requestParams: [{ name: 'lang', type: 'string', isRequired: false, description: 'Response language' }],
        responses: { '200': { content: { 'application/json': { schema: { type: 'string' } } } } },
      }],
    };

    await addController(config, TECHNICAL_OUTPUT_DIR);

    const generated = await fs.readFile(
      path.join(TECHNICAL_OUTPUT_DIR, 'src/main/java/cv/nosi/users/controllers/verify/VerifyController.java'),
      'utf-8',
    );

    expect(generated).toContain('@Parameter(description = "Product unique identifier", required = true)');
    expect(generated).toContain('@Parameter(description = "Response language", required = false)');
    expect(generated).toContain('@PathVariable(value = "id") UUID id');
    expect(generated).toContain('String lang');
  });

  it('should NOT generate @Parameter when description is absent', async () => {
    const config: ControllerConfig = {
      type: 'controller',
      name: 'NoDesc',
      basePath: 'nodesc',
      description: 'No description test',
      actions: [{
        actionName: 'getById',
        method: 'GET',
        pathVariables: [{ name: 'id', type: 'uuid', isRequired: true }],
      }],
    };

    await addController(config, TECHNICAL_OUTPUT_DIR);

    const generated = await fs.readFile(
      path.join(TECHNICAL_OUTPUT_DIR, 'src/main/java/cv/nosi/users/controllers/nodesc/NoDescController.java'),
      'utf-8',
    );

    expect(generated).not.toContain('@Parameter(description');
    expect(generated).toContain('@PathVariable(value = "id") UUID id');
  });
});

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

describe('DDD command/query requestParams validation annotations', () => {
  it('should NOT add @NotNull/@NotBlank on command when isRequired is false', async () => {
    const config: ControllerConfig = {
      type: 'controller',
      name: 'Report',
      basePath: 'reports',
      module: 'demo',
      description: 'Test optional requestParams in DDD command',
      actions: [
        {
          actionName: 'filterReports',
          method: 'POST',
          requestParams: [
            { name: 'status', type: 'string', isRequired: false },
            { name: 'year', type: 'integer', isRequired: false },
          ],
          responses: { '200': { content: { 'application/json': { schema: { type: 'string' } } } } },
        },
      ],
    };

    await addController(config, DOMAIN_OUTPUT_DIR);

    const generated = await fs.readFile(
      path.join(DOMAIN_OUTPUT_DIR, 'src/main/java/com/petshop/animals/demo/application/commands/FilterReportsCommand.java'),
      'utf-8',
    );

    expect(generated).not.toContain('@NotBlank');
    expect(generated).not.toContain('@NotNull');
    expect(generated).toContain('private String status');
    expect(generated).toContain('private Integer year');
  });

  it('should add @NotBlank on string command attribute when isRequired is true', async () => {
    const config: ControllerConfig = {
      type: 'controller',
      name: 'Report',
      basePath: 'reports',
      module: 'demo',
      description: 'Test required string requestParam in DDD command',
      actions: [
        {
          actionName: 'createReport',
          method: 'POST',
          requestParams: [
            { name: 'title', type: 'string', isRequired: true },
          ],
          responses: { '200': { content: { 'application/json': { schema: { type: 'string' } } } } },
        },
      ],
    };

    await addController(config, DOMAIN_OUTPUT_DIR);

    const generated = await fs.readFile(
      path.join(DOMAIN_OUTPUT_DIR, 'src/main/java/com/petshop/animals/demo/application/commands/CreateReportCommand.java'),
      'utf-8',
    );

    expect(generated).toContain('@NotBlank');
    expect(generated).not.toContain('@NotNull');
    expect(generated).toContain('private String title');
  });

  it('should add @NotNull on non-string command attribute when isRequired is true', async () => {
    const config: ControllerConfig = {
      type: 'controller',
      name: 'Report',
      basePath: 'reports',
      module: 'demo',
      description: 'Test required non-string requestParam in DDD command',
      actions: [
        {
          actionName: 'archiveReport',
          method: 'PUT',
          requestParams: [
            { name: 'year', type: 'integer', isRequired: true },
            { name: 'active', type: 'boolean', isRequired: true },
          ],
          responses: { '204': { content: { 'application/json': { schema: { type: 'string' } } } } },
        },
      ],
    };

    await addController(config, DOMAIN_OUTPUT_DIR);

    const generated = await fs.readFile(
      path.join(DOMAIN_OUTPUT_DIR, 'src/main/java/com/petshop/animals/demo/application/commands/ArchiveReportCommand.java'),
      'utf-8',
    );

    expect(generated).not.toContain('@NotBlank');
    expect(generated).toContain('@NotNull(message = "The field <year> is required")');
    expect(generated).toContain('@NotNull(message = "The field <active> is required")');
    expect(generated).toContain('private Integer year');
    expect(generated).toContain('private boolean active');
  });

  it('should add @NotNull/@NotBlank only on required fields in mixed command', async () => {
    const config: ControllerConfig = {
      type: 'controller',
      name: 'Report',
      basePath: 'reports',
      module: 'demo',
      description: 'Test mixed required/optional requestParams in DDD command',
      actions: [
        {
          actionName: 'searchReport',
          method: 'POST',
          requestParams: [
            { name: 'title', type: 'string', isRequired: true },
            { name: 'status', type: 'string', isRequired: false },
            { name: 'year', type: 'integer', isRequired: true },
            { name: 'page', type: 'integer', isRequired: false },
          ],
          responses: { '200': { content: { 'application/json': { schema: { type: 'string' } } } } },
        },
      ],
    };

    await addController(config, DOMAIN_OUTPUT_DIR);

    const generated = await fs.readFile(
      path.join(DOMAIN_OUTPUT_DIR, 'src/main/java/com/petshop/animals/demo/application/commands/SearchReportCommand.java'),
      'utf-8',
    );

    expect(generated).toContain('@NotBlank(message = "The field <title> is required")');
    expect(generated).toContain('@NotNull(message = "The field <year> is required")');
    expect(generated).toContain('private String status');
    expect(generated).toContain('private Integer page');
    // exactly 1 @NotBlank (title) and 1 @NotNull (year) — status and page have no annotations
    expect(generated.match(/@NotBlank/g)?.length).toBe(1);
    expect(generated.match(/@NotNull/g)?.length).toBe(1);
    // optional fields have no annotation on the preceding line
    expect(generated).toMatch(/\n\s*private String status/);
    expect(generated).toMatch(/\n\s*private Integer page/);
  });

  it('should NOT add @NotNull/@NotBlank on query when isRequired is false', async () => {
    const config: ControllerConfig = {
      type: 'controller',
      name: 'Report',
      basePath: 'reports',
      module: 'demo',
      description: 'Test optional requestParams in DDD query',
      actions: [
        {
          actionName: 'listReports',
          method: 'GET',
          requestParams: [
            { name: 'status', type: 'string', isRequired: false },
            { name: 'year', type: 'integer', isRequired: false },
          ],
          responses: { '200': { content: { 'application/json': { schema: { type: 'string' } } } } },
        },
      ],
    };

    await addController(config, DOMAIN_OUTPUT_DIR);

    const generated = await fs.readFile(
      path.join(DOMAIN_OUTPUT_DIR, 'src/main/java/com/petshop/animals/demo/application/queries/ListReportsQuery.java'),
      'utf-8',
    );

    expect(generated).not.toContain('@NotBlank');
    expect(generated).not.toContain('@NotNull');
    expect(generated).toContain('private String status');
    expect(generated).toContain('private Integer year');
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