import path from 'path';
import fs from 'fs-extra';
import { readJsonFile } from './utils/readJsonFiles';
import { ApiConfig, ModelConfig } from './interfaces/types';
import { checkIfDirectoryIsEmpty } from './utils/checkFiles';
import { createAppDir } from './modules/createAppDirectories';
import { generateModel } from './modules/generateModelResources';
import { DIRECTORIES, ERROR_MESSAGE, EXTENSIONS } from './utils/constants';

export const apiSetup = async (config: ApiConfig, outputPath: string) => {
  if (!config || !config.apiName || !config.group || !config.artifact) {
    throw ERROR_MESSAGE.INVALID_API_CONFIG;
  }

  if (!(await checkIfDirectoryIsEmpty(outputPath))) {
    throw ERROR_MESSAGE.DIRECTORY_ALREADY_IN_USE;
  }

  await createAppDir(config, outputPath);
};

export const modelSetUp = async (outputPath: string) => {
  const igrpstudioModelsPath = path.join(outputPath, DIRECTORIES.IGRPSTUDIO, DIRECTORIES.MODELS);

  const files = await fs.readdir(igrpstudioModelsPath);
  const jsonFiles = files.filter((file) => path.extname(file) === EXTENSIONS.JSON);

  for (const file of jsonFiles) {
    const filePath = path.join(igrpstudioModelsPath, file);
    const model: ModelConfig = await readJsonFile(filePath);
    generateModel(model, outputPath);
  }
};
