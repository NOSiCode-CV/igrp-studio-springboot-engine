import {
  ControllerAction,
  ControllerConfig,
  CrudControllerConfig,
  HttpMethod,
  JavaAttribute,
  PathVariables,
  RenderContext,
} from '../../interfaces/types';
import { loadModelConfigs } from '../../utils/helpers';
import { addController, addDTO } from '../../index';
import { getBaseApiConfig } from '../common/getBaseApiConfig';
import { DIRECTORIES } from '../../utils/constants';
import { generateElementId } from '../serialization/helpers';
import { generateCrudServiceInmpl } from './generateCrudServiceInmpl';
import { toCamelCase } from '../../helper/stringHelper';

export const generateCrudController = async (config: CrudControllerConfig, basePath: string) => {
  const baseConfig = await getBaseApiConfig(basePath);

  let dtoFields: JavaAttribute[] = [];
  let pathVariables: PathVariables[] = [];

  // Step 1: Load model configurations, get attributes and generate DTO
  for (const model of config.models) {
    const models = await loadModelConfigs(model.module ?? DIRECTORIES.SHARED, basePath);
    const modelConfig = models.find((it) => it.id === model.modelName);

    if (!modelConfig) throw Error('Model with id <' + model.modelName + '> was not found!');

    model.modelName = modelConfig.name;

    pathVariables.push({
      type: 'string',
      name: `${toCamelCase(model.modelName)}Id`,
      isRequired: true,
    });

    modelConfig.attributes
      .filter((attr) => model.fields.map((f) => f.name).includes(attr.name))
      .forEach((field) =>
        dtoFields.push({
          name: field.name,
          type: field.type,
          objectType: field.objectType ?? 'java',
          required: !(field.nullable ?? false),
          module: field.module,
          maxLength: field.length,
          primaryKey: field.primaryKey,
          collectionType: ['ManyToMany', 'ManyToOne', 'OneToMany'].includes(
            field.relation?.type ?? '',
          )
            ? 'collection'
            : undefined,
        } as JavaAttribute),
      );
  }

  await addDTO(
    {
      type: 'dto',
      name: `${config.name}DTO`,
      template: 'classic',
      module: config.module ?? DIRECTORIES.SHARED,
      attributes: dtoFields,
    },
    basePath,
  );

  // Step 2: Generate controller actions based on selected HTTP methods
  const controllerActions: ControllerAction[] = [];

  if (config.methods.create) {
    controllerActions.push({
      actionName: `create${config.name}`,
      method: 'POST' as HttpMethod,
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: `${config.name}DTO`,
              objectType: 'dto',
              module: config.module ?? DIRECTORIES.SHARED,
            },
          },
        },
      },
      responses: {
        '201': {
          content: {
            'application/json': {
              schema: {
                type: `${config.name}DTO`,
                objectType: 'dto',
                module: config.module ?? DIRECTORIES.SHARED,
              },
            },
          },
        },
      },
    });
  }

  if (config.methods.read) {
    controllerActions.push({
      actionName: `get${config.name}ById`,
      method: 'GET' as HttpMethod,
      pathVariables: pathVariables,
      responses: {
        '200': {
          id: generateElementId(),
          content: {
            'application/json': {
              schema: {
                type: `${config.name}DTO`,
                objectType: 'dto',
                module: config.module ?? DIRECTORIES.SHARED,
              },
            },
          },
        },
        '404': {
          id: generateElementId(),
          name: `${config.name}NotFound`,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    description: `Error message indicating ${config.name} was not found`,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  if (config.methods.update) {
    controllerActions.push({
      actionName: `update${config.name}`,
      method: 'PUT' as HttpMethod,
      pathVariables: pathVariables,
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: `${config.name}DTO`,
              objectType: 'dto',
              module: config.module ?? DIRECTORIES.SHARED,
            },
          },
        },
      },
      responses: {
        '200': {
          content: {
            'application/json': {
              schema: {
                type: `${config.name}DTO`,
                objectType: 'dto',
                module: config.module ?? DIRECTORIES.SHARED,
              },
            },
          },
        },
      },
    });
  }

  if (config.methods.delete) {
    controllerActions.push({
      actionName: `delete${config.name}ById`,
      method: 'DELETE' as HttpMethod,
      pathVariables: pathVariables,
      responses: {
        '200': {
          name: `${config.name}Deleted`,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  deleted: { type: 'boolean' },
                },
              },
            },
          },
        },
      },
    });
  }

  // Step 5: Generate the controller
  const controllerConfig: ControllerConfig = {
    id: generateElementId(),
    type: 'controller',
    name: config.name,
    basePath: config.basePath,
    actions: controllerActions,
    module: config.module,
    description: config.description,
  };

  const serviceContext: RenderContext<ControllerConfig> = {
    resourceConfig: controllerConfig,
    basePath,
    baseConfig: baseConfig,
    fullPath: basePath,
  };

  const implContext: RenderContext<CrudControllerConfig> = {
    resourceConfig: config,
    basePath,
    baseConfig: baseConfig,
    fullPath: basePath,
  };

  await addController(controllerConfig, basePath, true);

  // Generate service implementation
  await generateCrudServiceInmpl(implContext);
};