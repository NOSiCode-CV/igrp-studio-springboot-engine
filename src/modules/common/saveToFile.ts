import fs from 'fs-extra';
import { ERROR_MESSAGE } from '../../utils/constants';
import { dirname } from 'path';

/**
 * Saves the rendered template into the specified file. It will create the dir if it does not exist.
 * @param {string} content - The content to save in the file.
 * @param {string} outputPath - The output path where the content will be saved.
 * @throws {Error} - Throws an error if the content or output path is invalid.
 */
export const saveToFile = async (content: string, outputPath: string, override: boolean = true) => {
  if (!content) throw ERROR_MESSAGE.INVALID_API_CONFIG;
  if (!outputPath) throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;
  if (!override && (await fs.pathExists(outputPath))) return

  await fs.mkdir(dirname(outputPath), {recursive: true});

  await fs.writeFile(outputPath, content, 'utf-8');

};

// New function for saving binary content to a file (for JAR files, etc.)
export const saveBinaryToFile = async (
  content: Buffer,  // Content should be a Buffer for binary files
  outputPath: string,
  override: boolean = true
) => {
  if (!content) throw ERROR_MESSAGE.INVALID_API_CONFIG;
  if (!outputPath) throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;

  // Check if the file exists and override flag is false, return early
  if (!override && (await fs.pathExists(outputPath))) return;

  // Create directory structure if not already present
  await fs.mkdir(dirname(outputPath), { recursive: true });

  // Save the binary content as a file
  await fs.writeFile(outputPath, content);
};
