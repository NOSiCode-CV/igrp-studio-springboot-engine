import { ModelConfig } from './interfaces/types';
import { ERROR_MESSAGE } from './utils/constants';
import { updateModel } from './updateModel';

export const addCrud = async (model: ModelConfig, output: string) => {
  if (!model) throw ERROR_MESSAGE.MODEL_REQUIRED;

  if (!model.crud) throw ERROR_MESSAGE.INVALID_MODEL_CONFIG

  if (!output) throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;

  await updateModel(model, output);
 
};
