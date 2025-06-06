import { renderTemplate } from '../common/renderTemplate';
import { saveToFile } from '../common/saveToFile';
import { ControllerConfig, RenderContext } from '../../interfaces/types';
import {
  DIRECTORIES,
  ERROR_MESSAGE,
  PROJECT_STRUCTURE_STYLE,
  TEMPLATES,
} from '../../utils/constants';
import { normalizeControllerName, saveControllerConfig } from './saveControllerConfig';
import { updatePermissions } from '../permission/permissionManagement';
import { getControllerDir, getDDDControllerDir } from '../../utils/helpers';
import path from 'path';

const CONTROLLER_SUFFIX = 'Controller.java';
/**
 *
 * @param context
 */
export const generateController = async (context: RenderContext<ControllerConfig>) => {
  context.resourceConfig.name = normalizeControllerName(context.resourceConfig.name);

  const controllerOutputPath = getControllerPath(context);

  const controller = await renderController(context);

  /* await saveToFile(
     controller,
     controllerOutputPath,
     true,
     DIRECTORIES.CONTROLLER,
     context.resourceConfig.id,
     context.resourceConfig.module,
     context.basePath,
   );*/

  await saveToFile(
    controller,
    controllerOutputPath,
    true,
    DIRECTORIES.REST,
    context.resourceConfig.id,
    context.resourceConfig.module,
    context.basePath,
  );

  await saveControllerConfig(context.resourceConfig, context.basePath);

  // Once the controller has been generated, we will assign the necessary permissions to its endpoints.
  // This ensures that the newly created controller has the correct access rights configured
  // for each endpoint based on its defined permissions.
  await updatePermissions(
    context.resourceConfig.module ?? DIRECTORIES.SHARED,
    context.basePath,
    context.resourceConfig.type,
  );
};

const renderController = async (context: RenderContext<ControllerConfig>) => {
  if (!context.resourceConfig) throw ERROR_MESSAGE.INVALID_CONTROLLER_CONFIG;
  return await renderTemplate(TEMPLATES.DOMAIN_CONTROLLER, context);
};

const getControllerPath = (context: RenderContext<ControllerConfig>) => {
  if (context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
    const outputDir = getDDDControllerDir(context);
    context.fullPath = outputDir;
    return path.join(outputDir, `${context.resourceConfig.name}${CONTROLLER_SUFFIX}`);
  } else {
    const outputDir = getControllerDir(context);
    context.fullPath = outputDir;
    return path.join(outputDir, `${context.resourceConfig.name}${CONTROLLER_SUFFIX}`);
  }
};
