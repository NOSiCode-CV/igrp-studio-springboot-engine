import fs from 'fs-extra';
import { ModelConfig } from '../../interfaces/types';
import { getModelConfigPath, getPackage } from '../../utils/helpers';
import { saveToFile } from '../common/saveToFile';
import {  ERROR_MESSAGE } from '../../utils/constants';


/**
 * Generates and saves the configuration file of a model.
 * @param config - Model configuration.
 * @param outputDir - Output directory where the model configuration file will be saved.
 * @throws Throws an error if the model configuration or output directory is invalid.
 */
export const saveModelConfig = async (config: ModelConfig, outputDir: string) => {
  if (!config) {
    throw ERROR_MESSAGE.MODEL_REQUIRED;
  }

  if (!outputDir || !(await fs.pathExists(outputDir))) {
    throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;
  }

  const output = getModelConfigPath(config.name, outputDir);
  await saveToFile(JSON.stringify(config), output);
};


