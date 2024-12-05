import fs from 'fs-extra';
import { getControllerConfigPath, getControllerDir } from '../../utils/helpers';
import { ControllerConfig, RenderContext } from '../../interfaces/types';
import { ERROR_MESSAGE } from '../../utils/constants';
import { updatePermissions } from '../permission/permissionManagement';

export const deleteControllerConfig = async (context: RenderContext<ControllerConfig>) => {
  const controllerPath = getControllerDir(context);
  const controllerConfigPath = getControllerConfigPath(context.resourceConfig.name, context.basePath)

  if (await fs.pathExists(controllerPath)) {
    await fs.rm(controllerPath, { recursive: true })
  }
  else throw ERROR_MESSAGE.CONTROLLER_FILE_NOT_FOUND;
  
  if (await fs.pathExists(controllerConfigPath)) await fs.rm(controllerConfigPath, { recursive: true });
  else throw ERROR_MESSAGE.CONTROLLER_FILE_CONFIG_NOT_FOUND
  await updatePermissions(context.basePath)
};
