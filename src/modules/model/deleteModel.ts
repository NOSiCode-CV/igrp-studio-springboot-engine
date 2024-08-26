import fs from 'fs-extra';
import { getControllerConfigPath, getControllerDir, getModelConfigPath, getModelOutputDir } from '../../utils/helpers';
import { ModelConfig, RenderContext } from '../../interfaces/types';

export const deleteModelConfig = async (context: RenderContext<ModelConfig>) => {
  const modelPath = getModelOutputDir(context);
  const controllerPath = getControllerDir(context);
  const modelConfigPath = getModelConfigPath(context.resourceConfig.name, context.basePath);
  const controllerConfigPath = getControllerConfigPath(context.resourceConfig.name, context.basePath)

  if (await fs.pathExists(modelPath)) await fs.rm(modelPath, { recursive: true });

  if (await fs.pathExists(controllerPath)) await fs.rm(controllerPath, { recursive: true });

  if (await fs.pathExists(modelConfigPath)) await fs.rm(modelConfigPath, { recursive: true });

  if (await fs.pathExists(controllerConfigPath)) await fs.rm(controllerConfigPath, { recursive: true });
};
