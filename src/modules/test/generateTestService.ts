import path from 'path';
import { ControllerConfig, RenderContext } from '../../interfaces/types';
import { PROJECT_STRUCTURE_STYLE, TEMPLATES } from '../../utils/constants';
import { renderTemplate } from '../common/renderTemplate';
import { saveToFile } from '../common/saveToFile';
import { getDDDTestServiceDir, getTestServiceDir } from '../../utils/helpers';

const SERVICE_SUFFIX = 'ServiceTest.java';
const CMD_SERVICE_SUFFIX = 'CommandServiceTest.java';

/**
 *
 * @param context
 */
export const generateTestServiceInmpl = async (context: RenderContext<ControllerConfig>) => {
  const serviceImplPath = getTestServiceImplPath(context);
  const serviceImpl = await renderTestServiceImpl(context);
  await saveToFile(serviceImpl, serviceImplPath, false);
};

export const renderTestServiceImpl = async (context: RenderContext<ControllerConfig>) => {
  if (context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN)
    return await renderTemplate(TEMPLATES.DDD_TEST_CMD_SERVICE_IMPL, context);
  else return await renderTemplate(TEMPLATES.DOMAIN_TEST_SERVICE, context);
};

const getTestServiceImplPath = (context: RenderContext<ControllerConfig>) => {
  if (context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
    const outputDir = getDDDTestServiceDir(context);
    context.fullPath = outputDir;
    return path.join(outputDir, `${context.resourceConfig.name}${CMD_SERVICE_SUFFIX}`);
  } else {
    const outputDir = getTestServiceDir(context);
    context.fullPath = outputDir;
    return path.join(outputDir, `${context.resourceConfig.name}${SERVICE_SUFFIX}`);
  }
};
