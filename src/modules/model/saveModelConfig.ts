import { saveToFile } from '../common/saveToFile';
import { ModelConfig } from '../../interfaces/types';
import { ERROR_MESSAGE } from '../../utils/constants';
import { getModelConfigPath } from '../../utils/helpers';

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
  
  if (config.primaryKey.length === 0) {
    throw `The model '${config.name}' must have at least one primary key`
  }

  const output = getModelConfigPath(config.name, basePath);
  await saveToFile(JSON.stringify(config), output);
};