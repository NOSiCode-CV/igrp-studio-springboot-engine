import { EnumConfig, RenderContext } from '../../interfaces/types';
import { ERROR_MESSAGE, EXTENSIONS, PROJECT_STRUCTURE_STYLE, TEMPLATES } from '../../utils/constants';
import { getDDDEnumOutputDir, getEnumOutputDir } from '../../utils/helpers';
import { renderTemplate } from '../common/renderTemplate';
import { saveToFile } from '../common/saveToFile';
import path from 'path';

export const generateEnum = async (context: RenderContext<EnumConfig>) => {

  const enumOutputPath = getEnumOutputPath(context);
  const template = await _renderEnum(context);

  await saveToFile(template, enumOutputPath)

}

export const _renderEnum = async (context: RenderContext<EnumConfig>) => {

  if (context.resourceConfig.values.length === 0) {
    throw ERROR_MESSAGE.EMPTY_ATTRIBUTE;
  }

  return await renderTemplate(TEMPLATES.DOMAIN_ENUM, context);

}

const getEnumOutputPath = (context: RenderContext<EnumConfig>) => {
  if(context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
    const outputDir = getDDDEnumOutputDir(context)
    context.fullPath = outputDir
    return path.join(
      outputDir,
      `${context.resourceConfig.name}${EXTENSIONS.JAVA}`
    )
  } else {
    const outputDir = getEnumOutputDir(context)
    context.fullPath = outputDir
    return path.join(
      outputDir,
      `${context.resourceConfig.name}${EXTENSIONS.JAVA}`
    )
  }
}