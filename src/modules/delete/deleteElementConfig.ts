import fs from 'fs-extra';
import {
  getControllerConfigPath,
  getControllerDir,
  getDDDControllerDir,
  getDDDDtoOutputDir,
  getDDDModelOutputDir,
  getDTOConfigPath,
  getDtoOutputDir, getModelConfigPath, getModelOutputDir, getResponseConfigPath,
} from '../../utils/helpers';
import { DeleteConfig, RenderContext } from '../../interfaces/types';
import { DIRECTORIES, ERROR_MESSAGE, EXTENSIONS, PROJECT_STRUCTURE_STYLE } from '../../utils/constants';
import { checkDependencyInDTO } from '../dto/checkDependencyInDTO';
import { checkDependencyInController } from '../dto/checkDependencyInController';
import path from 'path';
import { normalizeName } from '../dto/saveDTOConfig';
import { updatePermissions } from '../permission/permissionManagement';

/**
* @param {RenderContext<DeleteConfig>} context - Context for the deletion of configuration.
* @param {boolean} force - Delete without checking dependency.
 */
export const deleteElementConfig = async (context: RenderContext<DeleteConfig>, force: boolean) => {

  if(context.resourceConfig.type === 'dto' || context.resourceConfig.type === 'filter') {

    if (!force) {
      await checkDependencyInDTO(context);
      await checkDependencyInController(context);
    }

    context.resourceConfig.name = normalizeName(context.resourceConfig.name, context.resourceConfig.type)

    const dtoPath = getDtoFilePath(context);
    const dtoConfigPath = getDTOConfigPath(
      context.resourceConfig.type,
      context.resourceConfig.module ?? DIRECTORIES.SHARED,
      context.resourceConfig.name,
      context.basePath,
    );

    if (await fs.pathExists(dtoPath)) await fs.rm(dtoPath, { recursive: true });
    else throw ERROR_MESSAGE.DTO_FILE_NOT_FOUND;

    if (await fs.pathExists(dtoConfigPath)) await fs.rm(dtoConfigPath, { recursive: true });
    else throw ERROR_MESSAGE.DTO_FILE_CONFIG_NOT_FOUNT;

  }

  if(context.resourceConfig.type === 'enum') {
    // TODO: not implemented
  }

  if(context.resourceConfig.type === 'module') {
    // TODO: not implemented
  }

  if(context.resourceConfig.type === 'model') {

    let modelPath;

    if(context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
      modelPath = path.join(getDDDModelOutputDir(context), `${context.resourceConfig.name}.${EXTENSIONS.JAVA}`);
    } else {
      modelPath = getModelOutputDir(context);
    }

    const modelConfigPath = getModelConfigPath(context.resourceConfig.module ?? DIRECTORIES.SHARED, context.resourceConfig.name, context.basePath);

    if (await fs.pathExists(modelPath)) await fs.rm(modelPath, { recursive: true });
    else throw ERROR_MESSAGE.MODEL_FILE_CONFIG_NOT_FOUNT;

    if (await fs.pathExists(modelConfigPath)) await fs.rm(modelConfigPath, { recursive: true });
    else throw ERROR_MESSAGE.MODEL_FILE_CONFIG_NOT_FOUNT;

    await updatePermissions(context.resourceConfig.module ?? DIRECTORIES.SHARED, context.basePath, context.resourceConfig.type);

  }

  if(context.resourceConfig.type === 'controller') {

    let controllerPath;

    if (context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
      controllerPath = path.join(getDDDControllerDir(context), context.resourceConfig.name + "Controller" + EXTENSIONS.JAVA);
      //const aggregatePath = getDDDAggregateRootOutputDir(context);
      //if (await fs.pathExists(aggregatePath)) await fs.rm(aggregatePath, { recursive: true });
      //else throw ERROR_MESSAGE.AGGREGATE_NOT_FOUND;
    } else {
      controllerPath = getControllerDir(context);
    }

    const controllerConfigPath = getControllerConfigPath(context.resourceConfig.module ?? DIRECTORIES.SHARED, context.resourceConfig.name, context.basePath)

    if (await fs.pathExists(controllerPath)) {
      await fs.rm(controllerPath, { recursive: true })
    }
    else throw ERROR_MESSAGE.CONTROLLER_FILE_NOT_FOUND;

    if (await fs.pathExists(controllerConfigPath)) await fs.rm(controllerConfigPath, { recursive: true });
    else throw ERROR_MESSAGE.CONTROLLER_FILE_CONFIG_NOT_FOUND
    await updatePermissions(context.resourceConfig.module ?? DIRECTORIES.SHARED, context.basePath, context.resourceConfig.type)

  }

  if(context.resourceConfig.type === 'response') {

    if (!force) {
      await checkDependencyInDTO(context);
      await checkDependencyInController(context);
    }

    const configPath = getResponseConfigPath(context.resourceConfig.module ?? DIRECTORIES.SHARED, context.resourceConfig.name, context.basePath);

    if (await fs.pathExists(configPath)) await fs.rm(configPath, { recursive: true });
    else throw ERROR_MESSAGE.DTO_FILE_CONFIG_NOT_FOUNT;

    const dtoPath = getDtoFilePath(context);

    if (await fs.pathExists(dtoPath)) await fs.rm(dtoPath, { recursive: true });
    else throw ERROR_MESSAGE.DTO_FILE_NOT_FOUND;

  }

};

const getDtoFilePath = (context: RenderContext<DeleteConfig>) => {
  switch (context.resourceConfig.type) {
    case "dto" :
      if(context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN)
        return path.join(getDDDDtoOutputDir(context), `${context.resourceConfig.name}DTO${EXTENSIONS.JAVA}`);
      else
        return path.join(getDtoOutputDir(context), `${context.resourceConfig.name}DTO${EXTENSIONS.JAVA}`);
    case "response" :
      if(context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN)
        return path.join(getDDDDtoOutputDir(context), `${context.resourceConfig.name}DTO${EXTENSIONS.JAVA}`);
      else
        return path.join(getDtoOutputDir(context), `${context.resourceConfig.name}DTO${EXTENSIONS.JAVA}`);
    case "filter" :
      if(context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN)
        return path.join(getDDDDtoOutputDir(context), `${context.resourceConfig.name}DTO${EXTENSIONS.JAVA}`);
      else
        return path.join(getDtoOutputDir(context), `${context.resourceConfig.name}DTO${EXTENSIONS.JAVA}`);
    default:
      if(context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN)
        return path.join(getDDDDtoOutputDir(context), `${context.resourceConfig.name}DTO${EXTENSIONS.JAVA}`);
      else
        return path.join(getDtoOutputDir(context), `${context.resourceConfig.name}DTO${EXTENSIONS.JAVA}`);
  }
};