import path from 'path';
import fs from 'fs-extra';
import { ModuleConfig, RenderContext } from '../../interfaces/types';
import { DIRECTORIES, PROJECT_STRUCTURE_STYLE } from '../../utils/constants';
import { getMainPath, normalizePackageName } from '../../utils/helpers';

/**
 * Function that creates the api directories
 * @param context - API base configuration containing all the basic API information.
 */
export const createModuleDirectory = async (context: RenderContext<ModuleConfig>) => {
  const directories = getDirectoriesToCreate(context);
  await saveModuleDirectory(directories);
};

/**
 * Function that generates a list of directory paths to create based on the configuration and the output path.
 * @param context - API base configuration containing all the basic API information.
 * @return List of directory paths to create.
 */
const getDirectoriesToCreate = (context: RenderContext<ModuleConfig>): string[] => {

  context.resourceConfig.name = normalizePackageName(context.resourceConfig.name).toLowerCase();

  const { group, packageName } = context.baseConfig;
  const basePath = context.basePath;

  const mainPath = path.join(basePath, getMainPath(group, packageName));
  const igrpstudioPath = path.join(basePath, DIRECTORIES.IGRPSTUDIO);

  const modulePath = path.join(mainPath, context.resourceConfig.name);
  const applicationPath = path.join(modulePath, DIRECTORIES.APPLICATION);
  const commandPath = path.join(applicationPath, DIRECTORIES.COMMANDS);
  const queryPath = path.join(applicationPath, DIRECTORIES.QUERIES);
  const domainPath = path.join(modulePath, DIRECTORIES.DOMAIN);
  const eventPath = path.join(domainPath, DIRECTORIES.EVENTS);
  const infraPath = path.join(modulePath, DIRECTORIES.INFRASTRUCTURE);
  const igrpSharedPath = path.join(igrpstudioPath, context.resourceConfig.name);

  if (context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
    return [
      igrpSharedPath,
      path.join(igrpSharedPath, DIRECTORIES.CONTROLLERS),
      path.join(igrpSharedPath, DIRECTORIES.MODELS),
      path.join(igrpSharedPath, DIRECTORIES.DTO),

      modulePath,

      applicationPath,
      path.join(applicationPath, DIRECTORIES.DTO),

      domainPath,

      infraPath,
      path.join(infraPath, DIRECTORIES.REPOSITORIES),

      commandPath,
      queryPath,

      eventPath,

      path.join(domainPath, DIRECTORIES.MODELS),
      path.join(domainPath, DIRECTORIES.REPOSITORY),
      path.join(domainPath, DIRECTORIES.SERVICE),

      path.join(infraPath, DIRECTORIES.CONTROLLER),
      path.join(infraPath, DIRECTORIES.MESSAGING),
      path.join(infraPath, DIRECTORIES.PERSISTENCE),
      path.join(infraPath, DIRECTORIES.PERSISTENCE, DIRECTORIES.ENTITY),
      path.join(infraPath, DIRECTORIES.PERSISTENCE, DIRECTORIES.REPOSITORY),
    ];
  }
    return [
      igrpSharedPath,
      path.join(igrpSharedPath, DIRECTORIES.CONTROLLERS),
      path.join(igrpSharedPath, DIRECTORIES.MODELS),
      path.join(igrpSharedPath, DIRECTORIES.DTO),

      path.join(mainPath, DIRECTORIES.MODELS),
      path.join(mainPath, DIRECTORIES.SERVICES),
      path.join(mainPath, DIRECTORIES.CONTROLLERS),
      path.join(mainPath, DIRECTORIES.AUDIT_CONFIG),
      path.join(mainPath, DIRECTORIES.SECURITY),
    ];
};

/**
 * Function that saves directories by physically creating them in the file system.
 * @param directories - List of directory paths to create
 */
const saveModuleDirectory = async (directories: string[]) => {
  await Promise.all(directories.map((dir) => fs.mkdirSync(dir, { recursive: true })));
};
