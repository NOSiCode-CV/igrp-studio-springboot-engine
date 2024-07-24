import { ApiConfig } from './interfaces/types';
import { ERROR_MESSAGE, OUTPUT_DIR } from './utils/constants';
import { checkIfDirectoryIsEmpty } from './utils/checkFileType';
import { createAppDir } from './modules/createAppDirectories';

export const apiSetup = async (config: ApiConfig, outputPath: string) => {
  if (!config || !config.apiName || !config.group || !config.artifact) {
    throw ERROR_MESSAGE.INVALID_API_CONFIG;
  }

  if (!(await checkIfDirectoryIsEmpty(outputPath))) {
    throw ERROR_MESSAGE.DIRECTORY_ALREADY_IN_USE;
  }

  await createAppDir(config, outputPath);
};


