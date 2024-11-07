import { PermissionConfig, RenderContext } from "../../interfaces/types";
import { getPermissionConfigPath } from "../../utils/helpers";
import { checkUsageInController } from "./checkUsageInController";
import { checkUsageInModel } from "./checkUsageInModel";

import fs from 'fs-extra'


export const deletePermission = async (context: RenderContext<PermissionConfig>) => {

  const permissionPath = getPermissionConfigPath(context.resourceConfig.name, context.basePath)

  if (await (fs.pathExists(permissionPath))) {
    await checkUsageInController(context)
    await checkUsageInModel(context)
    
    await fs.rm(permissionPath, { recursive: true });
  }

  else throw `Permission '${context.resourceConfig.name}' does not exist.`
}