import path from 'path';
import fs from 'fs-extra';
import { ApiConfig, ModelConfig } from '../interfaces/types';
import { templateGenerator } from './templateGenerator';
import { DIRECTORIES, PACKAGE_NAME, TEMPLATES } from '../utils/constants';
import { readJsonFile } from '../utils/readJsonFiles';

const REEPOSITORY_SUFFIX = 'Repository.java';

export const repository = async (config: ModelConfig, output: string) => {
  const apiConfigPath = path.join(output, DIRECTORIES.BASE_API);
  const apiConfig: ApiConfig = await readJsonFile(apiConfigPath);
  const outputFile = path.join(
    output,
    DIRECTORIES.MAIN(apiConfig),
    DIRECTORIES.MODELS,
    config.name,
    `${config.name}${REEPOSITORY_SUFFIX}`,
  );

  config.package = `${apiConfig.package}.${config.type}.${config.name}`;

  const template = await templateGenerator(TEMPLATES.DOMAIN_REPOSITORY, config);

  await fs.writeFile(outputFile, template, 'utf-8')
};
