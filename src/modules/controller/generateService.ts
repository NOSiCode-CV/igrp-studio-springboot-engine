import path from 'path';
import { ControllerConfig, RenderContext } from '../../interfaces/types';
import { PROJECT_STRUCTURE_STYLE, TEMPLATES } from '../../utils/constants';
import { renderTemplate } from '../common/renderTemplate';
import { saveToFile } from '../common/saveToFile';
import { getDDDServiceDir, getServiceDir } from '../../utils/helpers';

const SERVICE_SUFFIX = 'Service.java';
const CMD_SERVICE_SUFFIX = 'CommandService.java';

/**
 * 
 * @param context 
 */
export const generateServiceInmpl = async (context: RenderContext<ControllerConfig>) => {
  const serviceImplPath = getServiceImplPath(context);
  const serviceImpl = await renderServiceImpl(context);
  await saveToFile(serviceImpl, serviceImplPath, false);
};

export const renderServiceImpl = async (context: RenderContext<ControllerConfig>) => {
  if(context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN)
    return await renderTemplate(TEMPLATES.DDD_CMD_SERVICE_IMPL, context);
  else
    return await renderTemplate(TEMPLATES.DOMAIN_SERVICE, context);
};

const getServiceImplPath = (context: RenderContext<ControllerConfig>) => {
  if(context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
    const outputDir = getDDDServiceDir(context)
    context.fullPath = outputDir
    return path.join(outputDir, `${context.resourceConfig.name}${CMD_SERVICE_SUFFIX}`);
  } else {
    const outputDir = getServiceDir(context)
    context.fullPath = outputDir
    return path.join(outputDir, `${context.resourceConfig.name}${SERVICE_SUFFIX}`);
  }
};
