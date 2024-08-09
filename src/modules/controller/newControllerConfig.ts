import fs from 'fs-extra';
import { ERROR_MESSAGE } from '../../utils/constants';
import { saveToFile } from '../common/saveToFile';
import { getControllerConfigPath } from '../../utils/helpers';
import { ControllerConfig } from '../../interfaces/types';

/**
 *
* @param config - Controller configuration.
 * @param basePath - Output directory where the controller configuration file will be saved.
 * @throws Throws an error if the model configuration or output directory is invalid.
 */
export const SaveControllerConfig = async (config: ControllerConfig, basePath: string) => {
  if (!config) throw ERROR_MESSAGE.INVALID_CONTROLLER_CONFIG;

  if (!basePath || !(await fs.pathExists(basePath))) throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;

  const output = getControllerConfigPath(config.name, basePath);
  await saveToFile(JSON.stringify(config), output);
};
