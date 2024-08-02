import path from 'path';
import fs from 'fs-extra';
import { ControllerConfig } from './interfaces/types';
import { controllerConfigGenerator } from './modules/controller/controllerConfigGenrator';
import { DIRECTORIES, ERROR_MESSAGE } from './utils/constants';
import { getControllerConfigPath } from './utils/helpers';
import { saveTemplate } from './modules/common/saveTemplate';

export const newControllerConfig = async (config: ControllerConfig, output: string) => {
  if (!config) throw ERROR_MESSAGE.INVALID_CONTROLLER_CONFIG;

  if (!output || !(await fs.pathExists(output))) throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;

  try {
    const baseApiPath = path.join(output, DIRECTORIES.BASE_API);
    
    if (!(await fs.pathExists(baseApiPath))){
      throw ERROR_MESSAGE.BASE_API_NOT_FOUND;
    }

    const baseApi = await fs.readJSON(baseApiPath);
    const { group, artifact } = baseApi;

    if (!group || !artifact) {
      throw ERROR_MESSAGE.INVALID_API_CONFIG;
    }

    config.package = `${group}.${artifact}`
    
  } catch (error) {
    throw error;
  }

  const outputDir = getControllerConfigPath(config.name, output);
  const controller = await controllerConfigGenerator(config);

  await saveTemplate(controller, outputDir);

};
