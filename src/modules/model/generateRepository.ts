import { ModelConfig, RenderContext } from '../../interfaces/types';
import { renderTemplate } from '../common/renderTemplate';
import { ERROR_MESSAGE, TEMPLATES } from '../../utils/constants';
import { getModelOutputDir } from '../../utils/helpers';
import path from 'path';
import { saveToFile } from '../common/saveToFile';

const REPOSITORY_SUFFIX = 'Repository.java';

/**
* Generates a repository for the given model and saves it to the appropriate location.
*
* @param {RenderContext<ModelConfig>} context - The render context that includes the model configuration and base path.
* @throws {Error} - Throws an error if the model configuration is invalid.
*/
export const generateRepository = async (context: RenderContext<ModelConfig>) => {
  const template = await renderRepository(context);
  const modelOutputPath = getRepositoryOutputPath(context);
  await saveToFile(template, modelOutputPath);
}

/**
* Renders the repository content from the template.
*
* @param  context - The rendering context that includes the model configuration and base path.
* @returns - Returns a promise that resolves to a string containing the generated repository content.
* @throws - Throws an error if the model configuration is invalid or if CRUD is not specified.
*/
export const renderRepository = async (context: RenderContext<ModelConfig>) => {
  if (!context.resourceConfig || !context.resourceConfig.crud) throw ERROR_MESSAGE.INVALID_MODEL_CONFIG;

  return await renderTemplate(TEMPLATES.DOMAIN_REPOSITORY, context);
};


/**
* Gets the output path for the generated repository file.
*
* @param {RenderContext<ModelConfig>} context - The rendering context including the model configuration and base path.
* @returns {string} - The full path where the repository file will be saved.
*/
const getRepositoryOutputPath = (context: RenderContext<ModelConfig>) => 
  path.join( getModelOutputDir(context), `${context.resourceConfig.name}${REPOSITORY_SUFFIX}`)
