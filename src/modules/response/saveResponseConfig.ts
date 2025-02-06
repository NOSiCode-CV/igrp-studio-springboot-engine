import { saveToFile } from '../common/saveToFile';
import { ResponseConfig } from '../../interfaces/types';
import { DIRECTORIES, ERROR_MESSAGE, EXTENSIONS } from '../../utils/constants';
import { getResponseConfigPath } from '../../utils/helpers';

/**
 * Generates and saves the configuration file of a response.
 * @param config - Response configuration.
 * @param basePath - Output directory where the response configuration file will be saved.
 * @throws Throws an error if the response configuration or output directory is invalid.
 */
export const saveResponseConfig = async (config: ResponseConfig, basePath: string) => {
  
  if (Object.entries(config.content).length === 0) {
    throw ERROR_MESSAGE.EMPTY_ATTRIBUTE;
  }

  const output = getResponseConfigPath(config.module ?? DIRECTORIES.SHARED, normalizeName(config.name), basePath);
  await saveToFile(JSON.stringify(config), output, true, DIRECTORIES.CONFIG_RESPONSE, config.id, config.module, basePath, EXTENSIONS.JSON);

};

export const normalizeName = (name: string): string => name.replace(/dto$/i, "");