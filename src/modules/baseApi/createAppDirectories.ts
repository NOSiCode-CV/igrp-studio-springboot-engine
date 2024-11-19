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
  const monitoringPath = path.join(basePath, DIRECTORIES.MONITORING);

  const apiPath = path.join(mainPath, DIRECTORIES.API);
  const applicationPath = path.join(mainPath, DIRECTORIES.APPLICATION);
  const queryPath = path.join(applicationPath, DIRECTORIES.QUERY);
  const domainPath = path.join(mainPath, DIRECTORIES.DOMAIN);
  const infraPath = path.join(mainPath, DIRECTORIES.INFRASTRUCTURE);


  if(config.projectStructureStyle === 'domain') {

    const paths = [
      path.join(basePath, DIRECTORIES.RESOURCES),

      path.join(mainPath, DIRECTORIES.API),
      path.join(mainPath, DIRECTORIES.APPLICATION),
      path.join(mainPath, DIRECTORIES.DOMAIN),
      path.join(mainPath, DIRECTORIES.INFRASTRUCTURE),

      path.join(apiPath, DIRECTORIES.CONTROLLER),

      path.join(applicationPath, DIRECTORIES.COMMAND),
      path.join(applicationPath, DIRECTORIES.QUERY),

      path.join(queryPath, DIRECTORIES.ASSEMBLER),
      path.join(queryPath, DIRECTORIES.DTO),

      path.join(domainPath, DIRECTORIES.AGGREGATE),
      path.join(domainPath, DIRECTORIES.EVENT),
      path.join(domainPath, DIRECTORIES.EXCEPTIONS),
      path.join(domainPath, DIRECTORIES.IMPLEMENTATION),
      path.join(domainPath, DIRECTORIES.REPOSITORIES),
      path.join(domainPath, DIRECTORIES.SERVICE),

      path.join(infraPath, DIRECTORIES.CACHE),
      path.join(infraPath, DIRECTORIES.DATABASE),
      path.join(infraPath, DIRECTORIES.SPRING),

      path.join(testPath, DIRECTORIES.REPOSITORIES),
      path.join(testPath, DIRECTORIES.SERVICES),

      path.join(igrpstudioPath, DIRECTORIES.CONTROLLERS),
      path.join(igrpstudioPath, DIRECTORIES.MODELS),
    ];

    if(config.enableObservability)
      paths.push(
        path.join(monitoringPath, DIRECTORIES.COLLECTOR),
        path.join(monitoringPath, DIRECTORIES.PROMETHEUS),
        path.join(monitoringPath, DIRECTORIES.PROMETHEUS),
        path.join(monitoringPath, DIRECTORIES.PROMTAIL),
        path.join(monitoringPath, DIRECTORIES.TEMPO),
      )

    return paths

  } else {

    const paths = [
      path.join(basePath, DIRECTORIES.RESOURCES),

      path.join(mainPath, DIRECTORIES.MODELS),
      path.join(mainPath, DIRECTORIES.SERVICES),
      path.join(mainPath, DIRECTORIES.CONTROLLERS),
      path.join(mainPath, DIRECTORIES.AUDIT_CONFIG),
      path.join(mainPath, DIRECTORIES.SECURITY),

      path.join(testPath, DIRECTORIES.REPOSITORIES),
      path.join(testPath, DIRECTORIES.SERVICES),

      path.join(igrpstudioPath, DIRECTORIES.CONTROLLERS),
      path.join(igrpstudioPath, DIRECTORIES.MODELS),

    ];

    if(config.enableObservability)
      paths.push(
        path.join(monitoringPath, DIRECTORIES.COLLECTOR),
        path.join(monitoringPath, DIRECTORIES.PROMETHEUS),
        path.join(monitoringPath, DIRECTORIES.PROMETHEUS),
        path.join(monitoringPath, DIRECTORIES.PROMTAIL),
        path.join(monitoringPath, DIRECTORIES.TEMPO),
      )

    return paths

  }

};

/**
 * Function that saves directories by physically creating them in the file system.
 * @param directories - List of directory paths to create
 */
const saveAppDirectories = async (directories: string[]) => {
  await Promise.all(directories.map((dir) => fs.mkdirSync(dir, { recursive: true })));
};
