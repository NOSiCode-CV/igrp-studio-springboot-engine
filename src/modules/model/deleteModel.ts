import fs from 'fs-extra';
import { getDDDModelOutputDir, getModelConfigPath, getModelOutputDir } from '../../utils/helpers';
import { ModelConfig, RenderContext } from '../../interfaces/types';
import { ERROR_MESSAGE } from '../../utils/constants';

export const deleteModelConfig = async (context: RenderContext<ModelConfig>) => {

  let modelPath;

  if(context.baseConfig.struct === 'domain') {
    modelPath = getDDDModelOutputDir(context);
  } else {
    modelPath = getModelOutputDir(context);
  }

  const modelConfigPath = getModelConfigPath(context.resourceConfig.name, context.basePath);

  if (await fs.pathExists(modelPath)) await fs.rm(modelPath, { recursive: true });
  else throw ERROR_MESSAGE.MODEL_FILE_CONFIG_NOT_FOUNT;

  if (await fs.pathExists(modelConfigPath)) await fs.rm(modelConfigPath, { recursive: true });
  else throw ERROR_MESSAGE.MODEL_FILE_CONFIG_NOT_FOUNT;

};
