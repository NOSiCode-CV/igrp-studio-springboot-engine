import path from 'path';
import fs from 'fs-extra';
import { Handlebars } from '../utils/helpers';
import { ERROR_MESSAGE, TEMPLATE_DIR } from '../utils/constants';

export const templateGenerator = async (templateName: string, context: {}) => {
  if (!templateName){
    throw ERROR_MESSAGE.TEMPLATE_NAME_REQUIRED;
  }

  if (!context) {
    throw ERROR_MESSAGE.EMPTY_CONTEXT;
  };

  /**
  * generate a file from handlebars template
  */
  const templatePath = path.join(TEMPLATE_DIR, templateName);
  const templateContent = await fs.readFile(templatePath, 'utf-8');
  const template = Handlebars.compile(templateContent);

  const file = template(context);

  return file;
};
