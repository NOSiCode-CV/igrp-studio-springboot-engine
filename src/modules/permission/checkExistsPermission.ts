import { ModelConfig, ControllerConfig } from '../../interfaces/types';
import { loadPermissionConfigs } from "../../utils/helpers";

/**
 * Checks if all permissions in a model or controller configuration exist in the permission settings.
 * 
 * @param config - The model or controller configuration to check.
 * @param basepath - The base path where permissions are loaded.
 * @throws {Error} - Throws an error if a permission is missing.
 */
export const checkPermission = async (config: ModelConfig | ControllerConfig, basepath: string) => {
  const permissionsType = await loadPermissionConfigs(basepath)

  // if (config.type === 'controller') {
  //   for (const action of config.actions) {
  //     if (action.permission) {
  //       const exists = permissionsType.some(pt => pt.name === action.permission);
  //       if (!exists) {
  //         throw new Error(`The permission '${action.permission}' in controller '${config.name}' for action '${action.actionName}' does not exist.`);
  //       }
  //     }
  //   }
  // } else if (config.type === 'model' && config.crud?.permissions) {
  //   for (const crudPermission of config.crud.permissions) {
  //     const exists = permissionsType.some(p => p.name === crudPermission.permission);
  //     if (!exists) {
  //       throw new Error(`The permission '${crudPermission.permission}' in model '${config.name}' for method '${crudPermission.method}' does not exist.`);
  //     }
  //   }
  // }
 
}
