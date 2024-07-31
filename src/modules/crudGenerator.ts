import { ModelConfig } from '../interfaces/types';
import { saveModelFiles } from './saveModelFiles';
import { repository } from './repositoryGenerator';

export const crudGenerator = async (config: ModelConfig, output: string) => {
  
  await saveModelFiles(config, output);

  await repository(config, output);
};
