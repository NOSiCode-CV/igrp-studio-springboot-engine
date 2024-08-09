import { ModelConfig } from '../../interfaces/types';
import { ERROR_MESSAGE } from '../../utils/constants';
import { updateModel } from '../../updateModel';

/**
 * 
 * @param model 
 * @param output 
 */
export const addCrud = async (model: ModelConfig, output: string) => {
  if (!model) throw ERROR_MESSAGE.MODEL_REQUIRED;

  if (!model.crud) throw ERROR_MESSAGE.INVALID_MODEL_CONFIG

  if (!output) throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;

  /**
   * Update 
   * 1- the model file configuration in the .igrpstudio/models dirocteroty
   * 2- the model file in the api/models directory
   */
  await updateModel(model, output);
 
};
