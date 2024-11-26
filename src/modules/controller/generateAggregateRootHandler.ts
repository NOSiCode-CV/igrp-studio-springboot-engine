import path from 'path';
import { ControllerConfig, RenderContext } from '../../interfaces/types';
import { TEMPLATES } from '../../utils/constants';
import { renderTemplate } from '../common/renderTemplate';
import { saveToFile } from '../common/saveToFile';
import { getDDDAggregateRootOutputDir } from '../../utils/helpers';

const CLASS_SUFFIX = 'AggregateRootHandler.java';

/**
 * 
 * @param context 
 */
export const generateAggregateRootHandler = async (context: RenderContext<ControllerConfig>) => {
  const aggregateRootHandler = await renderAggregateRootHandler(context);
  const aggregateRootHandlerPath = getAggregateRootHandlerPath(context);
  await saveToFile(aggregateRootHandler, aggregateRootHandlerPath, false);
};

export const renderAggregateRootHandler = async (context: RenderContext<ControllerConfig>) => {
    return await renderTemplate(TEMPLATES.DDD_AGGREGATE_ROOT_IMPL, context);
};

const getAggregateRootHandlerPath = (context: RenderContext<ControllerConfig>) => {
  const outputDir = getDDDAggregateRootOutputDir(context)
  context.fullPath = outputDir
  return path.join(outputDir, `${context.resourceConfig.name}${CLASS_SUFFIX}`);
};
