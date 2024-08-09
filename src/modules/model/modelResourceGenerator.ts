import { ModelConfig, RenderContext } from '../../interfaces/types';
import { renderTemplate } from '../common/renderTemplate';
import { ERROR_MESSAGE, TEMPLATES } from '../../utils/constants';

/**
 * Generates the model in the API using the provided configuration.
 * @param {ModelConfig} context - The configuration of the model including the model name and attributes.
 * @returns {Promise<string>} - A string representing the model generated from the template.
 * @throws {Error} - Throws an error if the model configuration is invalid or has no attributes.
 */
export const modelGenerator = async (context: RenderContext<ModelConfig>) => {
  if (!context.config || !context.config.name || !context.config.attributes) {
    throw ERROR_MESSAGE.INVALID_MODEL_CONFIG;
  }

  if (context.config.attributes.length === 0) {
    throw ERROR_MESSAGE.EMPTY_ATTRIBUTE;
  }

  return await renderTemplate(TEMPLATES.DOMAIN_MODEL, context);
};
