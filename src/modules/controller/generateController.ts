import path from 'path';

import { renderTemplate } from '../common/renderTemplate';
import { saveToFile } from '../common/saveToFile';
import { getDTOTypes } from '../dto/helpers';
import { RenderContext, ControllerConfig, ControllerAction } from '../../interfaces/types';
import { ERROR_MESSAGE, TEMPLATES, RESPONSE_TYPES } from '../../utils/constants';
import { getControllerDir, extractTypeFromList, getDDDControllerDir } from '../../utils/helpers';
import { assignPermission } from '../permission/permissionManagement';
import { checkPermission } from '../permission/checkExistsPermission';
import { saveControllerConfig } from './saveControllerConfig';
import { saveAllPermissions } from '../permission/savePermissions';

const CONTROLLER_SUFFIX = 'Controller.java';
 /**
  * 
  * @param context 
  */
export const generateController = async (context: RenderContext<ControllerConfig>) => {
  const controller = await renderController(context);
  const allTypes = await getDtos(context)

  checkAcceptsAndRequestBody(context.resourceConfig.actions)
  await verifyResponseAndRequestBodyTypes(context.resourceConfig.actions, allTypes)
  await checkPermission(context.resourceConfig, context.basePath)
  
  const controllerOutputPath = getControllerPath(context);

  await saveControllerConfig(context.resourceConfig, context.basePath);

  await saveToFile(controller, controllerOutputPath);

  // Once the controller has been generated, we will assign the necessary permissions to its endpoints.
  // This ensures that the newly created controller has the correct access rights configured 
  // for each endpoint based on its defined permissions.
  await assignPermission(context.resourceConfig, context.basePath);

  // Save all permissions to a single file
  await saveAllPermissions(context.basePath);
};

const renderController = async (context: RenderContext<ControllerConfig>) => {
  if (!context.resourceConfig) throw ERROR_MESSAGE.INVALID_CONTROLLER_CONFIG;

  return await renderTemplate(TEMPLATES.DOMAIN_CONTROLLER, context);
};

const getControllerPath = (context: RenderContext<ControllerConfig>) => {
  if(context.baseConfig.projectStructureStyle === 'domain')
    return path.join(getDDDControllerDir(context), `${context.resourceConfig.name}${CONTROLLER_SUFFIX}`);
  else
    return path.join(getControllerDir(context), `${context.resourceConfig.name}${CONTROLLER_SUFFIX}`);
};


const getDtos = async(context: RenderContext<ControllerConfig>) => {
  let dtos = []
  const typesDTOs = await getDTOTypes(context.basePath);
  for (const dto of typesDTOs.values()) {
    dtos.push(dto.name)
  }
  const TYPES = [...RESPONSE_TYPES, ...dtos, ...dtos.map(dto=> `List<${dto}>`)]
  return TYPES
}

const verifyResponseAndRequestBodyTypes = async (actions: ControllerAction[], types: string[]) => {
  const bodyTypes = types.filter(type => !type.startsWith("List<") && !["String","Integer", "Boolean"].includes(type))

  /*for (const action of actions) {
    if (action.requestBody) 
      if (!bodyTypes.includes(action.requestBody) )
        throw `Request Body '${action.requestBody}' in action '${action.actionName}' is not valid'.`
    
    const responseType = extractTypeFromList(action.response)
    if (responseType)
      if (!types.includes(responseType)){
        throw `The response type '${responseType}' in action '${action.actionName}' is not valid`
      }
  }*/
}

const checkAcceptsAndRequestBody = (actions: ControllerAction[]) => {
  const method = ['POST', 'PUT', 'PATCH']
  actions.map(action => {
    if (method.includes(action.method) && !action.requestBody)
      throw ERROR_MESSAGE.REQUEST_BODY_REQUIRED
    
    if (method.includes(action.method) && !action.accepts)
      throw ERROR_MESSAGE.ACCEPTS_REQUIRED
  })
}

