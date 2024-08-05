import path from 'path';
import fs from 'fs-extra';
import { ApiConfig } from '../../interfaces/types';
import { DIRECTORIES, ERROR_MESSAGE } from '../../utils/constants';
import { getMainPath, getTestPath } from '../../utils/helpers';

export const createAppDirectories = async (config: ApiConfig, output: string) => {
  const directories = getDirectoriesToCreate(config, output);
  saveAppDirectories(directories);
}

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

export const saveAppDirectories = async (directories: string[]) => {
  await Promise.all(directories.map((dir) => fs.mkdirSync(dir, { recursive: true })));
}
