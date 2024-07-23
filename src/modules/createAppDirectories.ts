import path from 'path';
import fs from 'fs-extra';
import { OUTPUT_DIR, DIRECTORY, SUCCESS_MESSAGE, ERROR_MESSAGE } from '../utils/constants';
import { apiconfig } from '../interfaces/types';


export const createDir = async(api: apiconfig): Promise<string> => {

  // building paths to directories
  const mainDir: string = DIRECTORY.MAIN_DIR(api);
  const outpathdir: string = path.join(OUTPUT_DIR, mainDir);
  const resourcDir: string = path.resolve(outpathdir, '../../');
  const testDir: string = path.join(OUTPUT_DIR, DIRECTORY.TEST_DIR(api));
  const igrpstudioDir: string = path.join(OUTPUT_DIR, DIRECTORY.IGRPSTUDIO_DIR(api.apiName));

  // list directories to create
  const dirsToCreate: string [] = [
    path.join(outpathdir, 'models'),
    path.join(outpathdir, 'services'),
    path.join(outpathdir, 'controllers'),

    path.join(resourcDir, 'resources'),

    path.join(testDir, 'repositories'),
    path.join(testDir, 'services'),

    path.join(igrpstudioDir, 'controllers'),
    path.join(igrpstudioDir, 'models'),

    
  ]

  try {
    await Promise.all(dirsToCreate.map(fs.ensureDir))
    return SUCCESS_MESSAGE.CREATED_DIRECTORY
  } catch (error) {
    return ERROR_MESSAGE.ERROR_CREATING_DIRECTORY
  }
}


const api: apiconfig = {
  apiName: 'rest-api',
  group: 'nosi',
  artifact: 'igrp'
}

createDir(api)
  .then(res => console.log(res))
  .catch(error => console.log(error))