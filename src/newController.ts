import path from 'path';
import fs from 'fs-extra';

import { getControllerPath, getMainPath } from './utils/helpers';
import { readJsonFile } from './utils/readJsonFiles';
import { ControllerConfig, RenderContext } from './interfaces/types';
import { saveToFile } from './modules/common/saveToFile';
import { DIRECTORIES, ERROR_MESSAGE, EXTENSIONS } from './utils/constants';
import { controllerGenerator } from './modules/controller/controllerResourceGenerator';
import { controllerInterfaceGenerator } from './modules/controller/controllerInterfaceGenerator';
import { getBaseApiConfig } from './modules/baseApi/getBaseApiConfig';
import { SaveControllerConfig } from './modules/controller/newControllerConfig';

const ICONTROLLER_SUFFIX = 'Service.java';
const CONTROLLER_SUFFIX = 'Controller.java';

export const newController = async (config: ControllerConfig, basePath: string) => {
  if (!config || !config.name) throw ERROR_MESSAGE.INVALID_CONTROLLER_CONFIG;

  if (!basePath || !(await fs.pathExists(basePath))) throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;

  const baseConfig = await getBaseApiConfig(basePath);
  await SaveControllerConfig(config, basePath);

  const context: RenderContext<ControllerConfig> = {
    config,
    basePath,
    baseConfig,
  };

  const template = await controllerGenerator(context);
  const controllerInterface = await controllerInterfaceGenerator(context);

  const controllerOutputPath = getControllerPath(
    basePath,
    baseConfig.group,
    baseConfig.artifact,
    config.name,
  );

  await fs.mkdir(controllerOutputPath, { recursive: true });

  await saveToFile(
    controllerInterface,
    path.join(controllerOutputPath, `${config.name}${ICONTROLLER_SUFFIX}`),
  );

  await saveToFile(template, path.join(controllerOutputPath, `${config.name}${CONTROLLER_SUFFIX}`));
};
