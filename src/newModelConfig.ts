import path from 'path';
import fs from 'fs-extra';
import { ModelConfig } from './interfaces/types';
import { getModelConfigPath } from './utils/helpers';
import { saveToFile } from './modules/common/saveToFile';
import { DIRECTORIES, ERROR_MESSAGE } from './utils/constants';
import { modelConfigGenerator } from './modules/model/modelConfigGenerator';


/**
 * Generates and saves the configuration file of a model.
 * @param {ModelConfig} config - Model configuration.
 * @param {string} outputDir - Output directory where the model configuration file will be saved.
 * @throws {Error} - Throws an error if the model configuration or output directory is invalid.
 */
export const newModelConfig = async (config: ModelConfig, outputDir: string) => {
  if (!config) {
    throw ERROR_MESSAGE.MODEL_REQUIRED;
  }

  if (!outputDir || !(await fs.pathExists(outputDir))) {
    throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;
  }

  try {
    const baseApiPath = path.join(outputDir, DIRECTORIES.BASE_API);
    
    if (!(await fs.pathExists(baseApiPath))){
      throw ERROR_MESSAGE.BASE_API_NOT_FOUND;
    }

    const baseApi = await fs.readJSON(baseApiPath);
    const { group, artifact } = baseApi;

    if (!group || !artifact) {
      throw ERROR_MESSAGE.INVALID_API_CONFIG;
    }

    config.package = `${group}.${artifact}`
    
  } catch (error) {
    throw error;
  }

  const output = getModelConfigPath(config.name, outputDir);
  const model = await modelConfigGenerator(config);

  await saveToFile(model, output);
};
