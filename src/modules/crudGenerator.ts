import { ModelConfig } from '../interfaces/types';
import { ERROR_MESSAGE } from '../utils/constants';
import { repository } from './repositoryGenerator';
import { saveModelFile } from './saveModelFile';

export const crudGenerator = async (config: ModelConfig, output: string) => {

  if (!config || !config.crud) {
    throw ERROR_MESSAGE.INVALID_MODEL_CONFIG
  };

  if (!output) {
    throw ERROR_MESSAGE.INVALID_OUTPUT_PATH
  };
  
  await saveModelFile(config, output);

  await repository(config, output);
};
