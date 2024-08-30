import fs from 'fs-extra';
import { getModelConfigPath, getModelOutputDir } from '../../utils/helpers';
import { ModelConfig, RenderContext } from '../../interfaces/types';

export const deleteModelConfig = async (context: RenderContext<ModelConfig>) => {
  const modelPath = getModelOutputDir(context);
  const modelConfigPath = getModelConfigPath(context.resourceConfig.name, context.basePath);

  if (await fs.pathExists(modelPath)) await fs.rm(modelPath, { recursive: true });
  if (await fs.pathExists(modelConfigPath)) await fs.rm(modelConfigPath, { recursive: true });
};
