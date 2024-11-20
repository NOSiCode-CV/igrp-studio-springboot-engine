import fs from 'fs-extra';
import {
  getDDDCommandOutputDir,
  getDDDDataObjectOutputDir,
  getDDDDataTransferObjectOutputDir,
  getDDDDomainEntityOutputDir,
  getDDDEventOutputDir,
  getDDDQueryOutputDir,
  getDDDValueObjectOutputDir,
  getDTOConfigPath,
  getDtoOutputDir,
} from '../../utils/helpers';
import { DTOBaseConfig, DTOConfig, JavaType, RenderContext } from '../../interfaces/types';
import { DIRECTORIES, ERROR_MESSAGE, EXTENSIONS } from '../../utils/constants';
import { getDTOTypes } from './helpers';
import { checkDependencyInDTO } from './checkDependencyInDTO';
import { checkDependencyInModel } from './checkDependencyInModel';
import { checkDependencyInController } from './checkDependencyInController';
import path from 'path';
import { normalizeName } from './saveDTOConfig';

/**
* @param {boolean} force - Delete without checking dependency.
 */
export const deleteDTOConfig = async (context: RenderContext<DTOBaseConfig>, force: boolean) => {

  if (!force) {
    await checkDependencyInDTO(context);
    await checkDependencyInController(context);
  }

  const dtoPath = getDtoFilePath(context);
  const dtoConfigPath = getDTOConfigPath(context.resourceConfig.type, context.resourceConfig.module ?? DIRECTORIES.SHARED, normalizeName(context.resourceConfig.name, context.resourceConfig.type), context.basePath);

  if (await fs.pathExists(dtoPath)) await fs.rm(dtoPath, { recursive: true });
  else throw ERROR_MESSAGE.DTO_FILE_NOT_FOUND;

  if (await fs.pathExists(dtoConfigPath)) await fs.rm(dtoConfigPath, { recursive: true });
  else throw ERROR_MESSAGE.DTO_FILE_CONFIG_NOT_FOUNT;
};

const getDtoFilePath = (context: RenderContext<DTOBaseConfig>) => {
  switch (context.resourceConfig.type) {
    case "dto":
      if(context.baseConfig.projectStructureStyle === 'domain')
        return path.join(getDDDDataTransferObjectOutputDir(context), `${context.resourceConfig.name}DTO${EXTENSIONS.JAVA}`);
      else
        return path.join(getDtoOutputDir(context), `${context.resourceConfig.name}${EXTENSIONS.JAVA}`);
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

