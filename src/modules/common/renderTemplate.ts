import path from 'path';
import fs from 'fs-extra';
import { Handlebars } from '../../utils/handlebarsHelpers';
import { DIRECTORIES, ERROR_MESSAGE, OBJECT_TYPES, TEMPLATES } from '../../utils/constants';
import { loadPartials } from '../../utils/helpers';
import { getDTOTypes } from '../dto/helpers';
import { getEnumTypes } from '../enum/helpers';
import { getPaths } from '../../index';

export const cache: Record<string, any> = {};

/**
 * Generates content from a template and a context.
 * @param templateName - The name of the template located in the template directory.
 * @param context - An object containing all the variables or information needed to generate content from the template.
 * @returns The content generated as a string.
 * @throws Throws an error if the template name is not provided or if the context is empty.
 */
export const renderTemplate = async (templateName: string, context: any) => {

  if (!templateName) {
    throw ERROR_MESSAGE.TEMPLATE_NAME_REQUIRED;
  }

  if (!context) {
    throw ERROR_MESSAGE.EMPTY_CONTEXT;
  }

  await loadPartials();

  if(templateName === TEMPLATES.APPLICATION_RESOURCES_BANNER) {
    context.baseVersion = "0.0.1-alpha";
  }

  if(OBJECT_TYPES.includes(context.resourceConfig?.type) || context.resourceConfig?.type === 'model') {
    const sharedDTOImports = await getDTOTypes(DIRECTORIES.SHARED, context.basePath);
    const customDTOImports = await getDTOTypes(context.resourceConfig.module, context.basePath);
    cache["dtoImports"] = new Map([...sharedDTOImports, ...customDTOImports]);
    cache["enumImports"] = await getEnumTypes(context.resourceConfig.module ?? DIRECTORIES.SHARED, context.basePath);
  }

  const templatePath = path.join(getPaths().template, templateName);
  const templateContent = await fs.readFile(templatePath, 'utf-8');
  const template = Handlebars.compile(templateContent);

  return template(context);
};