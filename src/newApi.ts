import path from 'path';
import fs from 'fs-extra';
import { readJsonFile } from './utils/readJsonFiles';
import { ApiConfig, ModelConfig } from './interfaces/types';
import { checkIfDirectoryIsEmpty } from './utils/checkFiles';
import { createAppDirectories } from './modules/createAppDirectories';
import { DIRECTORIES, ERROR_MESSAGE, EXTENSIONS } from './utils/constants';
import { saveFiles } from './modules/saveFile';
import { modelGenerator } from './modules/modelResourcesGenerator';

export const newApi = async (config: ApiConfig, output: string) => {
  if (!(await checkIfDirectoryIsEmpty(output))) {
    throw ERROR_MESSAGE.DIRECTORY_ALREADY_IN_USE;
  }

  /**
   * Creates the folder structure needed for the API.
   */
  await createAppDirectories(config, output);

  /**
   * With the base config sent to the newAPI, this function should create the following:
   *  - Base config files (pom.xml, mvnw, application.properties, etc.)
   *  - .igrpstudio config files (baseApi.json)
   *  - Application bootstrapping files ([API_NAME]Application.java)
   */
  await saveFiles(config, output);
  // TOOD: Add the preconditions on the template generation
};

export const modelSetUp = async (outputPath: string) => {
  const igrpstudioModelsPath = path.join(outputPath, DIRECTORIES.IGRPSTUDIO, DIRECTORIES.MODELS);

  const files = await fs.readdir(igrpstudioModelsPath);
  const jsonFiles = files.filter((file) => path.extname(file) === EXTENSIONS.JSON);

  for (const file of jsonFiles) {
    const filePath = path.join(igrpstudioModelsPath, file);
    const model: ModelConfig = await readJsonFile(filePath);
    await modelGenerator(model, outputPath);
  }
};
