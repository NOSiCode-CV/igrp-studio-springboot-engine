import {
  ApiConfig,
  AppExportsConfig,
  BaseApiConfig,
  ControllerAction,
  ControllerConfig,
  CrudControllerConfig,
  DdlConfig,
  DeleteConfig,
  Dependency,
  DTOConfig,
  EngineConfigurationSettings,
  EnumConfig,
  GroupPermissionDef,
  HandlerConfig,
  JavaAttribute,
  JsonConfig,
  ModelConfig,
  ModuleConfig,
  MoveConfig,
  PathConfig,
  PermissionConfig,
  RenderContext,
  ResponseConfig,
  SqlConfig,
  XmlConfig,
} from './interfaces/types';
import {
  CATEGORIZED_ATTRIBUTE_TYPES,
  CRUD_DISABLED_OPTIONS,
  DATABASE_TYPES,
  DIRECTORIES,
  ERROR_MESSAGE,
  GENERATION_TYPES,
  GENERIC_COLLECTION_TYPES,
  HTTP_HEADER_TYPES,
  HTTP_METHOD_TYPES,
  MIME_TYPES,
  PARAMS_TYPES,
  PROJECT_STRUCTURE_STYLE,
  RELATIONSHIP_TYPES,
  SCHEMA_TYPES,
} from './utils/constants';
import {apiValidation} from './schema/baseApiConfig';
import path from 'path';
import {validateModelConfig} from './schema/modelConfig';
import {checkIfDirectoryExists, checkIfDirectoryIsEmpty} from './utils/checkFiles';
import {generateModel} from './modules/model/generateModel';
import {validateController} from './schema/controllerConfig';
import {saveFileConfig} from './modules/baseApi/saveBaseApiFiles';
import {getBaseApiConfig} from './modules/common/getBaseApiConfig';
import {generateRepository, generateRepositoryImpl} from './modules/model/generateRepository';
import {saveBaseApiFileConfig} from './modules/baseApi/saveBaseApiConfig';
import {generateController} from './modules/controller/generateController';
import {createAppDirectories} from './modules/baseApi/createAppDirectories';
import {generateServiceInterface} from './modules/controller/generateServiceInterface';
import {normalizeName, saveDTOConfig} from './modules/dto/saveDTOConfig';
import {generateDTO, transformDTOConfig} from './modules/dto/generateDTO';
import {validateDTOConfig} from './schema/dtoConfig';
import {getDTOTypes} from './modules/dto/helpers';
import {checkPrimaryKeys} from './modules/model/checkPrimaryKeys';
import {cleaner} from './modules/common/cleanerConfigFile';

import {checkDuplicated} from './modules/common/checkDuplicates';
import {generateServiceInmpl} from './modules/controller/generateService';
import {generateValidatorDTO} from './modules/dto/generateDTOCustomValidator';
import {savePermission} from './modules/permission/savePermissionConfig';
import {validatePermission} from './schema/permissionConfig';
import {deletePerm} from './modules/permission/deletePermission';
import {generateHandlers} from './modules/handlers/generateHandlers';
import {getMainPath, loadDTOConfig, normalizePackageName, replaceTemplate} from './utils/helpers';
import {getAllPermissions} from './modules/permission/getPermissions';
import {saveModuleConfig} from './modules/module/saveModuleConfig';
import {createModuleDirectory} from './modules/module/createModuleDirectory';
import {moduleValidation} from './schema/moduleConfig';
import {createTestDirectories} from './modules/baseApi/createTestDirectories';
import {saveBaseTestApiFileConfig} from './modules/baseApi/saveBaseTestApiFiles';
import {enumValidation} from './schema/enumConfig';
import {generateEnum} from './modules/enum/generateEnum';
import {generateRequest} from './modules/controller/generateRequest';
import {generateResponses} from './modules/controller/generateResponses';
import {validateResponse} from './schema/requestConfig';
import {saveResponseConfig} from './modules/response/saveResponseConfig';
import {generateSingleResponse} from './modules/response/generateSingleResponse';
import {deleteValidation} from './schema/deleteConfig';
import {deleteElementConfig} from './modules/delete/deleteElementConfig';
import {serializationValidation} from './schema/serializationConfig';
import {serializeData} from './modules/serialization/serializeData';
import {saveEnumConfig} from './modules/enum/saveEnumConfig';
import {generateTestServiceInmpl} from './modules/test/generateTestService';
import {generateTestHandlers} from './modules/test/generateTestHandlers';
import {processTableName} from './modules/model/helpers';
import {capitalize, capitalizeJavaStyle} from './helper/stringHelper';
import {isPageable} from './helper/logicalHelper';
import {generateCrudController} from './modules/crudController/generateCrudController';
import {getSpringInitializerDependencies,} from './helper/springInitializerHelper';
import {moveElementConfig} from './modules/move/moveElementConfig';
import {moveValidation} from './schema/moveConfig';
import {verifyEnumAttributes} from './modules/enum/helpers';
import defaultEngineModule from './config/default';
import {configurationAsObject, setConfiguration} from './config';
import {engineConfigurationRegistrationValidate} from './schema/engineConfigurationRegisterConfig';
import fs from "fs-extra";
import {buildPermissionGroup} from "./utils/permissionParser";
import {saveGroupPermissionDef} from "./modules/permission/saveGroupPermissionDefinition";

export function getPaths(): PathConfig {
  const environment = loadEngineConfiguration().environment;

  if (environment === 'production') {
    return {
      template: path.join(__dirname, './templates'),
      partials: path.join(__dirname, './templates/partials'),
      springDependencies: path.join(__dirname, './spring_dependencies/spring-dependencies.json'),
    };
  } else {
    return {
      template: path.join(__dirname, '../public/templates'),
      partials: path.join(__dirname, '../public/templates/partials'),
      springDependencies: path.join(
        __dirname,
        '../public/spring_dependencies/spring-dependencies.json',
      ),
    };
  }
}


export const setEngineConfiguration = (config: EngineConfigurationSettings) => {
  const isConfigValid = engineConfigurationRegistrationValidate(config);

  if (!isConfigValid && engineConfigurationRegistrationValidate.errors)
    throw engineConfigurationRegistrationValidate.errors;

  setConfiguration((e) => defaultEngineModule.register(e, config))

}

export const loadEngineConfiguration = (name?: string) => {
  return configurationAsObject(name);
}



/**
 * Main Function that creates the base api
 *
 * This function initializes and sets up the base structure for an API based on the provided configuration.
 *
 * @param {BaseApiConfig} dirty - The configuration object containing all the basic API information.
 * @param {string} basePath - The output path where the API will be created. This path must be empty.
 * @throws {Error} Will throw an error if the API configuration is invalid or if the specified directory is not empty.
 *
 * @example
 * Example usage:
 * import { newApi } from "spring-engine";
 * import { ApiConfig } from "spring-engine/dist/interfaces/types";
 *
 * const config: ApiConfig = {
 *    type: 'springboot',
 *    name: 'my_api', // Names with hyphens or spaces are not accepted.
 *    group: 'cv.example',
 *    artifact: 'demo',
 *    database: 'MySQL', // You can choose between MySQL, Oracle and PostgreSQL
 *    description: 'your project description', // Optional field
 *    projectStructureStyle: 'technical', // You can choose between technical and domain
 *    enableObservability: true,
 *    igrpCoreVersion: '0.0.1-20250115.133643-3'
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

  const packageJson = require('../package.json');

  const config: ApiConfig = {
    type: baseConfig.type,
    name: baseConfig.name,
    group: baseConfig.group,
    artifact: baseConfig.artifact,
    packageName: normalizePackageName(baseConfig.artifact),
    database: baseConfig.database,
    description: baseConfig.description,
    package: baseConfig.package,
    projectStructureStyle: baseConfig.projectStructureStyle,
    enableObservability: baseConfig.enableObservability,
    enableEntityRevision: baseConfig.enableEntityRevision,
    version: baseConfig.version ?? packageJson.custom?.igrpVersion,
    dependencies: baseConfig.dependencies,
    enableGraalVm: baseConfig.enableGraalVm,
  };

  if (!basePath) {
    throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;
  }

  if (!(await checkIfDirectoryIsEmpty(basePath))) {
    throw ERROR_MESSAGE.DIRECTORY_ALREADY_IN_USE;
  }

  await saveBaseApiFileConfig(config, basePath);

  config.javaVersion = packageJson.custom?.javaVersion;
  config.springBootVersion = packageJson.custom?.springBootVersion;
  config.springDocVersion = packageJson.custom?.springDocVersion;
  config.springCloudVersion = packageJson.custom?.springCloudVersion;

  const context: RenderContext = {
    resourceConfig: undefined, // On base API, there is no specific config.
    basePath,
    baseConfig: config,
    fullPath: basePath,
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

/**
 * Main Function that creates the module
 *
 * This function creates a module based on the provided configuration and saves it to the specified API base path.
 *
 * @param {ModuleConfig} dirty - The configuration object containing all the basic module information.
 * @param {string} basePath - The output path where the module will be created
 * @throws {Error} Will throw an error if the module configuration is invalid.
 *
 * @example
 * Example usage:
 * import { addModule } from "spring-engine";
 * import { ModuleConfig } from "spring-engine/dist/interfaces/types";
 *
 * const config: ModuleConfig = {
 *   type: 'module',
 *   name: 'external',
 * };
 *
 * const basePath: 'C://your_path';
 *
 * const createModule = async () => {
 *    try {
 *      await addModule(config, basePath)
 *    }
 *    catch(error) {
 *      console.log(error)
 *    }
 * }
 *
 */
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
    fullPath: getMainPath(baseConfig.group, baseConfig.packageName),
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
 * Asynchronously retrieves all Spring Initializer dependencies.
 *
 * This function calls the `getSpringInitializerDependencies` function, which fetches the
 * list of dependencies from the Spring Initializer API, and then returns it.
 * If the connection is not successfully it returns the dependencies from a local json named 'spring-dependencies.json'
 *
 * @async
 * @function getSpringDependencies
 * @returns {Promise<Dependency>} - A promise that resolves when dependencies are fetched and logged.
 */
export const getSpringDependencies = async (): Promise<Dependency[]> => {
  return await getSpringInitializerDependencies();
};

/**
 * Generates and saves a model to the API.
 * This function creates a model based on the provided configuration and saves it to the specified API base path.
 * It also generates the associated CRUD operations if enabled in the configuration.
 *
 * @param {ModelConfig} dirty - Model configuration object, which includes the name and other details of the model.
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
 *    type: 'model',
 *    name: 'User',
 *    tableName: 'user',
 *    attributes: [
 *      {
 *        type: 'integer',
 *        name: 'id',
 *        primaryKey: true,
 *        generationType: 'IDENTITY',
 *        nullable: false
 *      },
 *      {
 *        type: 'string',
 *        name: 'username',
 *        length: 255,
 *        nullable: false,
 *        unique: true
 *      },
 *      {
 *        type: 'string',
 *        name: 'email',
 *        length: 255,
 *        nullable: false,
 *        unique: true
 *      },
 *      {
 *        type: 'string',
 *        name: 'password',
 *        length: 255,
 *        nullable: false
 *      },
 *      {
 *        type: 'file',
 *        name: 'document',
 *        nullable: false
 *      },
 *      {
 *        type: 'boolean',
 *        name: 'active',
 *        nullable: false,
 *        defaultValue: true
 *      }
 *    ],
 *    crud: true,
 *    audit: true
 *  };
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

  // this function check is the request params in actions have duplicated names
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
  config.tableName = processTableName(config.tableName, baseConfig.database);

  config.name = capitalizeJavaStyle(config.name); // normalized the model name

  const context: RenderContext<ModelConfig> = {
    resourceConfig: config,
    basePath,
    baseConfig,
    fullPath: basePath,
  };

  if (context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
    context.resourceConfig.name = context.resourceConfig.name.endsWith('Entity')
      ? context.resourceConfig.name
      : `${context.resourceConfig.name}Entity`;
  }

  await generateModel(context);

  await generateRepository(context);

  if (context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
    await generateRepositoryImpl(context);
  }
};

/**
 * Generates and saves a DTO to the API.
 * This function creates a DTO based on the provided configuration and saves it to the specified API base path.
 *
 * @param {DTOConfig} dirty - DTO configuration object, which includes the name and other details of the DTO.
 * @param {string} basePath - Application base path where the DTO will be saved and generated to the API.
 *
 * @throws {Error} Will throw an error if the DTO configuration is invalid or the DTO name is missing.
 * @throws {Error} Will throw an error if the base path is not provided.
 *
 * @example
 * // Example usage:
 * import { addDTO } from "spring-engine";
 * import { DTOConfig } from "spring-engine/dist/interfaces/types";
 * const config: DTOConfig = {
 *   type: 'dto',
 *   name: 'User',
 *   template: 'classic',
 *   attributes: [
 *     {
 *       type: 'string',
 *       objectType: 'java',
 *       name: 'username',
 *       required: true
 *     },
 *     {
 *       type: 'string',
 *       objectType: 'java',
 *       name: 'email',
 *       required: true,
 *       isEmail: true
 *     },
 *     {
 *       type: 'string',
 *       objectType: 'java',
 *       name: 'password',
 *       required: true,
 *       regex: '^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$'
 *     },
 *     {
 *       type: 'string',
 *       objectType: 'java',
 *       name: 'roles',
 *       required: false,
 *       collectionType: 'list'
 *     },
 *     {
 *       type: 'date',
 *       objectType: 'java',
 *       name: 'lastLogin',
 *       required: false
 *     }
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

  const context: RenderContext<DTOConfig> = {
    resourceConfig: await transformDTOConfig(config, baseConfig, basePath),
    basePath,
    baseConfig,
    fullPath: basePath,
  };
  await generateDTO(context);

  if (context.resourceConfig.enableCustonValidation) {
    await generateValidatorDTO(context);
  }

  if (config.type === 'dto') await saveDTOConfig(config, basePath);

  if (context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
    if (
      context.resourceConfig.type === 'command' ||
      context.resourceConfig.type === 'event' ||
      context.resourceConfig.type === 'query'
    ) {
      await generateHandlers(context);
      await generateTestHandlers(context);
    }
  }
};

/**
 * Generates and saves a response to the API.
 * This function creates a response based on the provided configuration and saves it to the specified API base path.
 *
 * @param {ResponseConfig} dirty - Response configuration object, which includes the name and other details of the response.
 * @param {string} basePath - Application base path where the response will be saved and generated to the API.
 *
 * @throws {Error} Will throw an error if the response configuration is invalid or the response name is missing.
 * @throws {Error} Will throw an error if the base path is not provided.
 *
 * @example
 * // Example usage:
 * import { addResponse } from "spring-engine";
 * import { ResponseConfig } from "spring-engine/dist/interfaces/types";
 * const config: ResponseConfig = {
 *   template: 'record',
 *   statusCode: '200',
 *   module: 'core',
 *   name: 'NewResponse',
 *   description: 'OK',
 *   content: {
 *     'application/json': {
 *       schema: {
 *         type: 'object',
 *         properties: {
 *           newField1: {
 *             type: 'string',
 *             description: 'New field 1',
 *             example: 'newValue1',
 *             default: 'newValue'
 *           }
 *         }
 *       }
 *     }
 *   }
 * };
 * const basePath = 'C://your_project_path';
 *
 * const createResponse = async () => {
 *   try {
 *     await addResponse(config, basePath);
 *   } catch (error) {
 *     console.error(error);
 *   }
 * };
 */
export const addResponse = async (dirty: ResponseConfig, basePath: string) => {
  /**
   * the cleaner function removes all null or empty attributes from the json to avoid error in ajv validation
   */
  const config: ResponseConfig = cleaner(dirty);

  // this function check is the request params in actions have duplicated names
  checkDuplicated(
    [],
    [],
    [],
    [],
    config.content['application/json'] ?? config.content['multipart/form-data'],
  );

  const valid = validateResponse(config);

  if (!valid && validateResponse.errors) {
    throw validateResponse.errors;
  }

  if (!basePath) throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;

  config.name = capitalize(config.name ?? '');

  const baseConfig = await getBaseApiConfig(basePath);

  const context: RenderContext<ResponseConfig> = {
    resourceConfig: config,
    basePath,
    baseConfig,
    fullPath: basePath,
  };

  await generateSingleResponse(context);

  await saveResponseConfig(config, basePath);
};

/**
 * Generates and saves an enumerated class to the API.
 * This function creates an enum based on the provided configuration and saves it to the specified API base path.
 *
 * @param {EnumConfig} config - Enum configuration object, which includes the values and other details of the enum.
 * @param {string} basePath - Application base path where the enum will be saved and generated to the API.
 *
 * @throws {Error} Will throw an error if the enum configuration is invalid or the enum name is missing.
 * @throws {Error} Will throw an error if the base path is not provided.
 *
 * @example
 * // Example usage:
 * import { addEnum } from "spring-engine";
 * import { EnumConfig } from "spring-engine/dist/interfaces/types";
 * const levelConfig: EnumConfig = {
 *   type: 'enum',
 *   name: 'Level',
 *   module: 'core',
 *   values: [
 *     { name: 'HIGH', attributes: ['1', 'High'] },
 *     { name: 'LOW', attributes: ['0', 'Low'] }
 *   ],
 *   attributes: [{ name: 'code', type: 'string' }, { name: 'description', type: 'string' }]
 * };
 * const basePath = 'C://your_project_path';
 *
 * const createEnum = async () => {
 *   try {
 *     await addEnum(config, basePath);
 *   } catch (error) {
 *     console.error(error);
 *   }
 * };
 */
export const addEnum = async (config: EnumConfig, basePath: string) => {
  /**
   * the cleaner function removes all null or empty attributes from the json to avoid error in ajv validation
   */
  //const config: EnumConfig = cleaner(dirty);

  // this function check is the values or attributes have duplicated names
  checkDuplicated(config.attributes, [], [], config.values);

  const valid = enumValidation(config);

  if (!valid && enumValidation.errors) {
    throw enumValidation.errors;
  }

  if (!basePath) throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;

  config.name = capitalize(config.name);
  const baseConfig = await getBaseApiConfig(basePath);

  config = await verifyEnumAttributes(config);

  const context: RenderContext<EnumConfig> = {
    resourceConfig: config,
    basePath,
    baseConfig,
    fullPath: basePath,
  };

  await generateEnum(context);

  // [22-01-2025] No need to save enum config; [04-02-2025] Enum config is necessary for attribute setting
  await saveEnumConfig(config, basePath);
};

/**
 * Deletes an element from the API.
 *
 * This function removes an element configuration and its files based on the provided configuration.
 * It ensures that the element is properly deleted from the specified API base path.
 *
 * @param {DeleteConfig} config - The deletion configuration object, which primarily includes the type, module (if present) and name of the element to be deleted.
 * @param {string} basePath - The base path of the application where the element and repository are located.
 *
 * @throws {Error} Will throw an error if the deletion configuration is invalid.
 * @throws {Error} Will throw an error if the base path is not provided.
 * @throws {Error} Will throw an error the element is being used in other JSON configuration.
 * @example
 * // Example usage:
 * import { deleteElement } from "spring-engine";
 * import { DeleteConfig } from "spring-engine/dist/interfaces/types";

 * const config: DeleteConfig = {
 *   name: 'MyDTO',
 *   type: 'dto',
 *   module: 'core'
 * };
 * const basePath = 'C://your_project_path';
 *
 * const removeElement = async () => {
 *   try {
 *     await deleteElement(config, basePath);
 *   } catch (error) {
 *     console.error(error);
 *   }
 * };
 *
 */
export const deleteElement = async (config: DeleteConfig, basePath: string) => {
  const valid = deleteValidation(config);

  if (!valid && deleteValidation.errors) {
    throw deleteValidation.errors;
  }

  if (!basePath) throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;

  const baseConfig = await getBaseApiConfig(basePath);
  config.name = capitalize(config.name);

  const context: RenderContext<DeleteConfig> = {
    resourceConfig: config,
    basePath,
    baseConfig,
    fullPath: basePath,
  };

  await deleteElementConfig(context, false);
};

/**
 * Moves an element from the API.
 *
 * This function removes an element configuration and its files based on the provided configuration.
 * It ensures that the element is properly moved from the specified API base path.
 *
 * @param {MoveConfig} config - The deletion configuration object, which primarily includes the type, module (if present) and name of the element to be moved.
 * @param {string} basePath - The base path of the application where the element and repository are located.
 *
 * @throws {Error} Will throw an error if the moving configuration is invalid.
 * @throws {Error} Will throw an error if the base path is not provided.
 * @throws {Error} Will throw an error the element is being used in other JSON configuration.
 * @example
 * // Example usage:
 * import { moveElement } from "spring-engine";
 * import { MoveConfig } from "spring-engine/dist/interfaces/types";

 * const config: MoveConfig = {
 *   name: 'MyDTO',
 *   type: 'dto',
 *   sourceModule: 'core'
 *   destinationModule: 'shared'
 * };
 * const basePath = 'C://your_project_path';
 *
 * const move = async () => {
 *   try {
 *     await moveElement(config, basePath);
 *   } catch (error) {
 *     console.error(error);
 *   }
 * };
 *
 */
export const moveElement = async (config: MoveConfig, basePath: string) => {
  const valid = moveValidation(config);

  if (!valid && moveValidation.errors) {
    throw moveValidation.errors;
  }

  if (!basePath) throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;

  const baseConfig = await getBaseApiConfig(basePath);
  config.name = capitalize(config.name);

  const context: RenderContext<MoveConfig> = {
    resourceConfig: config,
    basePath,
    baseConfig,
    fullPath: basePath,
  };

  await moveElementConfig(context, false);
};

/**
 * Loads the DTO configuration for a given module and action.
 *
 * This function attempts to retrieve the DTO configuration based on the provided module name,
 * controller context, and action. If the module-specific configuration is not found, it falls
 * back to the shared configuration.
 *
 * @param {string} module - The name of the module for which the DTO configuration is requested.
 * @param {RenderContext<ControllerConfig>} context - The rendering context containing base path details.
 * @param {ControllerAction} act - The controller action, used to determine the request body schema type.
 * @returns {Promise<DTOConfig>} A promise resolving to the DTO configuration.
 */
async function requestDtoConfig(
  module: string,
  context: RenderContext<ControllerConfig>,
  act: ControllerAction,
): Promise<DTOConfig> {
  try {
    return await loadDTOConfig(
      'dto',
      path.join(context.basePath, replaceTemplate(DIRECTORIES.CONFIG_DTO, { module })),
      capitalize(
        act?.requestBody?.content['application/json']?.schema.type ??
        act?.requestBody?.content['multipart/form-data'].schema.type ??
        '',
      ).replace(/dto$/i, ''),
    );
  } catch (e) {
    module = DIRECTORIES.SHARED;
    return await loadDTOConfig(
      'dto',
      path.join(context.basePath, replaceTemplate(DIRECTORIES.CONFIG_DTO, { module })),
      capitalize(
        act?.requestBody?.content['application/json']?.schema.type ??
        act?.requestBody?.content['multipart/form-data'].schema.type ??
        '',
      ).replace(/dto$/i, ''),
    );
  }
}

/**
 * Generates and saves a controller in the API.
 *
 * This function creates a controller based on the provided configuration and integrates it into the specified API base path.
 * It also generates the corresponding service interface for the controller actions defined.
 *
 * @param {ControllerConfig} dirty - The controller configuration object, including the controller name, base path, and actions.
 * @param {string} basePath - The base path of the application where the controller will be generated and saved.
 * @param {boolean} customImpl - The boolean to set if must generate an implementation service.
 *
 * @throws {Error} Throws an error if the controller configuration is invalid or if the base path is not provided.
 *
 * @example
 * // Example usage:
 * const config: ControllerConfig = {
 *   type: 'controller',
 *   name: 'User',
 *   basePath: 'users',
 *   actions: [
 *     {
 *       actionName: 'getUserById',
 *       path: 'get-user',
 *       method: 'GET',
 *       pathVariables: [
 *         {
 *           type: 'string',
 *           name: 'id',
 *           isRequired: true
 *         },
 *       ],
 *       responses: {
 *         '200': {
 *           name: 'UserResponse',
 *           content: {
 *             'application/json': {
 *               schema: {
 *                 type: 'object',
 *                 properties: {
 *                   id: {
 *                     type: 'string',
 *                     description: 'Unique ID of the user',
 *                   },
 *                   username: {
 *                     type: 'string',
 *                     description: 'Username of the user',
 *                   },
 *                   email: {
 *                     type: 'string',
 *                     description: 'Email address of the user',
 *                   },
 *                 },
 *               },
 *             },
 *           },
 *         },
 *         '404': {
 *           name: 'UserNotFound',
 *           content: {
 *             'application/json': {
 *               schema: {
 *                 type: 'object',
 *                 properties: {
 *                   message: {
 *                     type: 'string',
 *                     description: 'Error message indicating user not found',
 *                   },
 *                 },
 *               },
 *             },
 *           },
 *         },
 *       },
 *     },
 *     {
 *       actionName: 'createUser',
 *       path: 'create-user',
 *       method: 'POST',
 *       requestBody: {
 *         content: {
 *           'application/json': {
 *             schema: {
 *               type: 'object',
 *               properties: {
 *                 username: {
 *                   type: 'string',
 *                   description: 'Username of the new user',
 *                   required: true
 *                 },
 *                 email: {
 *                   type: 'string',
 *                   description: 'Email address of the new user',
 *                   required: true
 *                 },
 *                 password: {
 *                   type: 'string',
 *                   description: 'Password for the new user',
 *                   required: true
 *                 },
 *               },
 *             },
 *           },
 *         },
 *       },
 *       responses: {
 *         '201': {
 *           name: 'UserCreatedResponse',
 *           content: {
 *             'application/json': {
 *               schema: {
 *                 type: 'object',
 *                 properties: {
 *                   id: {
 *                     type: 'string',
 *                     description: 'Unique ID of the created user',
 *                   },
 *                   username: {
 *                     type: 'string',
 *                     description: 'Username of the created user',
 *                   },
 *                   email: {
 *                     type: 'string',
 *                     description: 'Email of the created user',
 *                   },
 *                 },
 *               },
 *             },
 *           },
 *         },
 *       },
 *     },
 *     {
 *       actionName: 'updateUser',
 *       path: 'update-user',
 *       method: 'PUT',
 *       requestBody: {
 *         content: {
 *           'application/json': {
 *             schema: {
 *               type: 'UserDTO',
 *               objectType: 'dto'
 *             },
 *           },
 *         },
 *       },
 *       responses: {
 *         '201': {
 *           name: 'UserUpdatedResponse',
 *           content: {
 *             'application/json': {
 *               schema: {
 *                 type: 'object',
 *                 properties: {
 *                   username: {
 *                     type: 'string',
 *                     description: 'Username of the updated user',
 *                   },
 *                   email: {
 *                     type: 'string',
 *                     description: 'Email of the updated user',
 *                   },
 *                 },
 *               },
 *             },
 *           },
 *         },
 *       },
 *     },
 *     {
 *       actionName: 'deleteUser',
 *       path: 'delete-user',
 *       method: 'DELETE',
 *       pathVariables: [
 *         {
 *           type: 'string',
 *           name: 'id',
 *           isRequired: true,
 *         },
 *       ],
 *       responses: {
 *         '200': {
 *           name: 'UserDeleted',
 *           content: {
 *             'application/json': {
 *               schema: {
 *                 type: 'object',
 *                 properties: {
 *                   deleted: {
 *                     type: 'boolean',
 *                     description: 'Boolean value to confirm the deletion',
 *                   },
 *                 },
 *               },
 *             }
 *           },
 *         },
 *         '404': {
 *           name: 'UserNotFound',
 *           content: {
 *             'application/json': {
 *               schema: {
 *                 type: 'object',
 *                 properties: {
 *                   message: {
 *                     type: 'string',
 *                     description: 'Error message indicating user not found',
 *                   },
 *                 },
 *               },
 *             },
 *           },
 *         },
 *       },
 *     },
 *   ],
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
export const addController = async (
  dirty: ControllerConfig,
  basePath: string,
  customImpl?: boolean,
) => {
  /**
   * the cleaner function removes all null or empty attributes from the json to avoid error in ajv validation
   */
  const config: ControllerConfig = cleaner(dirty);

  // this function check is the request params in actions have duplicateds names
  checkDuplicated([], config.actions, []);

  //config.actions = upperCaseResponse(config.actions);

  //console.log('DADOS A SEREM VALIDADOS:', JSON.stringify(config, null, 2));

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
    fullPath: basePath,
  };

  await generateController(context);

  //const requestConfig = await generateRequest(context);

  const requestConfigMap = await generateRequest(context);

  await generateResponses(context);

  if (context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
    const module = context.resourceConfig.module?.toLowerCase() ?? DIRECTORIES.SHARED;

    for (const act of config.actions) {
      const content = act?.requestBody?.content;
      const schema =
        content?.['application/json']?.schema ?? content?.['multipart/form-data']?.schema;

      const objectType = schema?.objectType;
      const collectionType = schema?.collectionType ?? 'none';

      const type = schema?.type ?? '';

      let requestBodyAttributes: JavaAttribute[] = [];

      if (objectType) {

        const dto = await requestDtoConfig(module, context, act);
        requestBodyAttributes = [
          {
            name: dto.name.toLowerCase(),
            type: normalizeName(dto.name, 'dto') + 'DTO',
            objectType: 'dto',
            module: dto.module ?? DIRECTORIES.SHARED,
            required: false,
            collectionType,
          },
        ];
      } else if (requestConfigMap) {
        const actionName = act.actionName;
        const resource = requestConfigMap.get(actionName)?.resourceConfig;
        if (resource) {
          requestBodyAttributes = [
            {
              name: resource.name,
              type: 'object',
              objectType: 'dto',
              module: resource.module ?? DIRECTORIES.SHARED,
              required: false,
              collectionType,
            },
          ];
        }
      }

      const modelAttribute: JavaAttribute[] = act?.modelAttribute
        ? [
          {
            name: act.modelAttribute.name.toLowerCase(),
            type: normalizeName(act.modelAttribute.name, 'dto') + 'DTO',
            objectType: 'dto',
            required: false,
            module: act.modelAttribute.module,
          },
        ]
        : [];

      const pathVariables = act?.pathVariables
        ? act.pathVariables.map((e) => ({
          name: e.name,
          type: e.type,
          objectType: 'java',
          required: true,
        }))
        : [];

      const requestParams = act?.requestParams
        ? act.requestParams.map((e) => ({
          name: e.name,
          type: e.type as 'long' | 'string' | 'integer' | 'boolean' | 'object',
          objectType: 'java',
          required: true,
        }))
        : [];

      if (schema && type !== 'object' && !objectType) {
        requestBodyAttributes = [
          {
            name: act.actionName.concat('Request'),
            type: type,
            objectType: 'java',
            required: false,
            module: act.modelAttribute?.module,
            collectionType,
          },
        ];
      }

      let pageable: any[] = [];
      if (act.responses) {
        if (isPageable(act.responses))
          pageable = [
            {
              name: 'pageable',
              type: 'pageable',
              objectType: 'java',
              required: true,
            },
          ];
      }

      const attributes = [
        ...requestBodyAttributes,
        ...modelAttribute,
        ...requestParams,
        ...pathVariables,
        ...pageable,
      ];

      await addDTO(
        {
          type: act.method === 'GET' ? 'query' : 'command',
          name: act.actionName,
          template: 'classic',
          module,
          attributes:
            attributes.length > 0
              ? attributes
              : [{ name: 'none', type: 'object', objectType: 'java', required: false }],
          response: act.responses,
        } as HandlerConfig,
        context.basePath,
      );
    }
  } else {
    await generateServiceInterface(context);

    if (!customImpl) {
      await generateServiceInmpl(context);
    }

    await generateTestServiceInmpl(context);
  }
};

export const addCrudController = async (dirty: CrudControllerConfig, basePath: string) => {
  /**
   * the cleaner function removes all null or empty attributes from the json to avoid error in ajv validation
   */
  const config: CrudControllerConfig = cleaner(dirty);

  // this function check is the models and its fields have duplicateds names
  checkDuplicated([], [], [], [], undefined, config.models);

  //config.actions = upperCaseResponse(config.actions);

  /*const isConfigValid = validateCrudController(config);
 
  if (!isConfigValid && validateCrudController.errors) {
    throw validateController.errors;
  }*/

  if (!basePath) {
    throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;
  }

  config.name = capitalize(config.name);

  await generateCrudController(config, basePath);
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


export async function addPermissionConfig(
    basePath: string,
    groupConfig: GroupPermissionDef,
    moduleName?: string
): Promise<void> {


  if (!basePath) throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;

  groupConfig.name = capitalize(groupConfig.name);
  const baseConfig = await getBaseApiConfig(basePath);

  groupConfig.module = moduleName ? moduleName : DIRECTORIES.SHARED;

  const context: RenderContext<GroupPermissionDef> = {
    resourceConfig: groupConfig,
    basePath,
    baseConfig,
    fullPath: basePath,
  };

  await saveGroupPermissionDef(context);
}


export async function loadConfigs(basePath: string, moduleName?: string): Promise<AppExportsConfig> {

  const baseConfig = await getBaseApiConfig(basePath);
  //console.log('baseConfig:', baseConfig);
  const { group, packageName } = baseConfig;

  //console.log('group:', group);
  //console.log('packageName:', packageName);

  const mainPath = getMainPath(group, packageName);
  //console.log('mainPath:', mainPath);

  const permissionDir = path.join(
      basePath,
      mainPath,
      moduleName ? moduleName : DIRECTORIES.SHARED,
      DIRECTORIES.INFRASTRUCTURE,
      DIRECTORIES.AUTHORIZATION,
      DIRECTORIES.PERMISSION
  );

  //console.log('mainPath:', mainPath);

  //console.log('permissionDir:', permissionDir);

  if (!(await fs.pathExists(permissionDir))) {
    return { permissionGroups: [] };
  }

  const files = (await fs.readdir(permissionDir)).filter((f) => f.endsWith('.java'));

  // extrair permissões
  const groups: GroupPermissionDef[] = [];
  for (const file of files) {
    const fullPath = path.join(permissionDir, file);
    const group = await buildPermissionGroup(fullPath);
    if (group) groups.push(group);
  }
  return { permissionGroups: groups };
}

/**
 * Main Function that creates the module
 *
 * This function creates a module based on the provided configuration and saves it to the specified API base path.
 *
 * @param {SerializationConfig} dirty - The configuration object containing all the basic module information.
 * @param {string} basePath - The output path where the module will be created
 * @throws {Error} Will throw an error if the module configuration is invalid.
 *
 * @example
 * Example usage:
 * import { addModule } from "spring-engine";
 * import { ModuleConfig } from "spring-engine/dist/interfaces/types";
 *
 * const config: ModuleConfig = {
 *   type: 'module',
 *   name: 'external',
 * };
 *
 * const basePath: 'C://your_path';
 *
 * const createModule = async () => {
 *    try {
 *      await addModule(config, basePath)
 *    }
 *    catch(error) {
 *      console.log(error)
 *    }
 * }
 *
 */
export const serializeElement = async (
  dirty: JsonConfig | XmlConfig | SqlConfig | DdlConfig,
  basePath: string,
) => {
  const config = cleaner(dirty);
  const valid = serializationValidation(config);

  if (!valid && serializationValidation.errors) throw serializationValidation.errors;

  if (!basePath) {
    throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;
  }

  const data = await serializeData(config);

  if (!data)
    throw Error(
      'Invalid data configuration. Supported serializations are JSON, XML and SQL commands',
    );

  switch (config.type) {
    case 'dto':
      await addDTO(data as DTOConfig, basePath);
      break;
    case 'model':
      await addModel(data as ModelConfig, basePath);
      break;
    case 'response':
      await addResponse(data as ResponseConfig, basePath);
      break;
    default:
      throw Error(
        "Invalid type for serialization configuration. Supported types are 'dto', 'model' and 'response'",
      );
  }
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
  const schemaTypes = [...SCHEMA_TYPES];

  const bodyDtos = [...dtos, ...dtos.map((dto) => `List<${dto}>`)];

  let bodyRequests = ['Object', ...dtos];

  let paramsTypes = [...PARAMS_TYPES, ...dtos];

  return [
    { MYME_TYPES: MIME_TYPES },
    { BODY_REQUEST: bodyRequests },
    { PARAMS_TYPES: paramsTypes },
    { METHODS: HTTP_METHOD_TYPES },
    { REQUEST_PARAMS: PARAMS_TYPES },
    { DATABASE_TYPES: DATABASE_TYPES },
    { SCHEMA_TYPES: schemaTypes },
    { DTO_SCHEMAS: bodyDtos },
    { ATTRIBUTE_TYPES: CATEGORIZED_ATTRIBUTE_TYPES },
    { HTTP_HEADER_TYPES: HTTP_HEADER_TYPES },
    { COLLECTION_TYPES: GENERIC_COLLECTION_TYPES },
    { RELATIONSHIP_TYPES: RELATIONSHIP_TYPES },
    { CRUD_DISABLED_OPTIONS: CRUD_DISABLED_OPTIONS },
    { GENERATION_TYPES: GENERATION_TYPES.filter((gt) => gt !== '') },
  ];
};
