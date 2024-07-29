import path from 'path';
import fs from 'fs-extra';
import { isFile } from '../utils/checkFiles';
import { readJsonFile } from '../utils/readJsonFiles';
import { ApiConfig, ModelConfig } from '../interfaces/types';
import { templateGenerator } from './templateGenerator';
import { TEMPLATES, EXTENSIONS, DIRECTORIES, ERROR_MESSAGE } from '../utils/constants';
import { repository } from './repositoryGenerator';

export const modelGenerator = async (config: ModelConfig, output: string) => {
  const baseApiPath = path.join(output, DIRECTORIES.BASE_API);

  if (!(await isFile(baseApiPath))) {
    throw ERROR_MESSAGE.FILE_CHECKING;
  }

  const baseApiFile: ApiConfig = await readJsonFile(baseApiPath);
  config.package = baseApiFile.package;
  const outputDir = path.join(
    output,
    DIRECTORIES.MAIN(baseApiFile),
    DIRECTORIES.MODELS,
    config.name
  );

  const modelPath = path.join(outputDir,`${config.name}${EXTENSIONS.JAVA}`);

  fs.mkdirSync(outputDir, { recursive: true });

  const model = await templateGenerator(TEMPLATES.DOMAIN_MODEL, config);
  await fs.writeFile(modelPath, model, 'utf-8');

  if ( config.crud ) {
    await repository(config, output);
  }
};
