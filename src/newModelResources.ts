import path from 'path';
import fs from 'fs-extra';
import { modelGenerator } from './modules/model/modelResourceGenerator';
import { ModelConfig } from './interfaces/types';
import { DIRECTORIES, ERROR_MESSAGE, EXTENSIONS } from './utils/constants';
import { readJsonFile } from './utils/readJsonFiles';
import { getMainPath } from './utils/helpers';
import { saveTemplate } from './modules/common/saveTemplate';
import { repositoryGenerator } from './modules/model/modelRepositoryGenerator';

const REEPOSITORY_SUFFIX = 'Repository.java';

export const modelResourceGenerator = async (config: ModelConfig, output: string) => {
  if (!config || !config.name) throw ERROR_MESSAGE.MODEL_REQUIRED;

  const model = config.name;
  const configFilePath = path.join(output, DIRECTORIES.CONFIG_MODEL, `${model}${EXTENSIONS.JSON}`);

  if (!(await fs.pathExists(configFilePath))) throw ERROR_MESSAGE.MODEL_FILE_CONFIG_NOT_FOUNT;

  const file: ModelConfig = await readJsonFile(configFilePath);

  const template = await modelGenerator(file);
  const packageName = file.package?.split('.');
  const [group, artifact] = [...packageName!];

  const modelOutputPath = path.join(
    output,
    getMainPath(group, artifact),
    DIRECTORIES.MODELS,
    model,
  );

  await fs.mkdir(modelOutputPath, { recursive: true });

  await saveTemplate(template, path.join(modelOutputPath, `${model}${EXTENSIONS.JAVA}`));

  if (file.crud) {
    const repository = await repositoryGenerator(file);
    await saveTemplate(repository, path.join(modelOutputPath, `${model}${REEPOSITORY_SUFFIX}`));
  }
};
