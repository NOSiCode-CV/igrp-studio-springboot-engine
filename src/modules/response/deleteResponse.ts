import fs from 'fs-extra';
import {
  getDDDCommandOutputDir,
  getDDDDtoOutputDir,
  getDDDEventOutputDir,
  getDDDQueryOutputDir,
  getDtoOutputDir, getResponseConfigPath,
} from '../../utils/helpers';
import { DTOBaseConfig, DTOConfig, RenderContext, ResponseConfig } from '../../interfaces/types';
import { DIRECTORIES, ERROR_MESSAGE, EXTENSIONS, PROJECT_STRUCTURE_STYLE } from '../../utils/constants';
import { checkDependencyInDTO } from './checkDependencyInDTO';
import { checkDependencyInController } from './checkDependencyInController';
import path from 'path';
import { transformSchemaDTOConfig } from './generateSingleResponse';

/**
* @param {boolean} force - Delete without checking dependency.
 */
export const deleteResponseConfig = async (context: RenderContext<ResponseConfig>, force: boolean) => {

  if (!force) {
    await checkDependencyInDTO(context);
    await checkDependencyInController(context);
  }

  const dtoContext: RenderContext<DTOConfig> = {
    baseConfig: context.baseConfig,
    basePath: context.basePath,
    resourceConfig: await transformSchemaDTOConfig(
      context.resourceConfig,
      context.baseConfig,
      context.basePath,
    ),
    fullPath: context.basePath,
  };

  const configPath = getResponseConfigPath(context.resourceConfig.module ?? DIRECTORIES.SHARED, context.resourceConfig.name, context.basePath);

  if (await fs.pathExists(configPath)) await fs.rm(configPath, { recursive: true });
  else throw ERROR_MESSAGE.DTO_FILE_CONFIG_NOT_FOUNT;

  const dtoPath = getDtoFilePath(dtoContext);

  if (await fs.pathExists(dtoPath)) await fs.rm(dtoPath, { recursive: true });
  else throw ERROR_MESSAGE.DTO_FILE_NOT_FOUND;

};

const getDtoFilePath = (context: RenderContext<DTOBaseConfig>) => {
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
    /*case "dataobject":
      return path.join(getDDDDataObjectOutputDir(context), `${context.resourceConfig.name}DO${EXTENSIONS.JAVA}`);*/
    case "command":
      return path.join(getDDDCommandOutputDir(context), `${context.resourceConfig.name}Command${EXTENSIONS.JAVA}`);
    case "query":
      return path.join(getDDDQueryOutputDir(context), `${context.resourceConfig.name}Query${EXTENSIONS.JAVA}`);
    case "event":
      return path.join(getDDDEventOutputDir(context), `${context.resourceConfig.name}Event${EXTENSIONS.JAVA}`);
    /*case "valueobject":
      return path.join(getDDDValueObjectOutputDir(context), `${context.resourceConfig.name}ValueObject${EXTENSIONS.JAVA}`);
    case "domainentity":
      return path.join(getDDDDomainEntityOutputDir(context), `${context.resourceConfig.name}DomainEntity${EXTENSIONS.JAVA}`);*/
  }
};

