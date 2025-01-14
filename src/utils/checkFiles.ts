import fs from 'fs-extra';
import { ApiConfig, ModelConfig, ControllerConfig } from '../interfaces/types';

export const isApiConfig = (
  config: ApiConfig | ModelConfig | ControllerConfig,
): config is ApiConfig => config?.type === 'springboot';

export const isModelConfig = (
  config: ApiConfig | ModelConfig | ControllerConfig,
): config is ModelConfig => config?.type === 'model';

export const isControllerConfig = (
  config: ApiConfig | ModelConfig | ControllerConfig,
): config is ControllerConfig => config?.type === 'controller';

export const isFile = async (filePath: string) => (await fs.stat(filePath)).isFile();

export const checkIfDirectoryIsEmpty = async (directoryPath: string) =>
  (await fs.readdir(directoryPath)).length === 0;

export const checkIfDirectoryExists = async (directoryPath: string): Promise<boolean> => {
  return fs.existsSync(directoryPath);
};
