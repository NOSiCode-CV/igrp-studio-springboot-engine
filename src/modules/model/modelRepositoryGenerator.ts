import { ModelConfig, RenderContext } from '../../interfaces/types';
import { renderTemplate } from '../common/renderTemplate';
import { ERROR_MESSAGE, TEMPLATES } from '../../utils/constants';


/**
 * 
 * @param config 
 * @returns 
 */
export const repositoryGenerator = async (context: RenderContext<ModelConfig>) => {
  if (!context.config || !context.config.crud) throw ERROR_MESSAGE.INVALID_MODEL_CONFIG;

  return await renderTemplate(TEMPLATES.DOMAIN_REPOSITORY, context);
};
