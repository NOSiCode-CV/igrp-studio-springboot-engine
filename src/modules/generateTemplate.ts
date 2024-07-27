import { TEMPLATE_DIR } from '../utils/constants';
import { Handlebars } from '../utils/helpers';
import path from 'path';
import fs from 'fs-extra';

export const generateTemplate = async (templateName: string, context: {}) => {
  const templatePath = path.join(TEMPLATE_DIR, templateName);
  const templateContent = await fs.readFile(templatePath, 'utf-8');
  const template = Handlebars.compile(templateContent);

  const result = template(context);

  return result;
};
