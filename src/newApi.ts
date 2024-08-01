import { ApiConfig } from './interfaces/types';
import { saveFiles } from './modules/saveFile';
import { ERROR_MESSAGE } from './utils/constants';
import { checkIfDirectoryIsEmpty } from './utils/checkFiles';
import { createAppDirectories } from './modules/createAppDirectories';

export const newApi = async (config: ApiConfig, output: string) => {
  if(!config) {
    throw ERROR_MESSAGE.INVALID_API_CONFIG
  }
  
  if (!(await checkIfDirectoryIsEmpty(output))) {
    throw ERROR_MESSAGE.DIRECTORY_ALREADY_IN_USE;
  }
  

  /**
   * Creates the folder structure needed for the API.
   */
  await createAppDirectories(config, output);

  /**
   * With the base config sent to the newAPI, this function should create the following:
   *  - Base config files (pom.xml, mvnw, application.properties, etc.)
   *  - .igrpstudio config files (baseApi.json)
   *  - Application bootstrapping files ([API_NAME]Application.java)
   */
  await saveFiles(config, output);
};