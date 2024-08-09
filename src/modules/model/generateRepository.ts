import { ModelConfig, RenderContext } from '../../interfaces/types';
import { renderTemplate } from '../common/renderTemplate';
import { ERROR_MESSAGE, TEMPLATES } from '../../utils/constants';
import { getModelOutputDir } from '../../utils/helpers';
import path from 'path';
import { saveToFile } from '../common/saveToFile';

const REPOSITORY_SUFFIX = 'Repository.java';

export const generateRepository = async (context: RenderContext<ModelConfig>) => {
  const template = await renderRepository(context);
  const modelOutputPath = getRepositoryOutputPath(context);
  await saveToFile(template, modelOutputPath);
}

/**
 * 
 * @param config 
 * @returns 
 */
export const renderRepository = async (context: RenderContext<ModelConfig>) => {
  if (!context.resourceConfig || !context.resourceConfig.crud) throw ERROR_MESSAGE.INVALID_MODEL_CONFIG;

  return await renderTemplate(TEMPLATES.DOMAIN_REPOSITORY, context);
};


const getRepositoryOutputPath = (context: RenderContext<ModelConfig>) => 
  path.join( getModelOutputDir(context), `${context.resourceConfig.name}${REPOSITORY_SUFFIX}`)
