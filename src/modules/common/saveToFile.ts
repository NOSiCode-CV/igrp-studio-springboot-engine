import fs from 'fs-extra';
import { ERROR_MESSAGE } from '../../utils/constants';
import { dirname } from 'path';

/**
 * Saves the rendered template into the specified file. It will create the dir if it does not exist.
 * @param {string} content - The content to save in the file.
 * @param {string} outputPath - The output path where the content will be saved.
 * @throws {Error} - Throws an error if the content or output path is invalid.
 */
export const saveToFile = async (content: string, outputPath: string) => {
  // TODO Review if this is catched on schema validations.
  if (!content) throw ERROR_MESSAGE.INVALID_API_CONFIG;
  if (!outputPath) throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;

  await fs.mkdir(dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, content, 'utf-8');
};
