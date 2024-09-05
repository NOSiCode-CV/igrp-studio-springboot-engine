import path from 'path';
import { ControllerConfig, RenderContext } from '../../interfaces/types';
import { ERROR_MESSAGE, TEMPLATES } from '../../utils/constants';
import { getControllerDir } from '../../utils/helpers';
import { renderTemplate } from '../common/renderTemplate';
import { saveToFile } from '../common/saveToFile';

const CONTROLLER_SUFFIX = 'Controller.java';
 /**
  * 
  * @param context 
  */
export const generateController = async (context: RenderContext<ControllerConfig>) => {
  const controller = await renderController(context);
  const controllerOutputPath = getControllerPath(context);

  await saveToFile(controller, controllerOutputPath);
};

const renderController = async (context: RenderContext<ControllerConfig>) => {
  // TODO: Verify schema validation here
  if (!context.resourceConfig) throw ERROR_MESSAGE.INVALID_CONTROLLER_CONFIG;

  return await renderTemplate(TEMPLATES.DOMAIN_CONTROLLER, context);
};

const getControllerPath = (context: RenderContext<ControllerConfig>) =>
  path.join(getControllerDir(context), `${context.resourceConfig.name}${CONTROLLER_SUFFIX}`);
