import { saveModelFiles } from './saveModelFiles';
import { saveFileConfig } from './saveBaseApiFiles';
import { ApiConfig, ControllerConfig, ModelConfig } from '../interfaces/types';
import { isApiConfig, isModelConfig, isControllerConfig } from '../utils/checkFiles';


export const saveFiles = async (config: ApiConfig | ModelConfig | ControllerConfig, outputDir: string) => {
  if (isApiConfig(config)) {
    await saveFileConfig(config, outputDir)
  }

  if (isModelConfig(config)) {
    await saveModelFiles(config, outputDir)
  }

  if (isControllerConfig(config)) {}
};