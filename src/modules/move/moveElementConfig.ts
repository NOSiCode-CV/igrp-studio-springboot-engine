import {
  loadDTOConfig, loadEnumConfig, loadModelConfig, loadResponseConfig, replaceTemplate,
} from '../../utils/helpers';
import {
  DeleteConfig,
  DTOConfig,
  EnumConfig,
  ModelConfig,
  MoveConfig,
  RenderContext,
  ResponseConfig,
} from '../../interfaces/types';
import { DIRECTORIES } from '../../utils/constants';
import { checkDependencyInDTO } from '../dto/checkDependencyInDTO';
import { checkDependencyInController } from '../dto/checkDependencyInController';
import { checkDependencyInDTO as checkDTODependencyEnum } from '../enum/checkDependencyInDTO';
import { checkDependencyInController as checkControllerDependencyEnum } from '../enum/checkDependencyInController';
import { checkDependencyInModel as checkModelDependencyEnum } from '../enum/checkDependencyInModel';
import { checkDependencyInDTO as checkDTODependencyResponse } from '../response/checkDependencyInDTO';
import { checkDependencyInController as checkControllerDependencyResponse } from '../response/checkDependencyInController';
import { checkDependencyInModel as checkModelDependencyModel } from '../model/checkDependencyInModel';
import path from 'path';
import { normalizeName } from '../dto/saveDTOConfig';
import { addDTO, addEnum, addModel, addResponse, deleteElement } from '../../index';

/**
* @param {RenderContext<MoveConfig>} context - Context for the deletion of configuration.
* @param {boolean} force - Delete without checking dependency.
 */
export const moveElementConfig = async (context: RenderContext<MoveConfig>, force: boolean) => {

  const deleteConfig: DeleteConfig = {
    name: context.resourceConfig.name,
    module: context.resourceConfig.sourceModule,
    type: context.resourceConfig.type
  }

  const deleteContext: RenderContext<DeleteConfig> = {
    ...context,
    resourceConfig: deleteConfig
  }

  const module = context.resourceConfig.sourceModule

  if(context.resourceConfig.type === 'dto' || context.resourceConfig.type === 'filter') {

    if (!force) {
      await checkDependencyInDTO(deleteContext);
      await checkDependencyInController(deleteContext);
    }

    context.resourceConfig.name = normalizeName(context.resourceConfig.name, context.resourceConfig.type)

    const element: DTOConfig = await loadDTOConfig(
      context.resourceConfig.type,
      path.join(context.basePath, replaceTemplate(DIRECTORIES.CONFIG_DTO, { module })),
      context.resourceConfig.name,
    );

    element.module = context.resourceConfig.destinationModule

    await addDTO(element, context.basePath)

    await deleteElement(deleteConfig, context.basePath)

  }

  if(context.resourceConfig.type === 'enum') {

    if(!force) {
      await checkDTODependencyEnum(deleteContext)
      await checkModelDependencyEnum(deleteContext)
      await checkControllerDependencyEnum(deleteContext)
    }

    const element: EnumConfig = await loadEnumConfig(
      path.join(context.basePath, replaceTemplate(DIRECTORIES.CONFIG_ENUM, { module })),
      context.resourceConfig.name,
    );

    element.module = context.resourceConfig.destinationModule

    await addEnum(element, context.basePath)

    await deleteElement(deleteConfig, context.basePath)

  }

  if(context.resourceConfig.type === 'model') {

    if(!force) {
      await checkModelDependencyModel(deleteContext)
    }

    const element: ModelConfig = await loadModelConfig(
      path.join(context.basePath, replaceTemplate(DIRECTORIES.CONFIG_MODEL, { module })),
      context.resourceConfig.name,
    );

    element.module = context.resourceConfig.destinationModule

    await addModel(element, context.basePath)

    await deleteElement(deleteConfig, context.basePath)

  }

  if(context.resourceConfig.type === 'response') {

    if (!force) {
      await checkDTODependencyResponse(deleteContext);
      await checkControllerDependencyResponse(deleteContext);
    }

    const element: ResponseConfig = await loadResponseConfig(
      context.resourceConfig.type,
      path.join(context.basePath, replaceTemplate(DIRECTORIES.CONFIG_RESPONSE, { module })),
      context.resourceConfig.name,
    );

    element.module = context.resourceConfig.destinationModule

    await addResponse(element, context.basePath)

    await deleteElement(deleteConfig, context.basePath)

  }

};