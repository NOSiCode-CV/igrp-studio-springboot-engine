import { isApiConfig, isModelConfig, isControllerConfig } from '../utils/checkFileType';
import { ApiConfig, ControllerConfig, ModelConfig } from '../interfaces/types';
import { saveFileConfig } from './saveBaseApiFiles';


export const saveFiles = async (config: ApiConfig | ModelConfig | ControllerConfig, outputDir: string) => {
  if (isApiConfig(config)) {
    await saveFileConfig(config, outputDir)
  }

  if (isModelConfig(config)) {
    
  }

  if (isControllerConfig(config)) {}

};
