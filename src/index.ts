import { ModelConfig } from './interfaces/types';
import { ERROR_MESSAGE } from './utils/constants';
import { apiValidation } from './schema/apiConfig';
import { validateModelConfig } from './schema/modelConfig';
import { checkIfDirectoryIsEmpty } from './utils/checkFiles';
import { generateModel } from './modules/model/generateModel';
import { validateController } from './schema/controllerConfig';
import { deleteModelConfig } from './modules/model/deleteModel';
import { saveModelConfig } from './modules/model/saveModelConfig';
import { saveFileConfig } from './modules/baseApi/saveBaseApiFiles';
import { getBaseApiConfig } from './modules/common/getBaseApiConfig';
import { generateRepository } from './modules/model/generateRepository';
import { saveBaseApiFileConfig } from './modules/baseApi/saveBaseApiConfig';
import { generateController } from './modules/controller/generateController';
import { createAppDirectories } from './modules/baseApi/createAppDirectories';
import { ApiConfig, ControllerConfig, RenderContext } from './interfaces/types';
import { saveControllerConfig } from './modules/controller/saveControllerConfig';
import { generateServiceInterface } from './modules/controller/generateServiceInterface';

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
 *    artifact: 'demo'
 *    database: 'MySQL' //you can choose bettween MySQL and PostgreSQL
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
export const newApi = async (config: ApiConfig, basePath: string) => {
  const valid = apiValidation(config);

  if (!valid && apiValidation.errors) {
    throw ERROR_MESSAGE.INVALID_API_CONFIG;
  }

  if (!(await checkIfDirectoryIsEmpty(basePath))) {
    throw ERROR_MESSAGE.DIRECTORY_ALREADY_IN_USE;
  }

  await saveBaseApiFileConfig(config, basePath);

  const context: RenderContext = {
    resourceConfig: undefined, // On base API, there is no specific config.
    basePath,
    baseConfig: config,
  };

  /**
   * Creates the folder structure needed for the API.
   */
  await createAppDirectories(context);

  /**
   * With the base config sent to the newAPI, this function should create the following:
   *  - Base config files (pom.xml, mvnw, application.properties, etc.)
   *  - .igrpstudio config files (baseApi.json)
   *  - Application bootstrapping files ([API_NAME]Application.java)
   */
  await saveFileConfig(context);
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
*     { type: 'string', name: 'email', unique: true, notNull: true, required: true },
*     { type: 'string', name: 'password', notNull: true, required: true },
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
export const addModel = async (config: ModelConfig, basePath: string) => {
  const valid = validateModelConfig(config);

  if (!valid && validateModelConfig.errors) throw ERROR_MESSAGE.INVALID_MODEL_CONFIG;

  if (!basePath) throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;

  const baseConfig = await getBaseApiConfig(basePath);
  await saveModelConfig(config, basePath);

  const context: RenderContext<ModelConfig> = {
    resourceConfig: config,
    basePath,
    baseConfig,
  };

  await generateModel(context);

  if (config.crud) {
    await generateRepository(context);
  }
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

  if (!valid && validateModelConfig.errors) throw ERROR_MESSAGE.INVALID_MODEL_CONFIG;

  if (!basePath) throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;

  const baseConfig = await getBaseApiConfig(basePath);

  const context: RenderContext<ModelConfig> = {
    resourceConfig: config,
    basePath,
    baseConfig,
  };

  await deleteModelConfig(context)

}

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
export const addController = async (config: ControllerConfig, basePath: string) => {
  const isConfigValid = validateController(config);
  
  if (!isConfigValid || validateController.errors) {
    throw ERROR_MESSAGE.INVALID_CONTROLLER_CONFIG;
  }
  
  if (!basePath) {
    throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;
  }
  
  const baseConfig = await getBaseApiConfig(basePath);
  await saveControllerConfig(config, basePath);
  
  const context: RenderContext<ControllerConfig> = {
    resourceConfig: config,
    basePath,
    baseConfig,
  };
  
  await generateController(context);
  await generateServiceInterface(context);
};
