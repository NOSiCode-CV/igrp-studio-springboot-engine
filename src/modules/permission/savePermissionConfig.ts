import { saveToFile } from '../common/saveToFile';
import { PermissionConfig } from '../../interfaces/types';
import { getPermissionConfigPath } from '../../utils/helpers'


/**
 * Generates and saves the configuration file of a permission.
 * @param config - Permission configuration.
 * @param basePath - Output directory where the permission configuration file will be saved.
 * @throws Throws an error if the model configuration or output directory is invalid.
 */
export const savePermission = async(config: PermissionConfig, basePath: string) => {
  
  const output = getPermissionConfigPath(config.name, basePath);
   
  await saveToFile(JSON.stringify(config), output);
};

