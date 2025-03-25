import { saveToFile } from '../common/saveToFile';
import { ModelConfig } from '../../interfaces/types';
import { DIRECTORIES, ERROR_MESSAGE, EXTENSIONS } from '../../utils/constants';
import { getModelConfigPath } from '../../utils/helpers';
import { capitalizeJavaStyle } from '../../helper/stringHelper';

/**
 * Generates and saves the configuration file of a model.
 * @param config - Model configuration.
 * @param basePath - Output directory where the model configuration file will be saved.
 * @throws Throws an error if the model configuration or output directory is invalid.
 */
export const saveModelConfig = async (config: ModelConfig, basePath: string) => {
  
  if (config.attributes.length === 0) {
    throw ERROR_MESSAGE.EMPTY_ATTRIBUTE;
  }

  const fileName = capitalizeJavaStyle(config.name);
  const output = getModelConfigPath(config.module ?? DIRECTORIES.SHARED, fileName, basePath);
  await saveToFile(JSON.stringify(config), output, true, DIRECTORIES.CONFIG_MODEL, config.id, config.module, basePath, EXTENSIONS.JSON);
};