import { DeleteConfig, RenderContext, ResponseConfig } from '../../interfaces/types';
import { getControllerTypes } from "../controller/getControllerTypes";
import { DIRECTORIES } from '../../utils/constants';
import { capitalize } from '../../helper/stringHelper';

export const checkDependencyInController = async function (context: RenderContext<ResponseConfig | DeleteConfig>) {

  const dtoName = context.resourceConfig.name
  /**
   * get all controllers types
   */
  const controllerTypes = await getControllerTypes(context.resourceConfig.module ?? DIRECTORIES.SHARED, context.basePath);
  const errors: Array<{ message: string }> = [];

  for (const controller of controllerTypes.values()) {
    for (const action of controller.actions) {
      if(action.responses)
        for (const response of Object.values(action.responses)) {
          if (response.name === dtoName || response.content["application/json"].schema.type == dtoName || response.content["multipart/form-data"].schema.type == dtoName) {
            errors.push({
              message: `DTO '${dtoName}' is being used as a response in controller '${controller.name}' in action '${action.actionName}'.`,
            });
          }
        }
      if (capitalize(action.actionName) + "Request" === dtoName) {
        errors.push({
          message: `DTO '${dtoName}' is being used as a requestBody in controller '${controller.name}' in action '${action.actionName}'.`,
        });
      }
    }
  }
  if (errors.length > 0) {
    throw errors;
  }
};
