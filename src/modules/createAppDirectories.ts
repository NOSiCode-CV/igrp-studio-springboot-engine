import path from 'path';
import fs from 'fs-extra';
import { saveFiles } from './saveFile';
import { ApiConfig } from '../interfaces/types';
import { DIRECTORIES, ERROR_MESSAGE } from '../utils/constants';
import { checkIfDirectoryIsEmpty } from '../utils/checkFiles';

export const createAppDir = async (config: ApiConfig, outputDir: string) => {
  const mainPath = path.join(outputDir, DIRECTORIES.MAIN(config));
  const resourcePath = path.join(outputDir, DIRECTORIES.RESOURCES);
  const testPath = path.join(outputDir, DIRECTORIES.TEST(config));
  const igrpstudioPath = path.join(outputDir, DIRECTORIES.IGRPSTUDIO);

  const dirsToCreate = [
    resourcePath,
    path.join(mainPath, DIRECTORIES.MODELS),
    path.join(mainPath, DIRECTORIES.SERVICES),
    path.join(mainPath, DIRECTORIES.CONTROLLERS),
    path.join(testPath, DIRECTORIES.REPOSITORIES),
    path.join(testPath, DIRECTORIES.SERVICES),
    path.join(igrpstudioPath, DIRECTORIES.CONTROLLERS),
    path.join(igrpstudioPath, DIRECTORIES.MODELS),
  ];

  await Promise.all(dirsToCreate.map((dir) => fs.mkdirSync(dir, { recursive: true })));
  await saveFiles(config, outputDir);
};
