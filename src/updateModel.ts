import { addCrud } from './addCrud';
import { ModelConfig } from './interfaces/types';
import { ERROR_MESSAGE } from './utils/constants';
import { newModelConfig } from './newModelConfig';
import { modelResourceGenerator } from './newModelResources';

export const updateModel = async (model: ModelConfig, output: string) => {
  if (!model) throw ERROR_MESSAGE.MODEL_REQUIRED;

  if (!output) throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;

  /**
   * first update (overwriting) the model configuration json file in the .igrpstudio/model directory
   */
  await newModelConfig(model, output);

  /**
   * and update (overwriting) the model in the api
   */
  await modelResourceGenerator(model, output);

};
