import fs from 'fs-extra';
import { getControllerConfigPath, getControllerDir } from '../../utils/helpers';
import { ControllerConfig, RenderContext } from '../../interfaces/types';

export const deleteControllerConfig = async (context: RenderContext<ControllerConfig>) => {
  const controllerPath = getControllerDir(context);
  const controllerConfigPath = getControllerConfigPath(context.resourceConfig.name, context.basePath)

  if (await fs.pathExists(controllerPath)) await fs.rm(controllerPath, { recursive: true });
  if (await fs.pathExists(controllerConfigPath)) await fs.rm(controllerConfigPath, { recursive: true });
};
