
import { loadControllerConfigs, loadPermissionConfigs, loadModelConfigs } from "../../utils/helpers";
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
 */export const updatePermissions = async (module: string, basePath: string, type: 'model' | 'controller') => {
  const permissions = await loadPermissionConfigs(basePath);
  const controllers = await loadControllerConfigs(module, basePath);
  const models = await loadModelConfigs(module, basePath);

  // rebuilding the permissions from controller actions
  const updatedPermissions: Record<string, { name: string; endpoints: any[] }> = {};

  // Recorremos todos los controladores y sus acciones para reconstruir permisos
  if (type === 'controller') {
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
      const modelPermissions = permission.endpoints.filter(m => m.type === 'model')
      
      if (updatedPermission) {
        permission.endpoints = updatedPermission.endpoints.concat(modelPermissions);
  
      } else {
        permission.endpoints = modelPermissions; 
      }
  
      await savePermission(permission, basePath);
    }
  } /*else {
    if (type === 'model') {

      for (const model of models) {
        if (model.crud && model.crud.permissions && model.crud.permissions.length > 0)
        for (const p of model.crud.permissions) {
          for (const permissionName of p.permissions) {
            
              if (!updatedPermissions[permissionName]) {
                updatedPermissions[permissionName] = {
                  name: permissionName,
                  endpoints: [],
                };
              }
              updatedPermissions[permissionName].endpoints.push({
                type: 'model',
                resource: model.name,
                method: p.method,
                path: model.crud.path,
              });
              
          }
        }
      }

      // cleaning and saving the updated permissions
      for (const permission of permissions) {
        const updatedPermission = updatedPermissions[permission.name];
        const controllerPermissions = permission.endpoints.filter(m => m.type === 'controller')
        
        if (updatedPermission) {
          permission.endpoints = updatedPermission.endpoints.concat(controllerPermissions);

        } else {
          permission.endpoints = controllerPermissions; 
        }
        
        await savePermission(permission, basePath);
      }
    }
  }*/

  await saveAllPermissions(basePath);
};
