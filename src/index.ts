import { ApiConfig, ControllerConfig, RenderContext } from './interfaces/types';
import { ERROR_MESSAGE } from './utils/constants';
import { checkIfDirectoryIsEmpty } from './utils/checkFiles';
import { createAppDirectories } from './modules/baseApi/createAppDirectories';
import { saveFileConfig } from './modules/baseApi/saveBaseApiFiles';
import { saveBaseApiFileConfig } from './modules/baseApi/saveBaseApiConfig';
import { apiValidation } from './schema/apiConfig';
import { ModelConfig } from './interfaces/types';
import { saveModelConfig } from './modules/model/saveModelConfig';
import { getBaseApiConfig } from './modules/common/getBaseApiConfig';
import { generateModel } from './modules/model/generateModel';
import { generateRepository } from './modules/model/generateRepository';
import { validateModelConfig } from './schema/modelConfig';
import { saveControllerConfig } from './modules/controller/saveControllerConfig';
import { generateController } from './modules/controller/generateController';
import { generateServiceInterface } from './modules/controller/generateServiceInterface';
import { deleteModelConfig } from './modules/model/deleteModel';
import { validateController } from './schema/controllerConfig';

/**
 * Main Function that creates the base api
 * @param {ApiConfig} config - API base configuration file containning all the basic API information.
 * @param {string} basePath - Output path where the API will be created
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
*
* @param {ModelConfig} config - Model configuration object, which includes the name and other details of the model.
* @param {string} basePath - Application base path where the model will be saved and generated to the API.
* @throws {Error} - Throws an error if the model configuration is invalid or the model name is missing.
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
 * Delete a model and the repository associet
 * 
 * @param config 
 * @param basePath 
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
 * Generate and save the controller in the API
 * 
 * @param config - Controller configuration object, which includes the name and other details of the controller
 * @param basePath - Application base path where the model will be saved and generated to the API.
 */
export const addController = async (config: ControllerConfig, basePath: string) => {
  const isConfigValid = validateController(config)

  if (!isConfigValid || validateController.errors) throw ERROR_MESSAGE.INVALID_CONTROLLER_CONFIG;

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
