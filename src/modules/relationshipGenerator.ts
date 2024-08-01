import { ModelConfig } from '../interfaces/types';
import { updateModel } from './updateModelConfig';
import { ERROR_MESSAGE } from '../utils/constants';
import { modelGenerator } from './modelResourcesGenerator';
import { newModel } from '../newModel';


export const generateRelationship = async (config: ModelConfig, output: string) => {
  if (!config || !config.relations) {
    throw ERROR_MESSAGE.INVALID_MODEL_CONFIG
  }

  if(!output) {
    throw ERROR_MESSAGE.INVALID_OUTPUT_PATH
  }

  /**
   * Overwrite the model configurtion in .igrpstudio directory
   */
  await updateModel(config, output);

  /**
   * update the api model with the relationship
   */
  await modelGenerator(config, output);
  
}

