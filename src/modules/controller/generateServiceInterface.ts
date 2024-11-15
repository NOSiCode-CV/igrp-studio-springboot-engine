import path from 'path';
import { ControllerConfig, RenderContext } from '../../interfaces/types';
import { ERROR_MESSAGE, TEMPLATES } from '../../utils/constants';
import { renderTemplate } from '../common/renderTemplate';
import { saveToFile } from '../common/saveToFile';
import { getControllerDir, getDDDRepositoryOutputDir, getDDDServiceDir } from '../../utils/helpers';

const ICONTROLLER_SUFFIX = 'ServiceInterface.java';
const CMD_SERVICE_SUFFIX = 'CmdService.java';

/**
 * 
 * @param context 
 */
export const generateServiceInterface = async (context: RenderContext<ControllerConfig>) => {
  const serviceInterface = await renderServiceInterface(context);
  const serviceInterfacePath = getServiceInterfacePath(context);
  await saveToFile(serviceInterface, serviceInterfacePath);
};

export const renderServiceInterface = async (context: RenderContext<ControllerConfig>) => {
  if(context.baseConfig.struct === 'domain')
    return await renderTemplate(TEMPLATES.DDD_CMD_SERVICE, context);
  else
    return await renderTemplate(TEMPLATES.DOMAIN_ICONTROLLER, context);
};

const getServiceInterfacePath = (context: RenderContext<ControllerConfig>) => {
  if(context.baseConfig.struct === 'domain')
    return path.join(getDDDServiceDir(context), `${context.resourceConfig.name}${CMD_SERVICE_SUFFIX}`);
  else
    return path.join(getControllerDir(context), `${context.resourceConfig.name}${ICONTROLLER_SUFFIX}`);
};