import path from 'path';
import { ControllerConfig, RenderContext } from '../../interfaces/types';
import { PROJECT_STRUCTURE_STYLE, TEMPLATES } from '../../utils/constants';
import { renderTemplate } from '../common/renderTemplate';
import { saveToFile } from '../common/saveToFile';
import { getDDDServiceDir, getDDDServiceImplDir, getServiceDir } from '../../utils/helpers';

const SERVICE_SUFFIX = 'ServiceImpl.java';
const CMD_SERVICE_SUFFIX = 'CmdServiceImpl.java';

/**
 * 
 * @param context 
 */
export const generateServiceInmpl = async (context: RenderContext<ControllerConfig>) => {
  const serviceImpl = await renderServiceImpl(context);
  const serviceImplPath = getServiceImplPath(context);
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
    return path.join(getDDDServiceDir(context), `${context.resourceConfig.name}${CMD_SERVICE_SUFFIX}`);
  } else
    return path.join(getServiceDir(context), `${context.resourceConfig.name}${SERVICE_SUFFIX}`);
};
