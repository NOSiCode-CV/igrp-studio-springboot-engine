import path from 'path';
import { loadPermissionConfigs } from '../../utils/helpers';
import { saveToFile } from '../common/saveToFile';
import { DIRECTORIES } from '../../utils/constants';

/**
 * Saves all permission configurations to a single file.
 * @param basePath - The base path where the permission configurations are stored.
 */
export const saveAllPermissions = async (basePath: string) => {
  // Load all permission configurations from the specified base path.
  const permissions = await loadPermissionConfigs(basePath);

  const output = path.join(basePath, DIRECTORIES.IGRPSTUDIO, 'permissions.json');

  await saveToFile(JSON.stringify(permissions), output);
};