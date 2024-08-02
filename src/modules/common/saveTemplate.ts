import fs from 'fs-extra';
import { ERROR_MESSAGE } from '../../utils/constants';

export const saveTemplate = async (template: string, outputDir: string) => {

  if (!template) 
    throw ERROR_MESSAGE.INVALID_API_CONFIG;

  if (!outputDir)
    throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;

  await fs.writeFile(outputDir, template, 'utf-8');
}