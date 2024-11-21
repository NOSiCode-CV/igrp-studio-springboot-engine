import path from 'path';
import fs from 'fs-extra';
import { ApiConfig, RenderContext } from '../../interfaces/types';
import { DIRECTORIES, PROJECT_STRUCTURE_STYLE } from '../../utils/constants';
import { getTestPath } from '../../utils/helpers';

/**
 * Function that creates the api directories
 * @param config - API base configuration file containning all the basic API information.
 * @param output - Output path where directories are created
 */
export const createTestDirectories = async (context: RenderContext) => {
  const directories = getDirectoriesToCreate(context.baseConfig, context.basePath);
  await saveTestDirectories(directories);
};

/**
 * Function that generates a list of directory paths to create based on the configuration and the output path.
 * @param config - API base configuration file containning all the basic API information.
 * @param basePath - Output path where directories will be created
 * @return List of directory paths to create.
 */
const getDirectoriesToCreate = (config: ApiConfig, basePath: string): string[] => {

  const { group, artifact } = config;

  const testPath = path.join(basePath, getTestPath(group, artifact));

  const sharedPath = path.join(testPath, DIRECTORIES.SHARED);
  const applicationPath = path.join(sharedPath, DIRECTORIES.APPLICATION);
  const commandPath = path.join(applicationPath, DIRECTORIES.COMMANDS);
  const queryPath = path.join(applicationPath, DIRECTORIES.QUERIES);
  const domainPath = path.join(sharedPath, DIRECTORIES.DOMAIN);
  const eventPath = path.join(domainPath, DIRECTORIES.EVENTS);
  const infraPath = path.join(sharedPath, DIRECTORIES.INFRASTRUCTURE);

  if(config.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {

    const paths = [

      path.join(basePath, DIRECTORIES.RESOURCES),

      sharedPath,

      applicationPath,
      domainPath,
      infraPath,

      commandPath,
      queryPath,

      path.join(commandPath, DIRECTORIES.COMMANDS),
      path.join(commandPath, DIRECTORIES.HANDLERS),
      path.join(queryPath, DIRECTORIES.QUERIES),
      path.join(queryPath, DIRECTORIES.HANDLERS),

      path.join(applicationPath, DIRECTORIES.DTO),

      eventPath,

      path.join(eventPath, DIRECTORIES.EVENTS),
      path.join(eventPath, DIRECTORIES.HANDLERS),

      path.join(domainPath, DIRECTORIES.MODELS),
      path.join(domainPath, DIRECTORIES.REPOSITORY),
      path.join(domainPath, DIRECTORIES.SERVICE),

      path.join(infraPath, DIRECTORIES.CONTROLLER),
      path.join(infraPath, DIRECTORIES.MESSAGING),
      path.join(infraPath, DIRECTORIES.PERSISTENCE),

    ];

    return paths

  } else {

    const paths = [
      path.join(basePath, DIRECTORIES.RESOURCES),

      path.join(testPath, DIRECTORIES.MODELS),
      path.join(testPath, DIRECTORIES.SERVICES),
      path.join(testPath, DIRECTORIES.CONTROLLERS),
      path.join(testPath, DIRECTORIES.AUDIT_CONFIG),
      path.join(testPath, DIRECTORIES.SECURITY),

      path.join(testPath, DIRECTORIES.REPOSITORIES),
      path.join(testPath, DIRECTORIES.SERVICES),

    ];

    return paths

  }

};

/**
 * Function that saves directories by physically creating them in the file system.
 * @param directories - List of directory paths to create
 */
const saveTestDirectories = async (directories: string[]) => {
  await Promise.all(directories.map((dir) => fs.mkdirSync(dir, { recursive: true })));
};
