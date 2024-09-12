import { Attribute, DTOConfig, RenderContext } from '../../interfaces/types';
import { renderTemplate } from '../common/renderTemplate';
import { ERROR_MESSAGE, EXTENSIONS, TEMPLATES } from '../../utils/constants';
import { saveToFile } from '../common/saveToFile';
import { getDtoOutputDir } from '../../utils/helpers';
import path from 'path';

export const generateDTO = async (context: RenderContext<DTOConfig>) => {
  const template = await renderDTO(context);
  const modelOutputPath = getDTOOutputPath(context);


  await saveToFile(template, modelOutputPath);
};

/**
 * Generates the DTO in the API using the provided configuration.
 * @param ontext - The configuration of the DTO including the DTO name and attributes.
 * @returns - A string representing the DTO generated from the template.
 * @throws - Throws an error if the DTO configuration is invalid or has no attributes.
 */
export const renderDTO = async (context: RenderContext<DTOConfig>) => {

  if (context.resourceConfig.attributes.length === 0) {
    throw ERROR_MESSAGE.EMPTY_ATTRIBUTE;
  }
  const tn = TEMPLATES.DOMAIN_DTO[context.resourceConfig.template];
  if (!tn) {
    throw ERROR_MESSAGE.TEMPLATE_NAME_NOT_REGISTERED;
  }
  return await renderTemplate(tn, context);
};


const getDTOOutputPath = (context: RenderContext<DTOConfig>) => 
  path.join(getDtoOutputDir(context), `${context.resourceConfig.name}${EXTENSIONS.JAVA}`)



