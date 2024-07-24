import { ApiConfig, ModelConfig } from '../interfaces/types';
import { saveFileConfig } from './saveFile';

export const createFile = async (fileconfig: ApiConfig | ModelConfig) => {
  try {
    const res = await saveFileConfig(fileconfig)
    return res
  } catch (error) {
    
  }
}

