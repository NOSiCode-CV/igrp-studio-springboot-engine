import path from 'path';
import fs from 'fs-extra';
import { ModelConfig } from './interfaces/types';
import { readJsonFile } from './utils/readJsonFiles';
import { modelGenerator } from './modules/modelResourcesGenerator';
import { DIRECTORIES, ERROR_MESSAGE, EXTENSIONS } from './utils/constants';

export const modelSetUp = async (output: string) => {
  if(!output) {
    throw ERROR_MESSAGE.INVALID_OUTPUT_PATH
  }

  const igrpstudioModelsPath = path.join(output, DIRECTORIES.IGRPSTUDIO, DIRECTORIES.MODELS);
  const files = await fs.readdir(igrpstudioModelsPath);


  const jsonFiles = files.filter((file) => path.extname(file) === EXTENSIONS.JSON);
  console.log(jsonFiles)

 
  for (const file of jsonFiles) {
    const filePath = path.join(igrpstudioModelsPath, file);
    const model: ModelConfig = await readJsonFile(filePath);
    await modelGenerator(model, output);
  }
};
