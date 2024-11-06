import { ControllerConfig, IEndpoint, ModelConfig, PermissionConfig } from "../../interfaces/types";
import { loadPermissionConfigs } from "../../utils/helpers";
import { savePermission } from "./savePermissionConfig";



export const assignPermission = async (element: ModelConfig | ControllerConfig, basePath: string) => {

  const permissions = await loadPermissionConfigs(basePath);

  if (element.type === 'controller' && permissions.length > 0) {
    for (const action of element.actions) {
      const permission = permissions.find(p => p.name === action.permission);

      const resource = `${element.name}.${action.actionName}`;

      if (permission) {
        const newEndpoint = {
          type: 'controller',
          resource,
          method: action.method,
          path: `${element.basePath}/${action.path ? action.path : action.actionName}`
        };

        if (addEndpointIfNotExists(permission, newEndpoint)) {
          await savePermission(permission, basePath);
        } 

        for (const perm of permissions) {
          await removeEndpointIfNoPermission(perm, element,basePath)        
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

const removeEndpointIfNoPermission = async (permission: PermissionConfig, element: ControllerConfig, basePath: string) => {
  let endpointsUpdated = false; 

  // Filtrar endpoints que deben permanecer
  permission.endpoints = permission.endpoints.filter(en => {
    const action = element.actions.find(a => `${element.name}.${a.actionName}` === en.resource);
    
    if (action && (!action.permission || action.permission !== permission.name)) {
      endpointsUpdated = true;
      return false; 
    }
    return true;
  });

  if (endpointsUpdated) {
    await savePermission(permission, basePath);
  }
};
