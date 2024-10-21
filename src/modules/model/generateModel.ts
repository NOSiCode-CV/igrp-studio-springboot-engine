import { Attribute, ModelConfig, RenderContext } from '../../interfaces/types';
import { renderTemplate } from '../common/renderTemplate';
import { ERROR_MESSAGE, EXTENSIONS, TEMPLATES } from '../../utils/constants';
import { saveToFile } from '../common/saveToFile';
import { getModelOutputDir } from '../../utils/helpers';
import path from 'path';

export const generateModel = async (context: RenderContext<ModelConfig>) => {
  const template = await renderModel(context);
  const modelOutputPath = getModelOutputPath(context);


  await saveToFile(template, modelOutputPath);
};

/**
 * Generates the model in the API using the provided configuration.
 * @param ontext - The configuration of the model including the model name and attributes.
 * @returns - A string representing the model generated from the template.
 * @throws - Throws an error if the model configuration is invalid or has no attributes.
 */
const renderModel = async (context: RenderContext<ModelConfig>) => {
  context.sqlAttributes = sqlUniquesAttributes(context.resourceConfig.attributes)
  context.mathAttributes = mathUniquesAttributes(context.resourceConfig.attributes)

  if (context.resourceConfig.attributes.length === 0) {
    throw ERROR_MESSAGE.EMPTY_ATTRIBUTE;
  }

  // Gerar as restrições únicas compostas
  context.uniqueConstraints = context.resourceConfig.uniqueConstraints || [];

  return await renderTemplate(TEMPLATES.DOMAIN_MODEL, context);
};

const sqlUniquesAttributes = (attributes: Attribute[]) => {
  let sqlAttributes: string[] = [];
  attributes.forEach(attribute => {
    if (attribute.type === "Date" || attribute.type === "Time" || attribute.type === "Timestamp"){
      sqlAttributes.push(attribute.type)
    }
  })

  return [...new Set(sqlAttributes)]
}

const mathUniquesAttributes = (attributes: Attribute[]) => {
  let mathAttributes: string[] = [];
  attributes.forEach(attribute => {
    if (attribute.type === "BigInteger" || attribute.type === "BigDecimal"){
      mathAttributes.push(attribute.type)
    }
  })

  return [...new Set(mathAttributes)]
}

const getModelOutputPath = (context: RenderContext<ModelConfig>) => 
  path.join(getModelOutputDir(context), `${context.resourceConfig.name}${EXTENSIONS.JAVA}`)



