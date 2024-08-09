import { ApiConfig, RenderContext } from './interfaces/types';
import { ERROR_MESSAGE } from './utils/constants';
import { checkIfDirectoryIsEmpty } from './utils/checkFiles';
import { createAppDirectories } from './modules/baseApi/createAppDirectories';
import { saveFileConfig } from './modules/baseApi/saveBaseApiFiles';
import { saveBaseApiFileConfig } from './modules/baseApi/saveBaseApiConfig';

/**
 * Main Function that creates the base api
 * @param {ApiConfig} config - API base configuration file containning all the basic API information.
 * @param {string} basePath - Output path where directories are created
 */
export const newApi = async (config: ApiConfig, basePath: string) => {
  if (!config) {
    throw new Error(ERROR_MESSAGE.INVALID_API_CONFIG);
  }

  if (!(await checkIfDirectoryIsEmpty(basePath))) {
    throw new Error(ERROR_MESSAGE.DIRECTORY_ALREADY_IN_USE);
  }
  await saveBaseApiFileConfig(config, basePath);

  const context: RenderContext = {
    resourceConfig: undefined, // On base API, there is no specific config.
    basePath,
    baseConfig: config
  }


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
