import path from 'path';
import fs from 'fs-extra';
import { ApiConfig } from '../interfaces/types';
import { DIRECTORIES, ERROR_MESSAGE } from '../utils/constants';

export const createAppDirectories = async (config: ApiConfig, output: string) => {
  const directories = getDirectoriesToCreate(config, output);
  saveAppDirectories(directories);
}

const getDirectoriesToCreate = (config: ApiConfig, output: string): string[] => {
  if (!config || !config.group || !config.artifact) {
    throw ERROR_MESSAGE.INVALID_API_CONFIG;
  }

  if (!output) {
    throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;
  }
  
  const { group, artifact } = config;

  const mainPath = path.join(output, DIRECTORIES.MAIN(group, artifact));
  const resourcePath = path.join(output, DIRECTORIES.RESOURCES);
  const testPath = path.join(output, DIRECTORIES.TEST(group, artifact));
  const igrpstudioPath = path.join(output, DIRECTORIES.IGRPSTUDIO);

  return [
    resourcePath,
    path.join(mainPath, DIRECTORIES.MODELS),
    path.join(mainPath, DIRECTORIES.SERVICES),
    path.join(mainPath, DIRECTORIES.CONTROLLERS),
    path.join(testPath, DIRECTORIES.REPOSITORIES),
    path.join(testPath, DIRECTORIES.SERVICES),
    path.join(igrpstudioPath, DIRECTORIES.CONTROLLERS),
    path.join(igrpstudioPath, DIRECTORIES.MODELS),
  ];
};

// TODO: Tests to implement on getDirectoriesToCreate:

// null config
// config missing a parameter
// config complete with expected output (list of directories)

const saveAppDirectories = async (directories: string[]) => {
  await Promise.all(directories.map((dir) => fs.mkdirSync(dir, { recursive: true })));
}

// TODO: Tests to implement on saveAppDirectories:
// create .testfiles
// verify .testfiles is created
// delete .testfiles

// create .testfiles/test1
// verify .testfiles is created
// verify .testfiles/test1 is created
// delete .testfiles

// create .testfiles/test1
// create .testfiles
// verify .testfiles/test1 still exists (.testfiles did not overwrite)
// delete .testfiles

