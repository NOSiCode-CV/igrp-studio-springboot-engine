import path from 'path';
import fs from 'fs-extra';
import { getMainPath } from '../utils/helpers';
import { readJsonFile } from '../utils/readJsonFiles';
import { templateGenerator } from './templateGenerator';
import { ApiConfig, ModelConfig } from '../interfaces/types';
import { DIRECTORIES, ERROR_MESSAGE, TEMPLATES } from '../utils/constants';

const REEPOSITORY_SUFFIX = 'Repository.java';

export const repository = async (config: ModelConfig, output: string) => {
  if (!config || !config.name || !config.type) {
    throw ERROR_MESSAGE.INVALID_MODEL_CONFIG;
  }

  const apiConfigPath = path.join(output, DIRECTORIES.BASE_API);
  const apiConfig: ApiConfig = await readJsonFile(apiConfigPath);

  if (!apiConfig.group || !apiConfig.artifact) {
    throw ERROR_MESSAGE.INVALID_API_CONFIG;
  }

  const outputFile = path.join(
    output,
    getMainPath(apiConfig.group, apiConfig.artifact),
    DIRECTORIES.MODELS,
    config.name,
    `${config.name}${REEPOSITORY_SUFFIX}`,
  );

  config.package = `${apiConfig.package}.${config.type}.${config.name}`;

  const template = await templateGenerator(TEMPLATES.DOMAIN_REPOSITORY, config);

  await fs.writeFile(outputFile, template, 'utf-8');
};
