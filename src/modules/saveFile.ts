import { saveModelFiles } from './saveModelFiles';
import { saveFileConfig } from './saveBaseApiFiles';
import { ApiConfig, ControllerConfig, ModelConfig } from '../interfaces/types';
import { isApiConfig, isModelConfig, isControllerConfig } from '../utils/checkFiles';


export const saveFiles = async (config: ApiConfig | ModelConfig | ControllerConfig, output: string) => {
  if (isApiConfig(config)) {
    await saveFileConfig(config, output)
  }

  if (isModelConfig(config)) {
    await saveModelFiles(config, output)
  }

  if (isControllerConfig(config)) {}
};