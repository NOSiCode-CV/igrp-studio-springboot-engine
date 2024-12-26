import { renderTemplate } from '../common/renderTemplate';
import { saveToFile } from '../common/saveToFile';
import { getDTOTypes } from '../dto/helpers';
import { ControllerAction, ControllerConfig, RenderContext } from '../../interfaces/types';
import {
  DIRECTORIES,
  ERROR_MESSAGE,
  PROJECT_STRUCTURE_STYLE,
  RESPONSE_TYPES,
  TEMPLATES,
} from '../../utils/constants';
import { normalizeControllerName, saveControllerConfig } from './saveControllerConfig';
import { updatePermissions } from '../permission/permissionManagement';
import { getControllerDir, getDDDControllerDir } from '../../utils/helpers';
import path from 'path';

const CONTROLLER_SUFFIX = 'Controller.java';
/**
 *
 * @param context
 */
export const generateController = async (context: RenderContext<ControllerConfig>) => {
  // normalize the name of the DTO
  context.resourceConfig.name = normalizeControllerName(context.resourceConfig.name);

  const controllerOutputPath = getControllerPath(context);

  const controller = await renderController(context);
  const allTypes = await getDtos(context);

  checkAcceptsAndRequestBody(context.resourceConfig.actions);
  await verifyResponseAndRequestBodyTypes(context.resourceConfig.actions, allTypes);

  await saveControllerConfig(context.resourceConfig, context.basePath);

  await saveToFile(controller, controllerOutputPath);

  // Once the controller has been generated, we will assign the necessary permissions to its endpoints.
  // This ensures that the newly created controller has the correct access rights configured
  // for each endpoint based on its defined permissions.
  await updatePermissions(context.resourceConfig.module ?? DIRECTORIES.SHARED, context.basePath, context.resourceConfig.type);
};

const renderController = async (context: RenderContext<ControllerConfig>) => {
  if (!context.resourceConfig) throw ERROR_MESSAGE.INVALID_CONTROLLER_CONFIG;
  return await renderTemplate(TEMPLATES.DOMAIN_CONTROLLER, context);
};

const getControllerPath = (context: RenderContext<ControllerConfig>) => {
  if (context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
    const outputDir = getDDDControllerDir(context);
    context.fullPath = outputDir;
    return path.join(outputDir, `${context.resourceConfig.name}${CONTROLLER_SUFFIX}`);
  } else {
    const outputDir = getControllerDir(context);
    context.fullPath = outputDir;
    return path.join(outputDir, `${context.resourceConfig.name}${CONTROLLER_SUFFIX}`);
  }
};

const getDtos = async (context: RenderContext<ControllerConfig>) => {
  let dtos = [];
  const typesDTOs = await getDTOTypes(
    context.resourceConfig.module ?? DIRECTORIES.SHARED,
    context.basePath,
  );
  for (const dto of typesDTOs.values()) {
    dtos.push(dto.name);
  }
  return [...RESPONSE_TYPES, ...dtos, ...dtos.map((dto) => `List<${dto}>`)];
};

const verifyResponseAndRequestBodyTypes = async (actions: ControllerAction[], types: string[]) => {
  const bodyTypes = types.filter(
    (type) => !type.startsWith('List<') && !['String', 'Integer', 'Boolean'].includes(type),
  );

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
};

const checkAcceptsAndRequestBody = (actions: ControllerAction[]) => {
  /*const method = ['POST', 'PUT', 'PATCH'];
  actions.map((action) => {
    if (method.includes(action.method) && !action.requestBody)
      throw ERROR_MESSAGE.REQUEST_BODY_REQUIRED;

    if (method.includes(action.method) && !action.accepts) throw ERROR_MESSAGE.ACCEPTS_REQUIRED;
  });*/
};
