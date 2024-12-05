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
  const output = getControllerConfigPath(config.name, basePath);
  await saveToFile(JSON.stringify(config), output);
};
