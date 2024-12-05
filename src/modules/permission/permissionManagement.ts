import { loadControllerConfigs, loadPermissionConfigs } from "../../utils/helpers";
import { savePermission } from "./savePermissionConfig";
import { saveAllPermissions } from "./savePermissions";

/**
 * Assigns the appropriate permissions to an element (model or controller) by adding new endpoints 
 * or removing outdated ones. This function checks the permissions configuration and updates it 
 * according to the specified element's actions or CRUD permissions.
 * 
 * @param element - The element configuration (either a model or a controller) containing details 
 *                  about actions or CRUD permissions.
 * @param basePath - The base path where the permission configurations are stored and will be saved.
 */export const updatePermissions = async (basePath: string) => {
  const permissions = await loadPermissionConfigs(basePath);
  const controllers = await loadControllerConfigs(basePath);

  console.log(controllers)

  // rebuilding the permissions from controller actions
  const updatedPermissions: Record<string, { name: string; endpoints: any[] }> = {};

  // Recorremos todos los controladores y sus acciones para reconstruir permisos
  for (const controller of controllers) {
    for (const action of controller.actions) {
      if (action.permissions && action.permissions.length > 0) {
        for (const permissionName of action.permissions) {

          if (!updatedPermissions[permissionName]) {
            updatedPermissions[permissionName] = {
              name: permissionName,
              endpoints: [],
            };
          }

          updatedPermissions[permissionName].endpoints.push({
            type: 'controller',
            resource: `${controller.name}.${action.actionName}`,
            method: action.method,
            path: `${controller.basePath}/${action.path ? action.path : action.actionName}`,
          });
        }
      }
    }
  }

  // cleaning and saving the updated permissions
  for (const permission of permissions) {
    const updatedPermission = updatedPermissions[permission.name];
    
    if (updatedPermission) {
      permission.endpoints = updatedPermission.endpoints;
    } else {
      permission.endpoints = []; 
    }

    await savePermission(permission, basePath);
  }


  await saveAllPermissions(basePath);
};
