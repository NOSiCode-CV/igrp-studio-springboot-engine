import fs from 'fs-extra';
import {
  getControllerConfigPath,
  getControllerDir,
  getDDDAggregateRootOutputDir,
  getDDDControllerDir, getDTOConfigPath,
} from '../../utils/helpers';
import { ControllerConfig, RenderContext } from '../../interfaces/types';
import { DIRECTORIES, ERROR_MESSAGE, PROJECT_STRUCTURE_STYLE } from '../../utils/constants';
import { updatePermissions } from '../permission/permissionManagement';

export const deleteControllerConfig = async (context: RenderContext<ControllerConfig>) => {

  let controllerPath;

  if (context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
    controllerPath = getDDDControllerDir(context);
    const aggregatePath = getDDDAggregateRootOutputDir(context);
    if (await fs.pathExists(aggregatePath)) await fs.rm(aggregatePath, { recursive: true });
    else throw ERROR_MESSAGE.AGGREGATE_NOT_FOUND;
  } else {
    controllerPath = getControllerDir(context);
  }

  const controllerConfigPath = getControllerConfigPath(context.resourceConfig.module ?? DIRECTORIES.SHARED, context.resourceConfig.name, context.basePath)

  if (await fs.pathExists(controllerPath)) {
    await fs.rm(controllerPath, { recursive: true })
  }
  else throw ERROR_MESSAGE.CONTROLLER_FILE_NOT_FOUND;

  if (await fs.pathExists(controllerConfigPath)) await fs.rm(controllerConfigPath, { recursive: true });
  else throw ERROR_MESSAGE.CONTROLLER_FILE_CONFIG_NOT_FOUND
  await updatePermissions(context.resourceConfig.module ?? DIRECTORIES.SHARED, context.basePath, context.resourceConfig.type)
};
