import path from 'path';
import fs from 'fs-extra';
import { ApiConfig, RenderContext } from '../../interfaces/types';
import { DIRECTORIES } from '../../utils/constants';
import { getMainPath, getTestPath } from '../../utils/helpers';

/**
 * Function that creates the api directories
 * @param config - API base configuration file containning all the basic API information.
 * @param output - Output path where directories are created
 */
export const createAppDirectories = async (context: RenderContext) => {
  const directories = getDirectoriesToCreate(context.baseConfig, context.basePath);
  saveAppDirectories(directories);
};

/**
 * Function that generates a list of directory paths to create based on the configuration and the output path.
 * @param config - API base configuration file containning all the basic API information.
 * @param basePath - Output path where directories will be created
 * @return List of directory paths to create.
 */
const getDirectoriesToCreate = (config: ApiConfig, basePath: string): string[] => {

  const { group, artifact } = config;

  const mainPath = path.join(basePath, getMainPath(group, artifact));
  const testPath = path.join(basePath, getTestPath(group, artifact));
  const igrpstudioPath = path.join(basePath, DIRECTORIES.IGRPSTUDIO);

  return [
    path.join(basePath, DIRECTORIES.RESOURCES),
    
    path.join(mainPath, DIRECTORIES.MODELS),
    path.join(mainPath, DIRECTORIES.SERVICES),
    path.join(mainPath, DIRECTORIES.CONTROLLERS),
    path.join(mainPath, DIRECTORIES.AUDIT_CONFIG),

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
const saveAppDirectories = async (directories: string[]) => {
  await Promise.all(directories.map((dir) => fs.mkdirSync(dir, { recursive: true })));
};
