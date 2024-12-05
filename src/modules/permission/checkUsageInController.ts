import { PermissionConfig, RenderContext } from "../../interfaces/types";
import { getControllerTypes } from "../controller/getControllerTypes";




export const checkUsageInController = async function (context: RenderContext<PermissionConfig>) {

  const permissionName = context.resourceConfig.name

  const controllerTypes = await getControllerTypes(context.basePath); 

  // for (const controller of controllerTypes.values()) {
  //   for (const action of controller.actions) {
  //     if (action.permission) {
  //       if(action.permission === permissionName) {
  //         throw `The Permission '${permissionName}' cannot be deleted because it is currently in use by the controller '${controller.name}' for the action '${action.actionName}'`;
  //       }
  //     }
  //   }
  // }
};