import { ModelConfig } from '../../interfaces/types';
import { templateGenerator } from '../common/templateGenerator';
import { ERROR_MESSAGE, TEMPLATES } from '../../utils/constants';

export const repositoryGenerator = async (config: ModelConfig) => {
  if (!config || !config.crud) throw ERROR_MESSAGE.INVALID_MODEL_CONFIG;

  const repository = await templateGenerator(TEMPLATES.DOMAIN_REPOSITORY, config);

  return repository;
};
