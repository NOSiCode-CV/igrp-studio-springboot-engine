import path from 'path';
import fs from 'fs-extra';

import { getMainPath } from './utils/helpers';
import { readJsonFile } from './utils/readJsonFiles';
import { ControllerConfig } from './interfaces/types';
import { saveTemplate } from './modules/common/saveTemplate';
import { DIRECTORIES, ERROR_MESSAGE, EXTENSIONS } from './utils/constants';
import { controllerGenerator } from './modules/controller/controllerResourceGenerator';
import { controllerInterfaceGenerator } from './modules/controller/controllerInterfaceGenerator';

const ICONTROLLER_SUFFIX = 'Service.java';
const CONTROLLER_SUFFIX = 'Controller.java'

export const newController = async (config: ControllerConfig, output: string) => {
  if (!config || !config.name) throw ERROR_MESSAGE.INVALID_CONTROLLER_CONFIG;

  if (!output || !(await fs.pathExists(output))) throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;

  const controller = config.name;
  const configFilePath = path.join(
    output,
    DIRECTORIES.CONFIG_CONTROLLER,
    `${controller}${EXTENSIONS.JSON}`,
  );

  if (!(await fs.pathExists(configFilePath))) throw ERROR_MESSAGE.CONTROLLER_FILE_CONFIG_NOT_FOUND;

  const file: ControllerConfig = await readJsonFile(configFilePath);

  const template = await controllerGenerator(file);
  const controllerInterface = await controllerInterfaceGenerator(file);

  const packageName = file.package?.split('.');
  const [group, artifact] = [...packageName!];

  const controllerOutputPath = path.join(
    output,
    getMainPath(group, artifact),
    DIRECTORIES.CONTROLLERS,
    controller,
  );

  await fs.mkdir(controllerOutputPath, { recursive: true });

  await saveTemplate(
    controllerInterface,
    path.join(controllerOutputPath, `${controller}${ICONTROLLER_SUFFIX}`),
  );

  await saveTemplate(template, path.join(controllerOutputPath, `${controller}${CONTROLLER_SUFFIX}`));
};
