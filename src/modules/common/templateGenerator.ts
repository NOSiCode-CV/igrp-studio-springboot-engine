import path from 'path';
import fs from 'fs-extra';
import { Handlebars } from '../../utils/helpers';
import { ERROR_MESSAGE, TEMPLATE_DIR } from '../../utils/constants';

/**
 * Generates content from a template and a context.
 * @param {string} templateName - The name of the template located in the template directory.
 * @param {object} context - An object containing all the variables or information needed to generate content from the template.
 * @returns {Promise<string>} - The content generated as a string.
 * @throws {Error} - Throws an error if the template name is not provided or if the context is empty.
 */
export const templateGenerator = async (templateName: string, context: {}) => {
  if (!templateName) {
    throw ERROR_MESSAGE.TEMPLATE_NAME_REQUIRED;
  }

  if (!context) {
    throw ERROR_MESSAGE.EMPTY_CONTEXT;
  }

  const templatePath = path.join(TEMPLATE_DIR, templateName);
  const templateContent = await fs.readFile(templatePath, 'utf-8');
  const template = Handlebars.compile(templateContent);

  const file = template(context);

  return file;
};
