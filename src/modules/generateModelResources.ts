import path from 'path';
import fs from 'fs-extra';
import { isFile } from '../utils/checkFiles';
import { readJsonFile } from '../utils/readJsonFiles';
import { ApiConfig, ModelConfig } from '../interfaces/types';
import { generateFromTemplate } from './generateFromTemplate';
import { TEMPLATES, EXTENSIONS, DIRECTORIES, ERROR_MESSAGE } from '../utils/constants';

export const generateModel = async (config: ModelConfig, outputPath: string) => {
  const baseApiPath = path.join(outputPath, DIRECTORIES.BASE_API);

  if (!(await isFile(baseApiPath))) {
    throw ERROR_MESSAGE.FILE_CHECKING;
  }

  const baseApiFile: ApiConfig = await readJsonFile(baseApiPath);
  config.package = baseApiFile.package;
  const model = `${config.name}${EXTENSIONS.JAVA}`;
  const mainpath = path.join(
    outputPath,
    DIRECTORIES.MAIN(baseApiFile),
    DIRECTORIES.MODELS,
    config.name,
  );

  fs.mkdirSync(mainpath, { recursive: true });

  await generateFromTemplate(mainpath, TEMPLATES.DOMAIN_MODEL, model, config);
};
