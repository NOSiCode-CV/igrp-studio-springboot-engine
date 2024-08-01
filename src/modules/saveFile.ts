import { saveModelFile } from './saveModelFile';
import { ERROR_MESSAGE } from '../utils/constants';
import { saveFileConfig } from './saveBaseApiFiles';
import { ApiConfig, ControllerConfig, ModelConfig } from '../interfaces/types';
import { isApiConfig, isModelConfig, isControllerConfig } from '../utils/checkFiles';


export const saveFiles = async (config: ApiConfig | ModelConfig | ControllerConfig, output: string) => {
  if (!config || !config.type) {
    throw ERROR_MESSAGE.INVALID_API_CONFIG;
  };

  if (!output) {
    throw ERROR_MESSAGE.INVALID_OUTPUT_PATH
  }
  
  if (isApiConfig(config)) {
    await saveFileConfig(config, output)
  };

  if (isModelConfig(config)) {
    await saveModelFile(config, output)
  };

  if (isControllerConfig(config)) {};
};