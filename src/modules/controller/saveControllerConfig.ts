import { DIRECTORIES, EXTENSIONS } from '../../utils/constants';
import { saveToFile } from '../common/saveToFile';
import { getControllerConfigPath } from '../../utils/helpers';
import { ControllerConfig } from '../../interfaces/types';

/**
 *
* @param config - Controller configuration.
 * @param basePath - Output directory where the controller configuration file will be saved.
 * @throws Throws an error if the model configuration or output directory is invalid.
 */
export const saveControllerConfig = async (config: ControllerConfig, basePath: string) => {
  const output = getControllerConfigPath(config.module ?? DIRECTORIES.SHARED, normalizeControllerName(config.name), basePath);
  await saveToFile(JSON.stringify(config), output, true, DIRECTORIES.CONFIG_CONTROLLER, config.id, config.module, basePath, EXTENSIONS.JSON);
};

export const normalizeControllerName = (name: string) => name.replace(/controller$/i, "");