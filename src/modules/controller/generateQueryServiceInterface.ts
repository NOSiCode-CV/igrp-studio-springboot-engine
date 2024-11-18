import path from 'path';
import { ControllerConfig, RenderContext } from '../../interfaces/types';
import { ERROR_MESSAGE, TEMPLATES } from '../../utils/constants';
import { renderTemplate } from '../common/renderTemplate';
import { saveToFile } from '../common/saveToFile';
import { getControllerDir, getDDDRepositoryOutputDir, getDDDServiceDir } from '../../utils/helpers';

const QUERY_SERVICE_SUFFIX = 'QueryService.java';

/**
 * 
 * @param context 
 */
export const generateQueryServiceInterface = async (context: RenderContext<ControllerConfig>) => {
  const queryServiceInterface = await renderQueryServiceInterface(context);
  const queryServiceInterfacePath = getQueryServiceInterfacePath(context);
  await saveToFile(queryServiceInterface, queryServiceInterfacePath);
};

export const renderQueryServiceInterface = async (context: RenderContext<ControllerConfig>) => {
    return await renderTemplate(TEMPLATES.DDD_QUERY_SERVICE, context);
};

const getQueryServiceInterfacePath = (context: RenderContext<ControllerConfig>) => {
    return path.join(getDDDServiceDir(context), `${context.resourceConfig.name}${QUERY_SERVICE_SUFFIX}`);
};