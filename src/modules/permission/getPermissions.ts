import { ISelectPermissions, PermissionConfig } from "../../interfaces/types";
import { loadPermissionConfigs } from "../../utils/helpers";


export const getAllPermissions = async(basePath: string) => {
  const permissionsType = await loadPermissionConfigs(basePath);
  const selectPermissions: ISelectPermissions[] = []
  permissionsType.map((p: PermissionConfig) => {
    selectPermissions.push({
      label: p.name.charAt(0).toUpperCase() + p.name.slice(1),
      value: p.name
    })
  })

  return selectPermissions;
}
