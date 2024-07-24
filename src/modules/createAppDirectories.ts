import path from 'path';
import fs from 'fs-extra';
import { OUTPUT_DIR, DIRECTORIES, SUCCESS_MESSAGE, ERROR_MESSAGE } from '../utils/constants';
import { ApiConfig } from '../interfaces/types';
import { saveFileConfig } from './saveFile';
import { checkIfDirectoryIsEmpty } from '../utils/checkFileType';

export const createDir = async (api: ApiConfig, outputDir: string) => {
  if (!api || !api.apiName || !api.group || !api.artifact) {
    throw ERROR_MESSAGE.INVALID_API_CONFIG;
  }

  if (!(await checkIfDirectoryIsEmpty(outputDir))) {
    throw ERROR_MESSAGE.DIRECTORY_ALREADY_IN_USE;
  }

  const mainPath = path.join(outputDir, DIRECTORIES.MAIN(api));
  const resourcePath = path.join(outputDir, DIRECTORIES.RESOURCES);
  const testPath = path.join(outputDir, DIRECTORIES.TEST(api));
  const igrpstudioPath = path.join(outputDir, DIRECTORIES.IGRPSTUDIO);

  const dirsToCreate: string[] = [
    path.join(mainPath, 'models'),
    path.join(mainPath, 'services'),
    path.join(mainPath, 'controllers'),
    path.join(resourcePath, 'resources'),
    path.join(testPath, 'repositories'),
    path.join(testPath, 'services'),
    path.join(igrpstudioPath, 'controllers'),
    path.join(igrpstudioPath, 'models'),
  ];

  await Promise.all(dirsToCreate.map(fs.ensureDir));
  await saveFileConfig(api, outputDir);
  
};

const api: ApiConfig = {
  type: 'baseApi',
  apiName: 'rest-api',
  group: 'nosi',
  artifact: 'igrp',
};

createDir(api, OUTPUT_DIR);
