import { ModelConfig } from '../interfaces/types';
import { saveModelFiles } from './saveModelFiles';
import { repository } from './repositoryGenerator';

export const crudGenerator = async (config: ModelConfig, output: string) => {

    //  Another solution is to consider that this method will be called only in case the model has no crud or you want to update the existing crud.
    // In this case, the configuration of the existing model will always be updated.

    //steps:

    //1- update the existing modelConfig
    await saveModelFiles(config, output);

    //2- call the repository generator
    await repository(config, output);
};
