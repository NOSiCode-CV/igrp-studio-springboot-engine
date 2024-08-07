import { ModelConfig } from '../../interfaces/types';
import { ERROR_MESSAGE, TEMPLATES } from '../../utils/constants';
import { templateGenerator } from '../common/templateGenerator';


/**
 * Generates the model configuration from a template and a configuration object.
 * @param {ModelConfig} config - The model configuration, which includes the model name and attributes.
 * @returns {Promise<string>} - The model configuration generated as a string.
 * @throws {Error} - Throws an error if the model configuration is invalid or has no attributes.
 */
export const modelConfigGenerator = async (config: ModelConfig) => {
  if (!config || !config.name || !config.attributes) {
    throw ERROR_MESSAGE.INVALID_MODEL_CONFIG;
  }

  if (config.attributes.length === 0) {
    throw ERROR_MESSAGE.EMPTY_ATTRIBUTE;
  }

  const modelConfig = await templateGenerator(TEMPLATES.IGRP_MODEL, config);

  return modelConfig;
};
