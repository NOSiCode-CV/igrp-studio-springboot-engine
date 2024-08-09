import { ModelConfig } from '../../interfaces/types';
import { renderTemplate } from '../common/renderTemplate';
import { ERROR_MESSAGE, TEMPLATES } from '../../utils/constants';

export const repositoryGenerator = async (config: ModelConfig) => {
  if (!config || !config.crud) throw ERROR_MESSAGE.INVALID_MODEL_CONFIG;

  return await renderTemplate(TEMPLATES.DOMAIN_REPOSITORY, config);
};
