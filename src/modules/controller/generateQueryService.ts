import path from 'path';
import { ControllerConfig, RenderContext } from '../../interfaces/types';
import { TEMPLATES } from '../../utils/constants';
import { renderTemplate } from '../common/renderTemplate';
import { saveToFile } from '../common/saveToFile';
import { getDDDServiceDir, getDDDServiceImplDir, getServiceDir } from '../../utils/helpers';

const QUERY_SERVICE_SUFFIX = 'QueryServiceImpl.java';

/**
 * 
 * @param context 
 */
export const generateQueryServiceInmpl = async (context: RenderContext<ControllerConfig>) => {
  const queryServiceImpl = await renderQueryServiceImpl(context);
  const queryServiceImplPath = getQueryServiceImplPath(context);
  await saveToFile(queryServiceImpl, queryServiceImplPath, false);
};

export const renderQueryServiceImpl = async (context: RenderContext<ControllerConfig>) => {
    return await renderTemplate(TEMPLATES.DDD_QUERY_SERVICE_IMPL, context);
};

const getQueryServiceImplPath = (context: RenderContext<ControllerConfig>) => {
  const outputDir = getDDDServiceDir(context)
  context.fullPath = outputDir
  return path.join(outputDir, `${context.resourceConfig.name}${QUERY_SERVICE_SUFFIX}`);
};