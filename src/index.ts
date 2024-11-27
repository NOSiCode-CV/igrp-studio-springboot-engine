import {
  ApiConfig,
  BaseApiConfig,
  ControllerConfig,
  DTOBaseConfig,
  DTOConfig,
  HandlerConfig,
  JavaAttribute,
  ModelConfig,
  ModuleConfig,
  PermissionConfig,
  RenderContext,
} from './interfaces/types';
import {
  JAVA_ATTRIBUTE_TYPES,
  CRUD_DISABLED_OPTIONS,
  DATABASE_TYPES,
  DIRECTORIES,
  ERROR_MESSAGE,
  GENERATION_TYPES,
  HTTP_METHOD_TYPES,
  MIME_TYPES,
  PARAMS_TYPES,
  PROJECT_STRUCTURE_STYLE,
  RELATIONSHIP_TYPES,
  RESPONSE_TYPES, GENERIC_ATTRIBUTE_TYPES, GENERIC_COLLECTION_TYPES,
} from './utils/constants';
import { apiValidation } from './schema/baseApiConfig';
import path from 'path';
import { validateModelConfig } from './schema/modelConfig';
import { checkIfDirectoryExists, checkIfDirectoryIsEmpty } from './utils/checkFiles';
import { generateModel } from './modules/model/generateModel';
import { validateController } from './schema/controllerConfig';
import { deleteModelConfig } from './modules/model/deleteModel';
import { saveFileConfig } from './modules/baseApi/saveBaseApiFiles';
import { getBaseApiConfig } from './modules/common/getBaseApiConfig';
import { generateRepository, generateRepositoryImpl } from './modules/model/generateRepository';
import { saveBaseApiFileConfig } from './modules/baseApi/saveBaseApiConfig';
import { generateController } from './modules/controller/generateController';
import { createAppDirectories } from './modules/baseApi/createAppDirectories';
import { deleteControllerConfig } from './modules/controller/deleteController';
import { saveControllerConfig } from './modules/controller/saveControllerConfig';
import { generateServiceInterface } from './modules/controller/generateServiceInterface';
import { saveDTOConfig } from './modules/dto/saveDTOConfig';
import { generateDTO, transformDTOConfig } from './modules/dto/generateDTO';
import { deleteDTOConfig } from './modules/dto/deleteDTO';
import { validateDeleteDTOConfig, validateDTOConfig } from './schema/dtoConfig';
import { getDTOTypes } from './modules/dto/helpers';
import { checkPrimaryKeys } from './modules/model/checkPrimaryKeys';
import { cleaner } from './modules/common/cleanerConfigFile';

import { checkDuplicated } from './modules/common/checkDuplicates';
import { capitalize } from './utils/capitalizeStrings';
import { generateServiceInmpl } from './modules/controller/generateService';
import { upperCaseResponse } from './modules/common/upperCaseActionResponse';
import { savePermission } from './modules/permission/savePermissionConfig';
import { validatePermission } from './schema/permissionConfig';
import { deletePerm } from './modules/permission/deletePermission';
import { generateHandlers } from './modules/handlers/generateHandlers';
import { generateQueryServiceInterface } from './modules/controller/generateQueryServiceInterface';
import { generateQueryServiceInmpl } from './modules/controller/generateQueryService';
import { getMainPath, loadDTOConfig, normalizePackageName, replaceTemplate } from './utils/helpers';
import { getAllPermissions } from './modules/permission/getPermissions';
import { saveModuleConfig } from './modules/module/saveModuleConfig';
import { createModuleDirectory } from './modules/module/createModuleDirectory';
import { moduleValidation } from './schema/moduleConfig';
import { createTestDirectories } from './modules/baseApi/createTestDirectories';
import { saveBaseTestApiFileConfig } from './modules/baseApi/saveBaseTestApiFiles';

/**
 * Main Function that creates the base api
 *
 * This function initializes and sets up the base structure for an API based on the provided configuration.
 *
 * @param {ApiConfig} config - The configuration object containing all the basic API information.
 * @param {string} basePath - The output path where the API will be created. This path must be empty.
 * @throws Will throw an error if the API configuration is invalid or if the specified directory is not empty.
 *
 * @example
 * Example usage:
 * import { newApi } from "spring-engine";
 * import { ApiConfig } from "spring-engine/dist/interfaces/types";
 *
 * const config: Apiconfig = {
 *    type: 'baseApi'
 *    apiName: 'my_api' //Names with hyphens or spaces are not accepted.
 *    group: 'example'
 *    packageName: 'demo'
 *    database: 'MySQL' //you can choose between MySQL and PostgreSQL
 *    description: 'your project descripcion' //optional field
 * }
 * const basePath: 'C://your_path'; The path must be empty
 *
 * const createApi = async () => {
 *    try {
 *      await newApi(config, basePath)
 *    }
 *    catch(error) {
 *      console.log(error)
 *    }
 * }
 *
 */
export const newApi = async (dirty: BaseApiConfig, basePath: string) => {
  const baseConfig = cleaner(dirty);

  const valid = apiValidation(baseConfig);

  if (!valid && apiValidation.errors) throw apiValidation.errors;

  const config: ApiConfig = {
    type: baseConfig.type,
    apiName: baseConfig.apiName,
    group: baseConfig.group,
    artifact: baseConfig.artifact,
    packageName: normalizePackageName(baseConfig.artifact),
    database: baseConfig.database,
    description: baseConfig.description,
    package: baseConfig.package,
    projectStructureStyle: baseConfig.projectStructureStyle,
    name: baseConfig.name,
    enableObservability: baseConfig.enableObservability,
  };

  if (!basePath) {
    throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;
  }

  if (!(await checkIfDirectoryIsEmpty(basePath))) {
    throw ERROR_MESSAGE.DIRECTORY_ALREADY_IN_USE;
  }

  await saveBaseApiFileConfig(config, basePath);

  const context: RenderContext = {
    resourceConfig: undefined, // On base API, there is no specific config.
    basePath,
    baseConfig: config,
    fullPath: basePath
  };
  /**
   * Creates the folder structure needed for the API.
   */
  await createAppDirectories(context);
  await createTestDirectories(context);

  /**
   * With the base config sent to the newAPI, this function should create the following:
   *  - Base config files (pom.xml, mvnw, application.properties, etc.)
   *  - .igrpstudio config files (baseApi.json)
   *  - Application bootstrapping files ([API_NAME]Application.java)
   */
  await saveFileConfig(context);
  await saveBaseTestApiFileConfig(context);
};

export const addModule = async (dirty: ModuleConfig, basePath: string) => {
  const config = cleaner(dirty);
  const valid = moduleValidation(config);

  if (!valid && moduleValidation.errors) throw moduleValidation.errors;

  if (!basePath) {
    throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;
  }

  const baseConfig = await getBaseApiConfig(basePath);

  const context: RenderContext<ModuleConfig> = {
    resourceConfig: config,
    basePath,
    baseConfig: baseConfig,
    fullPath: getMainPath(baseConfig.group, baseConfig.packageName)
  };

  if (
    await checkIfDirectoryExists(
      path.join(
        context.basePath,
        getMainPath(context.baseConfig.group, context.baseConfig.packageName),
        context.resourceConfig.name,
      ),
    )
  ) {
    throw ERROR_MESSAGE.MODULE_CREATED_ALREADY;
  }

  await createModuleDirectory(context);

  await saveModuleConfig(context, basePath);
};

/**
 * Generates and saves a model to the API.
 * This function creates a model based on the provided configuration and saves it to the specified API base path.
 * It also generates the associated CRUD operations if enabled in the configuration.
 *
 * @param {ModelConfig} config - Model configuration object, which includes the name and other details of the model.
 * @param {string} basePath - Application base path where the model will be saved and generated to the API.
 *
 * @throws {Error} Will throw an error if the model configuration is invalid or the model name is missing.
 * @throws {Error} Will throw an error if the base path is not provided.
 *
 * @example
 * // Example usage:
 * import { addModel } from "spring-engine";
 * import { ModelConfig } from "spring-engine/dist/interfaces/types";
 * const config: ModelConfig = {
 *   type: 'model',
 *   name: 'User',
 *   attributes: [
 *     { type: 'String', name: 'email', unique: true, notNull: true, required: true },
 *     { type: 'String', name: 'password', notNull: true, required: true },
 *   ],
 *   crud: {
 *     enabled: true,
 *     path: '/users',
 *     disabledMethods: ['DELETE']
 *   },
 *   relations: []
 * };
 * const basePath = 'C://your_project_path';
 *
 * const createModel = async () => {
 *   try {
 *     await addModel(config, basePath);
 *   } catch (error) {
 *     console.error(error);
 *   }
 * };
 */
export const addModel = async (dirty: ModelConfig, basePath: string) => {
  if (!basePath) throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;

  /**
   * the cleaner function removes all null or empty attributes from the json to avoid error in ajv validation
   */
  const config: ModelConfig = cleaner(dirty);

  if (dirty.crud) {
    config.crud = dirty.crud;
  }

  dirty.uniqueConstraints ? (config.uniqueConstraints = dirty.uniqueConstraints) : '';
  dirty.indexes ? (config.indexes = dirty.indexes) : '';

  // this function check is the request params in actions have duplicateds names
  checkDuplicated(config.attributes, [], []);

  const valid = validateModelConfig(config);

  if (!valid && validateModelConfig.errors) {
    throw validateModelConfig.errors;
  }

  /**
   * check if the correct primary key was selected
   */
  checkPrimaryKeys(config);

  const baseConfig = await getBaseApiConfig(basePath);
  config.name = capitalize(config.name);

  const context: RenderContext<ModelConfig> = {
    resourceConfig: config,
    basePath,
    baseConfig,
    fullPath: basePath
  };

  await generateModel(context);

  await generateRepository(context);

  if (context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
    await generateRepositoryImpl(context);

    // DDD FULL
    /*const doContext: RenderContext<DTOConfig> = {
      resourceConfig: await transformDTOConfig({
        name: config.name,
        template: 'classic',
        attributes: config.attributes.map(e => ({ name: e.name, type: e.type, ns: e.ns!, primaryKey: e.primaryKey})),
        type: 'dataobject',
        aggregate: config.aggregate
        }, baseConfig, basePath
      ),
      basePath,
      baseConfig,
    };

    await generateDTO(doContext);
    await generateDomainConverter(context);*/
  }
};

/**
 * Adds CRUD operations to an existing model.
 *
 * This function allows you to add CRUD (Create, Read, Update, Delete) functionality to a model.
 * The CRUD can be added either when the model is initially created or by calling this function later.
 * The CRUD configuration is defined in the `crud` property of the `ModelConfig` object.
 *
 * @param {ModelConfig} config - The model configuration object, including the model name and CRUD details.
 * @param {string} basePath - The base path of the application where the model and its CRUD operations will be generated and saved.
 *
 * @throws {Error} Throws an error if the model configuration is invalid or if the base path is not provided.
 *
 * @example
 * // Example usage:
 * const config: ModelConfig = {
 *   type: 'model',
 *   name: 'Product', // The name should be 'Product', not 'ProductModel'.
 *   attributes: [
 *     { type: 'String', name: 'name', required: true, notNull: true },
 *     { type: 'Integer', name: 'price', notNull: true }
 *   ],
 *   crud: {
 *     enabled: true,
 *     path: '/products',
 *     disabledMethods: ['DELETE'] // Example of disabling the DELETE method
 *   }
 * };
 *
 * const basePath = 'C://your_project_path';
 *
 * const addProductCrud = async () => {
 *   try {
 *     await addCrud(config, basePath);
 *     console.log('CRUD operations for Product have been successfully added.');
 *   } catch (error) {
 *     console.error('Error adding CRUD operations:', error);
 *   }
 * };
 */
export const addCrud = async (config: ModelConfig, basePath: string) => {
  await addModel(config, basePath);
};

/**
 * Adds a relationship between the specified models.
 *
 * This function modifies the configuration of an existing model to include a new relationship.
 * The relationship is defined in the `relations` property of the `ModelConfig` object.
 * All models involved in the relationship should already be created.
 * The function will update the model configuration file by adding the relation parameter and then call the `addModel` function to apply the changes.
 *
 * @param {ModelConfig} config - The model configuration object, including the relationship details.
 * @param {string} basePath - The base path of the application where the model configuration will be updated and saved.
 *
 * @throws {Error} Throws an error if the model configuration is invalid or if the base path is not provided.
 *
 * @example
 * // Example usage:
 * const config: ModelConfig = {
 *   type: 'model',
 *   name: 'Order', // The name should be 'Order', not 'OrderModel'.
 *   attributes: [
 *     { type: 'number', name: 'id', primary: true, unique: true, notNull: true },
 *     { type: 'string', name: 'description', notNull: true }
 *   ],
 *   relations: [
 *     {
 *       relationType: 'ManyToOne',
 *       entity: 'Customer', // Relating 'Order' with 'Customer'
 *       joinColumn: 'customer_id'
 *     }
 *   ]
 * };
 *
 * const applicationBasePath = 'C://your_project_path';
 *
 * const addOrderRelationship = async () => {
 *   try {
 *     await addRelationship(config, applicationBasePath);
 *     console.log('Relationship between Order and Customer has been successfully added.');
 *   } catch (error) {
 *     console.error('Error adding relationship:', error);
 *   }
 * };
 *
 * addOrderRelationship();
 */
export const addRelationship = async (config: ModelConfig, basePath: string) => {
  await addModel(config, basePath);
};

/**
 * Deletes a model and its associated repository from the API.
 *
 * This function removes a model configuration and its related repository files based on the provided configuration.
 * It ensures that the model is properly deleted from the specified API base path.
 *
 * @param {ModelConfig} config - The model configuration object, which primarily includes the type and name of the model to be deleted.
 * @param {string} basePath - The base path of the application where the model and repository are located.
 *
 * @throws {Error} Will throw an error if the model configuration is invalid.
 * @throws {Error} Will throw an error if the base path is not provided.
 *
 * @example
 * // Example usage:
 * const config: ModelConfig = {
 *   type: 'model',
 *   name: 'User',
 *   attributes: [],
 *   crud: {},
 *   relations: []
 * };
 * const basePath = 'C://your_project_path';
 *
 * const removeModel = async () => {
 *   try {
 *     await deleteModel(config, basePath);
 *   } catch (error) {
 *     console.error(error);
 *   }
 * };
 *
 */
export const deleteModel = async (config: ModelConfig, basePath: string) => {
  const valid = validateModelConfig(config);

  if (!valid && validateModelConfig.errors) {
    throw validateModelConfig.errors;
  }

  if (!basePath) throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;

  const baseConfig = await getBaseApiConfig(basePath);

  config.name = capitalize(config.name);

  const context: RenderContext<ModelConfig> = {
    resourceConfig: config,
    basePath,
    baseConfig,
    fullPath: basePath
  };

  await deleteModelConfig(context);
};

/**
 * Generates and saves a model to the API.
 * This function creates a model based on the provided configuration and saves it to the specified API base path.
 * It also generates the associated CRUD operations if enabled in the configuration.
 *
 * @param {ModelConfig} config - Model configuration object, which includes the name and other details of the model.
 * @param {string} basePath - Application base path where the model will be saved and generated to the API.
 *
 * @throws {Error} Will throw an error if the model configuration is invalid or the model name is missing.
 * @throws {Error} Will throw an error if the base path is not provided.
 *
 * @example
 * // Example usage:
 * import { addDTO } from "spring-engine";
 * import { DTOConfig } from "spring-engine/dist/interfaces/types";
 * const config: DTOConfig = {
 *   type: 'dto',
 *   name: 'User',
 *   attributes: [
 *     { type: 'String', ns: 'java', name: 't0'},
 *     { type: { name: 'DTO1' }, ns: 'dto', name: 't1'},
 *     { type: { name: 'CTO1' }, ns: 'dto', name: 't2'},
 *     { type: { name: 'TPessoa' }, ns: 'model', name: 't21'},
 *
 *     { type: { name: 'List', generics:[{name: 'Integer', ns: 'java'}]}, ns: 'java', name: 't3'},
 *     { type: { name: 'List', generics:[{name: 'BigDecimal', ns: 'java'}]}, ns: 'java', name: 't4'},
 *   ]
 * };
 * const basePath = 'C://your_project_path';
 *
 * const createDTO = async () => {
 *   try {
 *     await addDTO(config, basePath);
 *   } catch (error) {
 *     console.error(error);
 *   }
 * };
 */
export const addDTO = async (dirty: DTOConfig | HandlerConfig, basePath: string) => {
  /**
   * the cleaner function removes all null or empty attributes from the json to avoid error in ajv validation
   */
  const config: DTOConfig = cleaner(dirty);

  // this function check is the request params in actions have duplicateds names
  checkDuplicated([], [], config.attributes);

  const valid = validateDTOConfig(config);

  if (!valid && validateDTOConfig.errors) {
    throw validateDTOConfig.errors;
  }

  if (!basePath) throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;

  config.name = capitalize(config.name);
  const baseConfig = await getBaseApiConfig(basePath);

  if (config.type === 'dto') await saveDTOConfig(config, basePath);

  const context: RenderContext<DTOConfig> = {
    resourceConfig: await transformDTOConfig(config, baseConfig, basePath),
    basePath,
    baseConfig,
    fullPath: basePath
  };

  await generateDTO(context);

  if (context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
    if (
      context.resourceConfig.type === 'command' ||
      context.resourceConfig.type === 'event' ||
      context.resourceConfig.type === 'query'
    ) {
      await generateHandlers(context);
    }
  }
};

/**
 * Deletes a dto from the API.
 *
 * This function removes a dto configuration based on the provided configuration.
 * It ensures that the dto is properly deleted from the specified API base path.
 *
 * @param {DTOBaseConfig} config - The dto configuration object, which primarily includes the type and name of the model to be deleted.
 * @param {string} basePath - The base path of the application where the dto and repository are located.
 *
 * @throws {Error} Will throw an error if the dto configuration is invalid.
 * @throws {Error} Will throw an error if the base path is not provided.
 * @throws {Error} Will throw an error the DTO is beeing used in other json configuration.
 * @example
 * // Example usage:
 * import { deleteDTO } from "spring-engine";
 * import { DTOBaseConfig } from "spring-engine/dist/interfaces/types";
 import { checkDuplicated } from './modules/controller/checkDuplicates';
 import { validatePermission } from './schema/permissionConfig';
 * const config: DTOBaseConfig = {
 *   type: 'dto',
 *   name: 'User'
 * };
 * const basePath = 'C://your_project_path';
 *
 * const removeDTO = async () => {
 *   try {
 *     await deleteDTO(config, basePath);
 *   } catch (error) {
 *     console.error(error);
 *   }
 * };
 *
 */
export const deleteDTO = async (config: DTOBaseConfig, basePath: string) => {
  const valid = validateDeleteDTOConfig(config);

  if (!valid && validateDeleteDTOConfig.errors) {
    throw validateDeleteDTOConfig.errors;
  }

  if (!basePath) throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;

  const baseConfig = await getBaseApiConfig(basePath);
  config.name = capitalize(config.name);

  const context: RenderContext<DTOBaseConfig> = {
    resourceConfig: config,
    basePath,
    baseConfig,
    fullPath: basePath
  };

  await deleteDTOConfig(context, false);
};

/**
 * Generates and saves a controller in the API.
 *
 * This function creates a controller based on the provided configuration and integrates it into the specified API base path.
 * It also generates the corresponding service interface for the controller actions defined.
 *
 * @param {ControllerConfig} config - The controller configuration object, including the controller name, base path, and actions.
 * @param {string} basePath - The base path of the application where the controller will be generated and saved.
 *
 * @throws {Error} Throws an error if the controller configuration is invalid or if the base path is not provided.
 *
 * @example
 * // Example usage:
 * const config: ControllerConfig = {
 *   type: 'controller',
 *   name: 'User', //The name should be 'User', not 'UserController'.
 *   basePath: '/users',
 *   actions: [
 *     {
 *       name: 'getUser',
 *       path: '/user',
 *       method: 'GET',
 *       pathParams: [
 *         { type: 'string', name: 'id' }
 *       ],
 *       response: 'User'
 *     },
 *     {
 *       name: 'createUser',
 *       path: '/user',
 *       method: 'POST',
 *       response: 'User'
 *     }
 *   ]
 * };
 *
 * const applicationBasePath = 'C://your_project_path';
 *
 * const generateUserController = async () => {
 *   try {
 *     await addController(config, applicationBasePath);
 *     console.log('UserController has been successfully generated.');
 *   } catch (error) {
 *     console.error('Error generating UserController:', error);
 *   }
 * };
 *
 */
export const addController = async (dirty: ControllerConfig, basePath: string) => {
  /**
   * the cleaner function removes all null or empty attributes from the json to avoid error in ajv validation
   */
  const config: ControllerConfig = cleaner(dirty);

  // this function check is the request params in actions have duplicateds names
  checkDuplicated([], config.actions, []);

  config.actions = upperCaseResponse(config.actions);

  const isConfigValid = validateController(config);

  if (!isConfigValid && validateController.errors) {
    throw validateController.errors;
  }

  if (!basePath) {
    throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;
  }

  const baseConfig = await getBaseApiConfig(basePath);
  config.name = capitalize(config.name);

  const context: RenderContext<ControllerConfig> = {
    resourceConfig: config,
    basePath,
    baseConfig,
    fullPath: basePath
  };

  await generateController(context);

  if (context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
    const module = context.resourceConfig.module ?? DIRECTORIES.SHARED;

    for (const act of config.actions) {
      const config: DTOConfig | null = act?.requestBody
        ? await loadDTOConfig(
            'dto',
            path.join(context.basePath, replaceTemplate(DIRECTORIES.CONFIG_DTO, { module })),
            act.requestBody.replace('DTO', ''),
          )
        : null;
      await addDTO(
        {
          type: act.method === 'GET' ? 'query' : 'command',
          name: act.actionName,
          template: 'classic',
          module: module,
          attributes: act?.requestBody
            ? config!.attributes
            : ((act?.pathVariables
                ? act.pathVariables
                    .map((e) => ({
                      name: e.name,
                      type: e.type,
                      ns: 'java',
                      required: true,
                    }))
                    .concat(
                      act?.requestParams
                        ? act.requestParams.map((e) => ({
                            name: e.name,
                            type: e.type,
                            ns: 'java',
                            required: true,
                          }))
                        : [],
                    )
                : act?.requestParams
                  ? act.requestParams
                      .map((e) => ({
                        name: e.name,
                        type: e.type as 'long' | 'string' | 'integer' | 'boolean' | 'object',
                        ns: 'java',
                        required: true,
                      }))
                      .concat(
                        act?.pathVariables
                          ? act.pathVariables.map((e) => ({
                              name: e.name,
                              type: e.type as 'long' | 'string' | 'integer' | 'boolean' | 'object',
                              ns: 'java',
                              required: true,
                            }))
                          : [{ name: 'none', type: 'object', ns: 'java', required: false }],
                      )
                  : [
                      { name: 'none', type: 'object', ns: 'java', required: false },
                    ]) as JavaAttribute[]),
          response: act.response,
        } as HandlerConfig,
        context.basePath,
      );
    }

    await generateQueryServiceInterface(context);
    await generateQueryServiceInmpl(context);

    await generateServiceInterface(context);
    await generateServiceInmpl(context);

    // DDD FULL
    /*await generateQueryServiceInterface(context);
    await generateQueryServiceInmpl(context);

    await generateAggregateRoot(context);
    await generateAggregateRootHandler(context);

    const dddContext: RenderContext<ModelConfig> = {
      resourceConfig: {type: 'model', name: config.name, attributes: config.attributes!.map(e => ({ name: e.name, type: e.type as AttributeType, primaryKey: e.primaryKey})), tableName: config.name}, baseConfig, basePath,
    };

    await generateAggregateRepository(dddContext)
    await generateAggregateConverter(dddContext)*/
  } else {
    await generateServiceInterface(context);
    await generateServiceInmpl(context);
  }
};

/**
 *
 * @param config
 * @param basePath
 */
export const updateController = async (config: ControllerConfig, basePath: string) => {
  const isConfigValid = validateController(config);

  if (!isConfigValid && validateController.errors) {
    throw validateController.errors;
  }

  if (!basePath) {
    throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;
  }

  const baseConfig = await getBaseApiConfig(basePath);
  config.name = capitalize(config.name);

  await saveControllerConfig(config, basePath);

  const context: RenderContext<ControllerConfig> = {
    resourceConfig: config,
    basePath,
    baseConfig,
    fullPath: basePath
  };

  await generateController(context);
  await generateServiceInterface(context);
};

/**
 *
 * @param config
 * @param basePath
 */
export const deleteController = async (config: ControllerConfig, basePath: string) => {
  const valid = validateController(config);

  if (!valid && validateModelConfig.errors) throw validateController.errors;

  if (!basePath) throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;

  const baseConfig = await getBaseApiConfig(basePath);
  config.name = capitalize(config.name);

  const context: RenderContext<ControllerConfig> = {
    resourceConfig: config,
    basePath,
    baseConfig,
    fullPath: basePath
  };

  await deleteControllerConfig(context);
};

/**
 *
 * @param config
 * @param basePath
 */
export const addPermission = async (config: PermissionConfig, basePath: string) => {
  const valid = validatePermission(config);
  if (!valid && validatePermission.errors) throw validatePermission.errors;

  if (!basePath) throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;

  await savePermission(config, basePath);
};

/**
 *
 * @param basePath
 * @returns the permissions select options to be used in the IGRP Studio frontend
 */
export const getPermissions = async (basePath: string) => {
  if (!basePath) throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;
  return await getAllPermissions(basePath);
};

export const deletePermission = async (config: PermissionConfig, basePath: string) => {
  if (!basePath) throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;

  const valid = validatePermission(config);
  if (!valid && validatePermission.errors) throw validatePermission.errors;

  const baseConfig = await getBaseApiConfig(basePath);

  const context: RenderContext<PermissionConfig> = {
    resourceConfig: config,
    basePath,
    baseConfig,
    fullPath: basePath,
  };

  await deletePerm(context);
};

/**
 *
 * @param module
 * @param basePath
 * @returns
 */
export const engineTypes = async (module: string, basePath: string) => {
  if (!basePath) throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;

  let dtos = [];
  const typesDTOs = await getDTOTypes(module, basePath);

  for (const dto of typesDTOs.values()) {
    dtos.push(`${dto.name}DTO`);
  }
  const responseTypes = [...RESPONSE_TYPES, ...dtos, ...dtos.map((dto) => `List<${dto}>`)];

  let bodyTypes = ['Object', ...dtos];

  let paramsTypes = [...PARAMS_TYPES, ...dtos];

  const allTypes = [
    { MYME_TYPES: MIME_TYPES },
    { BODY_REQUEST: bodyTypes },
    { PARAMS_TYPES: paramsTypes },
    { METHODS: HTTP_METHOD_TYPES },
    { REQUEST_PARAMS: PARAMS_TYPES },
    { DATABASE_TYPES: DATABASE_TYPES },
    { RESPONSE_TYPES: responseTypes },
    { ATTRIBUTE_TYPES: GENERIC_ATTRIBUTE_TYPES },
    { COLLECTION_TYPES: GENERIC_COLLECTION_TYPES },
    { RELATIONSHIP_TYPES: RELATIONSHIP_TYPES },
    { CRUD_DISABLED_OPTIONS: CRUD_DISABLED_OPTIONS },
    { GENERATION_TYPES: GENERATION_TYPES.filter((gt) => gt !== '') },
  ];

  return allTypes;
};
