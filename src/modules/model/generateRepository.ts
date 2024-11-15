import { ModelConfig, RenderContext } from '../../interfaces/types';
import { renderTemplate } from '../common/renderTemplate';
import { TEMPLATES } from '../../utils/constants';
import {
  getDDDAggregateRepositoryImplOutputDir,
  getDDDAggregateRepositoryOutputDir,
  getDDDModelOutputDir,
  getDDDRepositoryOutputDir,
  getModelOutputDir,
} from '../../utils/helpers';
import path from 'path';
import { saveToFile } from '../common/saveToFile';

const REPOSITORY_SUFFIX = 'Repository.java';
const REPOSITORY_IMPL_SUFFIX = 'RepositoryImpl.java';

/**
 * Generates a repository for the given model and saves it to the appropriate location.
 *
 * @param context - The render context that includes the model configuration and base path.
 * @throws - Throws an error if the model configuration is invalid.
 */
export const generateRepository = async (context: RenderContext<ModelConfig>) => {
  const template = await renderRepository(context);
  let modelOutputPath
  
  if (context.baseConfig.struct === 'domain') {
    if(context.resourceConfig.type === 'domain') {
      modelOutputPath = getDDDAggregateRepositoryOutputPath(context);
    } else if(context.resourceConfig.type === 'domainimpl')
      modelOutputPath = getDDDAggregateRepositoryImplOutputPath(context);
    else {
      modelOutputPath = getDDDRepositoryOutputPath(context);
    }
  } else {
    modelOutputPath = getRepositoryOutputPath(context);
  }
  await saveToFile(template, modelOutputPath);
};

/**
 * Renders the repository content from the template.
 *
 * @param  context - The rendering context that includes the model configuration and base path.
 * @returns - Returns a promise that resolves to a string containing the generated repository content.
 * @throws - Throws an error if the model configuration is invalid or if CRUD is not specified.
 */
export const renderRepository = async (context: RenderContext<ModelConfig>) => {
  if(context.baseConfig.struct === 'domain') {
    if(context.resourceConfig.type === 'domain')
      return await renderTemplate(TEMPLATES.DDD_AGGREGATE_REPOSITORY, context);
    else if(context.resourceConfig.type === 'domainimpl')
      return await renderTemplate(TEMPLATES.DDD_AGGREGATE_REPOSITORY_IMPL, context);
    else
      return await renderTemplate(TEMPLATES.DDD_BASE_REPOSITORY_IMPL, context);
  } else
    return await renderTemplate(TEMPLATES.DOMAIN_REPOSITORY, context);
};

/**
 * Gets the output path for the generated repository file.
 *
 * @param context - The rendering context including the model configuration and base path.
 * @returns The full path where the repository file will be saved.
 */
const getRepositoryOutputPath = (context: RenderContext<ModelConfig>) =>
  path.join(getModelOutputDir(context), `${context.resourceConfig.name}${REPOSITORY_SUFFIX}`);

const getDDDRepositoryOutputPath = (context: RenderContext<ModelConfig>) =>
  path.join(getDDDRepositoryOutputDir(context), `${context.resourceConfig.name}${REPOSITORY_SUFFIX}`);

const getDDDAggregateRepositoryOutputPath = (context: RenderContext<ModelConfig>) =>
  path.join(getDDDAggregateRepositoryOutputDir(context), `${context.resourceConfig.name}AggregateDomain${REPOSITORY_SUFFIX}`);

const getDDDAggregateRepositoryImplOutputPath = (context: RenderContext<ModelConfig>) =>
  path.join(getDDDAggregateRepositoryImplOutputDir(context), `${context.resourceConfig.name}AggregateDomain${REPOSITORY_IMPL_SUFFIX}`);
