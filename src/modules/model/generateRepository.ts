import { ModelConfig, RenderContext } from '../../interfaces/types';
import { renderTemplate } from '../common/renderTemplate';
import { PROJECT_STRUCTURE_STYLE, TEMPLATES } from '../../utils/constants';
import { getDDDRepositoryImplOutputDir, getModelOutputDir } from '../../utils/helpers';
import path from 'path';
import { saveToFile } from '../common/saveToFile';

const REPOSITORY_SUFFIX = 'Repository.java';

/**
 * Generates a repository for the given model and saves it to the appropriate location.
 *
 * @param context - The render context that includes the model configuration and base path.
 * @throws - Throws an error if the model configuration is invalid.
 */
export const generateRepository = async (context: RenderContext<ModelConfig>) => {
  if (context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.TECHNICAL) {
    const modelOutputPath = getRepositoryOutputPath(context);
    const template = await renderRepository(context);
    await saveToFile(template, modelOutputPath, false);
  }
};

export const generateRepositoryImpl = async (context: RenderContext<ModelConfig>) => {
  const dddRepositoryImplOutputPath = getDDDRepositoryImplOutputPath(context);
  const template = await renderImplRepository(context);
  await saveToFile(template, dddRepositoryImplOutputPath, false);
};

/**
 * Renders the repository content from the template.
 *
 * @param  context - The rendering context that includes the model configuration and base path.
 * @returns - Returns a promise that resolves to a string containing the generated repository content.
 * @throws - Throws an error if the model configuration is invalid or if CRUD is not specified.
 */
export const renderRepository = async (context: RenderContext<ModelConfig>) => {
  if (context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN)
    return await renderTemplate(TEMPLATES.DDD_AGGREGATE_REPOSITORY, context);
  else return await renderTemplate(TEMPLATES.DOMAIN_REPOSITORY, context);
};

export const renderImplRepository = async (context: RenderContext<ModelConfig>) => {
  return await renderTemplate(TEMPLATES.DDD_LITE_REPOSITORY_IMPL, context);
};

/**
 * Gets the output path for the generated repository file.
 *
 * @param context - The rendering context including the model configuration and base path.
 * @returns The full path where the repository file will be saved.
 */
const getRepositoryOutputPath = (context: RenderContext<ModelConfig>) => {
  const outputDir = getModelOutputDir(context);
  context.fullPath = outputDir;
  return path.join(outputDir, `${context.resourceConfig.name}${REPOSITORY_SUFFIX}`);
};

const getDDDRepositoryImplOutputPath = (context: RenderContext<ModelConfig>) => {
  const outputDir = getDDDRepositoryImplOutputDir(context);
  context.fullPath = outputDir;
  return path.join(outputDir, `${context.resourceConfig.name}${REPOSITORY_SUFFIX}`);
};
