import fs from 'fs-extra';
import {
  getControllerConfigPath,
  getControllerDir,
  getDDDControllerDir,
  getDDDDtoOutputDir, getDDDEnumOutputDir,
  getDDDModelOutputDir,
  getDTOConfigPath,
  getDtoOutputDir, getEnumConfigPath, getEnumOutputDir, getModelConfigPath, getModelOutputDir, getResponseConfigPath,
} from '../../utils/helpers';
import { DeleteConfig, RenderContext } from '../../interfaces/types';
import { DIRECTORIES, ERROR_MESSAGE, EXTENSIONS, PROJECT_STRUCTURE_STYLE } from '../../utils/constants';
import { checkDependencyInDTO } from '../dto/checkDependencyInDTO';
import { checkDependencyInController } from '../dto/checkDependencyInController';
import { checkDependencyInDTO as checkDTODependencyEnum } from '../enum/checkDependencyInDTO';
import { checkDependencyInController as checkControllerDependencyEnum } from '../enum/checkDependencyInController';
import { checkDependencyInModel as checkModelDependencyEnum } from '../enum/checkDependencyInModel';
import { checkDependencyInDTO as checkDTODependencyResponse } from '../response/checkDependencyInDTO';
import { checkDependencyInController as checkControllerDependencyResponse } from '../response/checkDependencyInController';
import { checkDependencyInModel as checkModelDependencyModel, checkRelationReferences } from '../model/checkDependencyInModel';
import path from 'path';
import { normalizeName } from '../dto/saveDTOConfig';
import { updatePermissions } from '../permission/permissionManagement';

/**
* @param {RenderContext<DeleteConfig>} context - Context for the deletion of configuration.
* @param {boolean} force - Delete without checking dependency.
 */
export const deleteElementConfig = async (context: RenderContext<DeleteConfig>, force: boolean) => {

  if (context.resourceConfig.type === 'dto' || context.resourceConfig.type === 'filter') {

    if (!force) {
      await checkDependencyInDTO(context);
      await checkDependencyInController(context);
    }

    context.resourceConfig.name = normalizeName(context.resourceConfig.name, context.resourceConfig.type)

    const dtoPath = getFilePath(context);
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

  if (context.resourceConfig.type === 'enum') {

    if (!force) {
      await checkDTODependencyEnum(context)
      await checkModelDependencyEnum(context)
      await checkControllerDependencyEnum(context)
    }

    const enumPath = getFilePath(context);
    const enumConfigPath = getEnumConfigPath(
      context.basePath,
      context.resourceConfig.module ?? DIRECTORIES.SHARED,
      context.resourceConfig.name
    );

    if (await fs.pathExists(enumPath)) await fs.rm(enumPath, { recursive: true });
    else throw ERROR_MESSAGE.ENUM_FILE_NOT_FOUND;

    if (await fs.pathExists(enumConfigPath)) await fs.rm(enumConfigPath, { recursive: true });
    else throw ERROR_MESSAGE.ENUM_FILE_CONFIG_NOT_FOUNT;
  }

  if (context.resourceConfig.type === 'module') {
    // TODO: not implemented
  }

  if (context.resourceConfig.type === 'model') {

    if (!force) {
      await checkModelDependencyModel(context)
      await checkRelationReferences(context);
    }

    let modelPath;

    if (context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
      modelPath = path.join(getDDDModelOutputDir(context), `${context.resourceConfig.name}${EXTENSIONS.JAVA}`);
    } else {
      modelPath = getModelOutputDir(context);
    }

    if (await fs.pathExists(modelPath)) await fs.rm(modelPath, { recursive: true });
    else throw ERROR_MESSAGE.MODEL_FILE_CONFIG_NOT_FOUNT;

    const modelConfigPath = getModelConfigPath(context.resourceConfig.module ?? DIRECTORIES.SHARED, context.resourceConfig.name, context.basePath);

    if (await fs.pathExists(modelConfigPath)) await fs.rm(modelConfigPath, { recursive: true });
    else throw ERROR_MESSAGE.MODEL_FILE_CONFIG_NOT_FOUNT;

    await updatePermissions(context.resourceConfig.module ?? DIRECTORIES.SHARED, context.basePath, context.resourceConfig.type);

  }

  if (context.resourceConfig.type === 'controller') {

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

  if (context.resourceConfig.type === 'response') {

    if (!force) {
      await checkDTODependencyResponse(context);
      await checkControllerDependencyResponse(context);
    }

    const configPath = getResponseConfigPath(context.resourceConfig.module ?? DIRECTORIES.SHARED, context.resourceConfig.name, context.basePath);

    if (await fs.pathExists(configPath)) await fs.rm(configPath, { recursive: true });
    else throw ERROR_MESSAGE.DTO_FILE_CONFIG_NOT_FOUNT;

    const dtoPath = getFilePath(context);

    if (await fs.pathExists(dtoPath)) await fs.rm(dtoPath, { recursive: true });
    else throw ERROR_MESSAGE.DTO_FILE_NOT_FOUND;

  }

};

const getFilePath = (context: RenderContext<DeleteConfig>) => {
  switch (context.resourceConfig.type) {
    case "dto":
      if (context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN)
        return path.join(getDDDDtoOutputDir(context), `${context.resourceConfig.name}DTO${EXTENSIONS.JAVA}`);
      else
        return path.join(getDtoOutputDir(context), `${context.resourceConfig.name}DTO${EXTENSIONS.JAVA}`);
    case "response":
      if (context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN)
        return path.join(getDDDDtoOutputDir(context), `${context.resourceConfig.name}DTO${EXTENSIONS.JAVA}`);
      else
        return path.join(getDtoOutputDir(context), `${context.resourceConfig.name}DTO${EXTENSIONS.JAVA}`);
    case "filter":
      if (context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN)
        return path.join(getDDDDtoOutputDir(context), `${context.resourceConfig.name}DTO${EXTENSIONS.JAVA}`);
      else
        return path.join(getDtoOutputDir(context), `${context.resourceConfig.name}DTO${EXTENSIONS.JAVA}`);
    case "enum":
      if (context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN)
        return path.join(getDDDEnumOutputDir(context), `${context.resourceConfig.name}${EXTENSIONS.JAVA}`);
      else
        return path.join(getEnumOutputDir(context), `${context.resourceConfig.name}${EXTENSIONS.JAVA}`);
    default:
      if (context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN)
        return path.join(getDDDDtoOutputDir(context), `${context.resourceConfig.name}DTO${EXTENSIONS.JAVA}`);
      else
        return path.join(getDtoOutputDir(context), `${context.resourceConfig.name}DTO${EXTENSIONS.JAVA}`);
  }
};