import path from 'path';
import { ControllerConfig, RenderContext } from '../../interfaces/types';
import { TEMPLATES } from '../../utils/constants';
import { renderTemplate } from '../common/renderTemplate';
import { saveToFile } from '../common/saveToFile';
import { getServiceDir } from '../../utils/helpers';

const SERVICE_SUFFIX = 'ServiceImpl.java';

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
  return await renderTemplate(TEMPLATES.DOMAIN_SERVICE, context);
};

const getServiceImplPath = (context: RenderContext<ControllerConfig>) =>
  path.join(getServiceDir(context), `${context.resourceConfig.name}${SERVICE_SUFFIX}`);
