import { ApiConfig, ModelConfig } from '../interfaces/types';
import fs from 'fs-extra';

export const isApiConfig = (config: ApiConfig | ModelConfig): config is ApiConfig =>
  config?.type === 'baseApi';


export const checkIfDirectoryIsEmpty = async (directoryPath: string): Promise<boolean> => {
  try {
    const files = await fs.readdir(directoryPath);
    return files.length === 0;
  } catch (error) {
    console.error('Error reading directory contents:', error);
    throw new Error('Error reading directory contents');
  }
}