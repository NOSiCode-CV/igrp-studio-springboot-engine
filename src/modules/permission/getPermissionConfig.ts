import { loadPermissionConfigs } from '../../utils/helpers';

/**
 * 
 * @param basePath 
 * @returns 
 */
export const getPermissionConfig = async(basePath: string) => {  
  return await loadPermissionConfigs(basePath);
}