import path from 'path';
import { ControllerConfig, RenderContext } from '../../interfaces/types';
import { ERROR_MESSAGE, TEMPLATES } from '../../utils/constants';
import { renderTemplate } from '../common/renderTemplate';
import { saveToFile } from '../common/saveToFile';
import { getControllerDir } from '../../utils/helpers';

const ICONTROLLER_SUFFIX = 'ServiceInterface.java';

export const generateServiceInterface = async (context: RenderContext<ControllerConfig>) => {
  const serviceInterface = await renderServiceInterface(context);
  const serviceInterfacePath = getServiceInterfacePath(context);
  await saveToFile(serviceInterface, serviceInterfacePath);
};

export const renderServiceInterface = async (context: RenderContext<ControllerConfig>) => {
  if (!context.resourceConfig) throw ERROR_MESSAGE.INVALID_CONTROLLER_CONFIG;

  return await renderTemplate(TEMPLATES.DOMAIN_ICONTROLLER, context);
};

const getServiceInterfacePath = (context: RenderContext<ControllerConfig>) =>
  path.join(getControllerDir(context), `${context.resourceConfig.name}${ICONTROLLER_SUFFIX}`);
