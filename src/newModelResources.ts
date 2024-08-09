import path from 'path';
import fs from 'fs-extra';
import { modelGenerator } from './modules/model/modelResourceGenerator';
import { ModelConfig, RenderContext } from './interfaces/types';
import { DIRECTORIES, ERROR_MESSAGE, EXTENSIONS } from './utils/constants';
import { getMainPath } from './utils/helpers';
import { saveToFile } from './modules/common/saveToFile';
import { repositoryGenerator } from './modules/model/modelRepositoryGenerator';
import { saveModelConfig } from './modules/model/newModelConfig';
import { getBaseApiConfig } from './modules/baseApi/getBaseApiConfig';

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
    baseConfig
  }

  const template = await modelGenerator(context);

  const modelOutputPath = path.join(
    output,
    getMainPath(baseConfig.group, baseConfig.artifact),
    DIRECTORIES.MODELS,
    config.name,
  );

  await fs.mkdir(modelOutputPath, { recursive: true });

  await saveToFile(template, path.join(modelOutputPath, `${config.name}${EXTENSIONS.JAVA}`));

  /**
   * 
   */
  if (config.crud) {
    const repository = await repositoryGenerator(config);
    await saveToFile(repository, path.join(modelOutputPath, `${config.name}${REEPOSITORY_SUFFIX}`));
  }
};
