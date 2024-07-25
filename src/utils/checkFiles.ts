import { ApiConfig, ModelConfig, ControllerConfig } from '../interfaces/types';
import fs from 'fs-extra';

export const isApiConfig = (config: ApiConfig | ModelConfig | ControllerConfig): config is ApiConfig =>
  config?.type === 'baseApi';

export const isModelConfig = (config: ApiConfig | ModelConfig | ControllerConfig): config is ModelConfig =>
  config?.type === 'model';

export const isControllerConfig = (config: ApiConfig | ModelConfig | ControllerConfig): config is ControllerConfig =>
  config?.type === 'controller';

export const isFile = async (filePath: string) => (await fs.stat(filePath)).isFile();

export const checkIfDirectoryIsEmpty = async (directoryPath: string): Promise<boolean> => {
  try {
    const files = await fs.readdir(directoryPath);
    return files.length === 0;
  } catch (error) {
    console.error('Error reading directory contents:', error);
    throw new Error('Error reading directory contents');
  }
}