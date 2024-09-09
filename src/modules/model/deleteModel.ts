import fs from 'fs-extra';
import { getModelConfigPath, getModelOutputDir } from '../../utils/helpers';
import { ModelConfig, RenderContext } from '../../interfaces/types';
import { ERROR_MESSAGE } from '../../utils/constants';

export const deleteModelConfig = async (context: RenderContext<ModelConfig>) => {
  const modelPath = getModelOutputDir(context);
  const modelConfigPath = getModelConfigPath(context.resourceConfig.name, context.basePath);

  if (await fs.pathExists(modelPath)) await fs.rm(modelPath, { recursive: true });
  else throw ERROR_MESSAGE.MODEL_FILE_CONFIG_NOT_FOUNT;

  if (await fs.pathExists(modelConfigPath)) await fs.rm(modelConfigPath, { recursive: true });
  else throw ERROR_MESSAGE.MODEL_FILE_CONFIG_NOT_FOUNT;
};
