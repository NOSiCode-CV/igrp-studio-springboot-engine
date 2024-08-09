import path from 'path';
import fs from 'fs-extra';
import { getModelOutputPath } from './utils/helpers';
import { saveToFile } from './modules/common/saveToFile';
import { ERROR_MESSAGE, EXTENSIONS } from './utils/constants';
import { ModelConfig, RenderContext } from './interfaces/types';
import { saveModelConfig } from './modules/model/newModelConfig';
import { getBaseApiConfig } from './modules/baseApi/getBaseApiConfig';
import { modelGenerator } from './modules/model/modelResourceGenerator';
import { repositoryGenerator } from './modules/model/modelRepositoryGenerator';

const REEPOSITORY_SUFFIX = 'Repository.java';

/**
 *
 * @param config
 * @param output
 */
export const modelResourceGenerator = async (config: ModelConfig, output: string) => {
  if (!config) throw ERROR_MESSAGE.MODEL_REQUIRED;

  if (!config.name) throw ERROR_MESSAGE.INVALID_MODEL_CONFIG;

  const baseConfig = await getBaseApiConfig(output);
  await saveModelConfig(config, output);

  const context: RenderContext<ModelConfig> = {
    config,
    basePath: output,
    baseConfig,
  };

  const template = await modelGenerator(context);

  const modelOutputPath = getModelOutputPath(
    output,
    baseConfig.group,
    baseConfig.artifact,
    config.name,
  );

  await fs.mkdir(modelOutputPath, { recursive: true });

  await saveToFile(template, path.join(modelOutputPath, `${config.name}${EXTENSIONS.JAVA}`));

  if (config.crud) {
    const repository = await repositoryGenerator(context);
    await saveToFile(repository, path.join(modelOutputPath, `${config.name}${REEPOSITORY_SUFFIX}`));
  }
};
