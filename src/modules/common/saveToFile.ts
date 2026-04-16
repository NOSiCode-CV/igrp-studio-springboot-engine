import fs from 'fs-extra';
import { DIRECTORIES, ERROR_MESSAGE, EXTENSIONS } from '../../utils/constants';
import { dirname, join } from 'path';
import {
  getDirectoryPath,
  loadControllerConfigs,
  loadDTOConfigs,
  loadEnumConfigs,
  loadModelConfigs,
  loadResponseConfigs,
} from '../../utils/helpers';

/**
 * Saves the rendered template into the specified file. It will create the dir if it does not exist.
 * @param {string} content - The content to save in the file.
 * @param {string} outputPath - The output path where the content will be saved.
 * @param {boolean} override - Overrides the file if true
 * @param {string | undefined} type - The type of the element to be saved
 * @param {string | undefined} id - The element's identifier
 * @param {string | undefined} module - The element's module
 * @param {string | undefined} basePath - The application base path
 * @param {string} extension - The file extension
 * @throws {Error} - Throws an error if the content or output path is invalid.
 */
export const saveToFile = async (
  content: string,
  outputPath: string,
  override: boolean = true,
  type: string | undefined = undefined,
  id: string | undefined = undefined,
  module: string | undefined = undefined,
  basePath: string | undefined = undefined,
  extension: string = EXTENSIONS.JAVA,
) => {
  const exists = await fs.pathExists(outputPath);
  if (!content) throw ERROR_MESSAGE.INVALID_API_CONFIG;
  if (!outputPath) throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;
  if (!override && exists) return;

  if (type && id) {
    if (!basePath) throw ERROR_MESSAGE.INVALID_API_CONFIG;
    if (type === DIRECTORIES.MODELS || type === DIRECTORIES.CONFIG_MODEL) {
      const models = await loadModelConfigs(module ?? DIRECTORIES.SHARED, basePath);
      const model = models.find((it) => it.id === id);
      if (model) {
        let sourcePath;
        if (extension === EXTENSIONS.JSON)
          sourcePath = join(getDirectoryPath(outputPath), model.name.concat(extension));
        else {
          if (outputPath.includes('domain'))
            sourcePath = join(getDirectoryPath(outputPath), model.name.concat(extension));
          else
            sourcePath = join(
              getDirectoryPath(getDirectoryPath(outputPath)),
              model.name.toLowerCase(),
            );
        }

        if (sourcePath != outputPath && sourcePath != getDirectoryPath(outputPath)) {
          await fs.remove(sourcePath);
        }

        if (outputPath.includes('domain')) {
          const repositorySourcePath = join(
            getDirectoryPath(getDirectoryPath(outputPath)),
            DIRECTORIES.REPOSITORY,
            'I' + model.name.concat('Repository' + extension),
          );
          await fs.remove(repositorySourcePath);
        }
      }
    } else if (type === DIRECTORIES.DTO || type === DIRECTORIES.CONFIG_DTO) {
      const dtos = await loadDTOConfigs(module ?? DIRECTORIES.SHARED, basePath);
      const dto = dtos.find((it) => it.id === id);
      if (dto) {
        const sourcePath = join(
          getDirectoryPath(outputPath),
          dto.name.replace(/dto$/i, '').concat('DTO', extension),
        );
        if (sourcePath != outputPath)
          await fs.remove(
            join(
              getDirectoryPath(sourcePath),
              dto.name.replace(/dto$/i, '').concat('DTO', extension),
            ),
          );
      }
    } else if (type === DIRECTORIES.ENUM || type === DIRECTORIES.CONFIG_ENUM) {
      const enums = await loadEnumConfigs(module ?? DIRECTORIES.SHARED, basePath);
      const theEnum = enums.find((it) => it.id === id);
      if (theEnum) {
        const sourcePath = join(getDirectoryPath(outputPath), theEnum.name.concat(extension));
        if (sourcePath != outputPath)
          await fs.remove(join(getDirectoryPath(sourcePath), theEnum.name.concat(extension)));
      }
    } else if (type === DIRECTORIES.CONFIG_RESPONSE) {
      const responses = await loadResponseConfigs(module ?? DIRECTORIES.SHARED, basePath);
      const response = responses.find((it) => it.id === id);
      if (response) {
        const sourcePath = join(getDirectoryPath(outputPath), response.name.concat(extension));
        if (sourcePath != outputPath)
          await fs.remove(join(getDirectoryPath(sourcePath), response.name.concat(extension)));
      }
    }
    if (type === DIRECTORIES.CONTROLLER || type === DIRECTORIES.CONFIG_CONTROLLER) {
      const controllers = await loadControllerConfigs(module ?? DIRECTORIES.SHARED, basePath);
      const controller = controllers.find((it) => it.id === id);
      if (controller) {
        let sourcePath;
        if (extension === EXTENSIONS.JSON)
          sourcePath = join(
            getDirectoryPath(outputPath),
            controller.name.replace(/controller$/i, '').concat('Controller', extension),
          );
        else {
          if (outputPath.includes('infrastructure'))
            sourcePath = join(
              getDirectoryPath(outputPath),
              controller.name.replace(/controller$/i, '').concat('Controller', extension),
            );
          else
            sourcePath = join(
              getDirectoryPath(getDirectoryPath(outputPath)),
              controller.name.toLowerCase(),
            );
        }

        if (sourcePath != outputPath && sourcePath != getDirectoryPath(outputPath)) {
          await fs.remove(sourcePath);
        }
      }
    }
  }

  await fs.mkdir(dirname(outputPath), { recursive: true });

  await fs.writeFile(outputPath, content, 'utf-8');
};

// New function for saving binary content to a file (for JAR files, etc.)
export const saveBinaryToFile = async (
  content: Buffer, // Content should be a Buffer for binary files
  outputPath: string,
  override: boolean = true,
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
