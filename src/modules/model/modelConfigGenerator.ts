import { ModelConfig } from '../../interfaces/types';
import { ERROR_MESSAGE, TEMPLATES } from '../../utils/constants';
import { renderTemplate } from '../common/renderTemplate';


/**
 * Generates the model configuration from a template and a configuration object.
 * @param config The model configuration, which includes the model name and attributes.
 * @returns The model configuration generated as a string.
 * @throws {Error} - Throws an error if the model configuration is invalid or has no attributes.
 */
export const modelConfigGenerator = async (config: ModelConfig) => {
  if (!config || !config.name || !config.attributes) {
    throw ERROR_MESSAGE.INVALID_MODEL_CONFIG;
  }

  if (config.attributes.length === 0) {
    throw ERROR_MESSAGE.EMPTY_ATTRIBUTE;
  }
  return await renderTemplate(TEMPLATES.IGRP_MODEL, config);
};
