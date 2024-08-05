import { ModelConfig } from '../../interfaces/types';
import { ERROR_MESSAGE, TEMPLATES } from '../../utils/constants';
import { templateGenerator } from '../common/templateGenerator';

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
