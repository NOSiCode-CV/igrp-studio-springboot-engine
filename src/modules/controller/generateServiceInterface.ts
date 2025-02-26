import path from 'path';
import { ControllerConfig, RenderContext } from '../../interfaces/types';
import { PROJECT_STRUCTURE_STYLE, TEMPLATES } from '../../utils/constants';
import { renderTemplate } from '../common/renderTemplate';
import { saveToFile } from '../common/saveToFile';
import { getControllerDir, getDDDServiceDir } from '../../utils/helpers';

const ICONTROLLER_PREFIX = 'I';
const ICONTROLLER_SUFFIX = 'Service.java';
const CMD_SERVICE_SUFFIX = 'CommandService.java';

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
  if(context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN)
    return await renderTemplate(TEMPLATES.DDD_CMD_SERVICE, context);
  else
    return await renderTemplate(TEMPLATES.DOMAIN_ICONTROLLER, context);
};

const getServiceInterfacePath = (context: RenderContext<ControllerConfig>) => {
  if(context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
    const outputDir = getDDDServiceDir(context)
    context.fullPath = outputDir
    return path.join(
      outputDir,
      `${ICONTROLLER_PREFIX}${context.resourceConfig.name}${CMD_SERVICE_SUFFIX}`,
    );
  }
  else {
    const outputDir = getControllerDir(context)
    context.fullPath = outputDir
    return path.join(
      outputDir,
      `${ICONTROLLER_PREFIX}${context.resourceConfig.name}${ICONTROLLER_SUFFIX}`,
    );
  }
};