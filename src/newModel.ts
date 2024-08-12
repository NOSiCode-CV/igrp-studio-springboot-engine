import { ERROR_MESSAGE } from './utils/constants';
import { ModelConfig, RenderContext } from './interfaces/types';
import { saveModelConfig } from './modules/model/saveModelConfig';
import { getBaseApiConfig } from './modules/common/getBaseApiConfig';
import { generateModel } from './modules/model/generateModel';
import { generateRepository } from './modules/model/generateRepository';

/**
* Generates and saves a model to the API.
*
* @param {ModelConfig} config - Model configuration object, which includes the name and other details of the model.
* @param {string} basePath - Application base path where the model will be saved and generated to the API.
* @throws {Error} - Throws an error if the model configuration is invalid or the model name is missing.
*/
export const modelResourceGenerator = async (config: ModelConfig, basePath: string) => {
  if (!config) throw ERROR_MESSAGE.MODEL_REQUIRED;

  if (!config.name) throw ERROR_MESSAGE.INVALID_MODEL_CONFIG;

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
