import path from 'path';

import { renderTemplate } from '../common/renderTemplate';
import { saveToFile } from '../common/saveToFile';
import { getDTOTypes } from '../dto/helpers';
import { RenderContext, ControllerConfig, ControllerAction } from '../../interfaces/types';
import { ERROR_MESSAGE, TEMPLATES, RESPONSE_TYPES } from '../../utils/constants';
import { getControllerDir, extractTypeFromList } from '../../utils/helpers';

const CONTROLLER_SUFFIX = 'Controller.java';
 /**
  * 
  * @param context 
  */
export const generateController = async (context: RenderContext<ControllerConfig>) => {
  const controller = await renderController(context);
  const allTypes = await getDtos(context)
  checkAcceptsAndRequestBody(context.resourceConfig.actions)
  verifyResponseAndRequestBodyTypes(context.resourceConfig.actions, allTypes)
  
  const controllerOutputPath = getControllerPath(context);

  await saveToFile(controller, controllerOutputPath);
};

const renderController = async (context: RenderContext<ControllerConfig>) => {
  if (!context.resourceConfig) throw ERROR_MESSAGE.INVALID_CONTROLLER_CONFIG;

  return await renderTemplate(TEMPLATES.DOMAIN_CONTROLLER, context);
};

const getControllerPath = (context: RenderContext<ControllerConfig>) =>
  path.join(getControllerDir(context), `${context.resourceConfig.name}${CONTROLLER_SUFFIX}`);


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

  const errors: string[] = [];
  for (const action of actions) {
    if (action.requestBody) {
      if (!bodyTypes.includes(action.requestBody) ) {
        errors.push(`Request Body '${action.requestBody}' in action '${action.actionName}' is not valid'.`);
      }
    }
    const responseType = extractTypeFromList(action.response)
    if (responseType) {
      if (!types.includes(responseType)){
        errors.push(`The response type '${responseType}' in action '${action.actionName}' is not valid`)
      }
    } 
  }

  if (errors.length > 0) {
    throw errors.join("\n")
  }
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

