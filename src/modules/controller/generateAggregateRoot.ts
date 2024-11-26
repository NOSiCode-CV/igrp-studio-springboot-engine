import path from 'path';
import { ControllerConfig, RenderContext } from '../../interfaces/types';
import { TEMPLATES } from '../../utils/constants';
import { renderTemplate } from '../common/renderTemplate';
import { saveToFile } from '../common/saveToFile';
import { getDDDAggregateRootOutputDir } from '../../utils/helpers';

const CLASS_SUFFIX = 'AggregateRoot.java';

/**
 * 
 * @param context 
 */
export const generateAggregateRoot = async (context: RenderContext<ControllerConfig>) => {
  const aggregateRoot = await renderAggregateRoot(context);
  const aggregateRootPath = getAggregateRootPath(context);
  await saveToFile(aggregateRoot, aggregateRootPath, false);
};

export const renderAggregateRoot = async (context: RenderContext<ControllerConfig>) => {
    return await renderTemplate(TEMPLATES.DDD_AGGREGATE_ROOT_ABSTRACT, context);
};

const getAggregateRootPath = (context: RenderContext<ControllerConfig>) => {
  const outputDir = getDDDAggregateRootOutputDir(context)
  context.fullPath = outputDir
  return path.join(outputDir, `${context.resourceConfig.name}${CLASS_SUFFIX}`);
};
