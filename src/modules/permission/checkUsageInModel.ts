import { RenderContext, PermissionConfig } from '../../interfaces/types';
import { getModelTypes } from '../model/helpers';

export const checkUsageInModel = async function (context: RenderContext<PermissionConfig>) {
  const permissionName = context.resourceConfig.name;
  const modelTypes = await getModelTypes(context.basePath);

  for (const model of modelTypes.values()) {
    if (model.crud?.permissions) {
      if (model.crud.permissions.length > 0) {
        for (const p of model.crud.permissions) {
          if (p.permission === permissionName) {
            throw `The Permission '${permissionName}' cannot be deleted because it is currently in use by the model '${model.name}' for the method '${p.method}'`;
          }
        }
      }
    }
  }
};
