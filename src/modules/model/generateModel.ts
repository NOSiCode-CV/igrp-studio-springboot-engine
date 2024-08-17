import { ModelConfig, RenderContext } from '../../interfaces/types';
import { renderTemplate } from '../common/renderTemplate';
import { ERROR_MESSAGE, EXTENSIONS, TEMPLATES } from '../../utils/constants';
import { saveToFile } from '../common/saveToFile';
import { getModelOutputDir } from '../../utils/helpers';
import path from 'path';
import { validateModelConfig } from '../../schema/modelConfig';

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
  const isModelValid = validateModelConfig(context.resourceConfig)

  if (!isModelValid && validateModelConfig.errors) throw ERROR_MESSAGE.INVALID_MODEL_CONFIG;

  if (context.resourceConfig.attributes.length === 0) {
    throw ERROR_MESSAGE.EMPTY_ATTRIBUTE;
  }

  return await renderTemplate(TEMPLATES.DOMAIN_MODEL, context);
};

const getModelOutputPath = (context: RenderContext<ModelConfig>) => 
  path.join(getModelOutputDir(context), `${context.resourceConfig.name}${EXTENSIONS.JAVA}`)

