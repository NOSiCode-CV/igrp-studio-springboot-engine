import { ModelConfig } from './interfaces/types';
import { ERROR_MESSAGE } from './utils/constants';
import { modelResourceGenerator } from './newModelResources';

export const updateModel = async (model: ModelConfig, output: string) => {
  if (!model) throw ERROR_MESSAGE.MODEL_REQUIRED;

  if (!output) throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;

  /**
   * and update (overwriting) the model in the api
   */
  await modelResourceGenerator(model, output);

};
