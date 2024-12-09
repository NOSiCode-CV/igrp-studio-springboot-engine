import { PermissionConfig, RenderContext } from "../../interfaces/types";
import { getPermissionConfigPath, loadPermissionConfigs } from "../../utils/helpers";

import fs from 'fs-extra'
import { saveAllPermissions } from "./savePermissions";


export const deletePerm = async (context: RenderContext<PermissionConfig>) => {

  const permissionPath = getPermissionConfigPath(context.resourceConfig.name, context.basePath)
  const permissionsType = await loadPermissionConfigs(context.basePath)

  if (await (fs.pathExists(permissionPath))) {
    console.log(permissionsType)
    
    // await fs.rm(permissionPath, { recursive: true });
    // await saveAllPermissions(context.basePath);
  }

  else throw `Permission '${context.resourceConfig.name}' does not exist.`
}