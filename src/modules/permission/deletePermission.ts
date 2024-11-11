import { PermissionConfig, RenderContext } from "../../interfaces/types";
import { getPermissionConfigPath } from "../../utils/helpers";
import { checkUsageInController } from "./checkUsageInController";
import { checkUsageInModel } from "./checkUsageInModel";

import fs from 'fs-extra'
import { saveAllPermissions } from "./savePermissions";


export const deletePerm = async (context: RenderContext<PermissionConfig>) => {

  const permissionPath = getPermissionConfigPath(context.resourceConfig.name, context.basePath)

  if (await (fs.pathExists(permissionPath))) {
    await checkUsageInController(context)
    await checkUsageInModel(context)
    
    await fs.rm(permissionPath, { recursive: true });
    await saveAllPermissions(context.basePath);
  }

  else throw `Permission '${context.resourceConfig.name}' does not exist.`
}