import path from 'path';
import fs from 'fs-extra';
import { ApiConfig } from '../../interfaces/types';
import { DIRECTORIES, ERROR_MESSAGE } from '../../utils/constants';
import { getMainPath, getTestPath } from '../../utils/helpers';

/**
 * Function that creates the api directories
 * @param config - API base configuration file containning all the basic API information.
 * @param output - Output path where directories are created
 */
export const createAppDirectories = async (config: ApiConfig, output: string) => {
  const directories = getDirectoriesToCreate(config, output);
  saveAppDirectories(directories);
};

/**
 * Function that generates a list of directory paths to create based on the configuration and the output path.
 * @param config - API base configuration file containning all the basic API information.
 * @param output - Output path where directories will be created
 * @return List of directory paths to create.
 */
export const getDirectoriesToCreate = (config: ApiConfig, output: string): string[] => {
  if (!config || !config.group || !config.artifact) {
    throw ERROR_MESSAGE.INVALID_API_CONFIG;
  }

  if (!output) {
    throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;
  }

  const { group, artifact } = config;

  const mainPath = path.join(output, getMainPath(group, artifact));
  const testPath = path.join(output, getTestPath(group, artifact));
  const igrpstudioPath = path.join(output, DIRECTORIES.IGRPSTUDIO);

  return [
    path.join(output, DIRECTORIES.RESOURCES),
    path.join(mainPath, DIRECTORIES.MODELS),
    path.join(mainPath, DIRECTORIES.SERVICES),
    path.join(mainPath, DIRECTORIES.CONTROLLERS),
    path.join(testPath, DIRECTORIES.REPOSITORIES),
    path.join(testPath, DIRECTORIES.SERVICES),
    path.join(igrpstudioPath, DIRECTORIES.CONTROLLERS),
    path.join(igrpstudioPath, DIRECTORIES.MODELS),
  ];
};

/**
 * Function that saves directories by physically creating them in the file system.
 * @param directories - List of directory paths to create
 */
export const saveAppDirectories = async (directories: string[]) => {
  await Promise.all(directories.map((dir) => fs.mkdirSync(dir, { recursive: true })));
};
