import { ControllerConfig, IEndpoint, ModelConfig, PermissionConfig } from "../../interfaces/types";
import { ERROR_MESSAGE } from "../../utils/constants";
import { loadPermissionConfigs } from "../../utils/helpers";
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
 */
export const assignPermission = async (element: ModelConfig | ControllerConfig, basePath: string) => {
  const permissions = await loadPermissionConfigs(basePath);

  if (permissions.length > 0) {
    if (element.type === 'controller') {
      for (const p of permissions) {
        let flag = false;

        for (const action of element.actions) {
          if (action.permissions && action.permissions.length > 0) {
            for (const ap of action.permissions) {
              if (ap === p.name) {
                const resource = `${element.name}.${action.actionName}`;

                // Check if the endpoint already exists
                const exists = p.endpoints.some(ep => ep.resource === resource);

                if (!exists) {
                  flag = true;
                  p.endpoints.push({
                    type: 'controller',
                    resource,
                    method: action.method,
                    path: `${element.basePath}/${action.path ? action.path : action.actionName}`,
                  });
                }
              }
            }
          }
        }
        if (flag) {
          await savePermission(p, basePath);
        }
      }
    }else {
      if (element.type === 'model') {
        if(element.crud && element.crud.permissions && element.crud.permissions.length > 0)
        for (const p of permissions) {
          let flag = false;
          for (const cp of element.crud.permissions) {
            if(cp.permission === p.name) {
              const resource = element.name;
              
            }
          }          
        }
      }
    }
  }
};


// Check if an endpoint already exists and add it if it is not duplicated
const addEndpointIfNotExists = (permission: PermissionConfig, endpoint: IEndpoint) => {
  const exists = permission.endpoints.some(e =>
    e.resource === endpoint.resource &&
    e.method === endpoint.method &&
    e.path === endpoint.path
  );

  if (!exists) {
    permission.endpoints = permission.endpoints || [];
    permission.endpoints.push(endpoint);
    return true;
  }

  // return false if the permission already exist
  return false; 
};


/**
 * Removes controller-related endpoints from the permission if the specified controller action 
 * lacks a matching permission. This function is typically called when creating or deleting a 
 * controller entity to ensure permissions are up-to-date.
 * 
 * @param permission - The permission configuration object to update.
 * @param element - The controller configuration, which includes actions and associated permissions.
 * @param basePath - The base path where the updated permission configuration will be saved.
 */
// const removeControllerEndpointIfNoPermission = async (permission: PermissionConfig, element: ControllerConfig, basePath: string) => {
//   let endpointsUpdated = false; 
  
//   permission.endpoints = permission.endpoints.filter(en => {
//     const action = element.actions.find(a => `${element.name}.${a.actionName}` === en.resource);
    
//       if (action && (!action.permissions || action.permission !== permission.name)) {
//         endpointsUpdated = true;
//         return false; 
//       }
//       return true;
//   });

//   if (endpointsUpdated) {
//     await savePermission(permission, basePath);
//   }
// };

/**
 * Removes model-related endpoints from the permission if they do not have a matching permission. 
 * This function is generally called when creating or deleting a model entity to keep the permissions 
 * configuration consistent.
 * 
 * @param permission - The permission configuration object to update.
 * @param element - The model configuration, which includes CRUD permissions for various actions.
 * @param basePath - The base path where the updated permission configuration will be saved.
 */
const removeModelEndpointIfNoPermission = async (permission: PermissionConfig, element: ModelConfig, basePath: string) => {
  permission.endpoints = permission.endpoints.filter(e =>
    (e.resource === element.name &&
     element.crud?.permissions?.some(cp => cp.permission === permission.name && e.method === cp.method)) ||
    (e.type === 'controller')
  );
  await savePermission(permission, basePath);
};