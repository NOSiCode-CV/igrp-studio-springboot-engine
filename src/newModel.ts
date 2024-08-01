import path from 'path';
import { ModelConfig } from './interfaces/types';
import { readJsonFile } from './utils/readJsonFiles';
import { modelGenerator } from './modules/modelResourcesGenerator';
import { DIRECTORIES, ERROR_MESSAGE, EXTENSIONS } from './utils/constants';
import { saveModelFile } from './modules/saveModelFile';

export const newModel = async (config: ModelConfig, output: string) => {
  if (!config || !config.name) {
    throw ERROR_MESSAGE.INVALID_MODEL_CONFIG;
  }

  if (!output) {
    throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;
  }

  /**
   * Save de model configuration json file in the .igrpstudio/model directory
   */
  await saveModelFile(config, output);

  const file = generatedModelFilePath(output, config.name);
  const model: ModelConfig = await readJsonFile(file);

  /**
   * Save the model in the generated api
   */
  await modelGenerator(model, output);
};


const generatedModelFilePath = (output: string, modelName: string): string => {
  return path.join(
    output,
    DIRECTORIES.IGRPSTUDIO,
    DIRECTORIES.MODELS,
    `${modelName}${EXTENSIONS.JSON}`,
  );
};
