import { TEMPLATE_DIR } from '../utils/constants';
import { Handlebars } from '../utils/helpers';
import path from 'path';
import fs from 'fs-extra';

export const generateFromTemplate = async (
  outputDir: string,
  templateName: string,
  outputName: string,
  context: {},
) => {
    const outputPath = path.join(outputDir, outputName);
    const templatePath = path.join(TEMPLATE_DIR, templateName);
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    const template = Handlebars.compile(templateContent);

    const result = template(context);

    await fs.writeFile(outputPath, result, 'utf-8');
};
