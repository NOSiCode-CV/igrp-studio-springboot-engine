import path from 'path';
import { ExceptionConfig, RenderContext } from '../../interfaces/types';
import { PROJECT_STRUCTURE_STYLE, TEMPLATES } from '../../utils/constants';
import { renderTemplate } from '../common/renderTemplate';
import { saveToFile } from '../common/saveToFile';
import { getDDDExceptionDir, getExceptionDir } from '../../utils/helpers';
import { capitalize } from '../../helper/stringHelper';

const EXCEPTION_SUFFIX = 'Exception.java';

/**
 *
 * @param context
 */
export const generateException = async (context: RenderContext<ExceptionConfig>) => {
  const exceptionPath = getExceptionPath(context);
  const exception = await renderException(context);
  await saveToFile(exception, exceptionPath, false);
};

export const renderException = async (context: RenderContext<ExceptionConfig>) => {
  return await renderTemplate(TEMPLATES.CUSTOM_RESPONSE_STATUS_EXCEPTION, context);
};

const getExceptionPath = (context: RenderContext<ExceptionConfig>) => {
  if (context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
    const outputDir = getDDDExceptionDir(context);
    context.fullPath = outputDir;
    return path.join(outputDir, `${capitalize(context.resourceConfig.name)}${EXCEPTION_SUFFIX}`);
  } else {
    const outputDir = getExceptionDir(context);
    context.fullPath = outputDir;
    return path.join(outputDir, `${capitalize(context.resourceConfig.name)}${EXCEPTION_SUFFIX}`);
  }
};