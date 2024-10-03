import fs from 'fs-extra';
import { getDTOConfigPath, getDtoOutputDir } from '../../utils/helpers';
import { DTOBaseConfig, DTOConfig, JavaType, RenderContext } from '../../interfaces/types';
import { ERROR_MESSAGE, EXTENSIONS } from '../../utils/constants';
import { getDTOTypes } from './helpers';
import { checkDependencyInDTO } from './checkDependencyInDTO';
import { checkDependencyInModel } from './checkDependencyInModel';
import { checkDependencyInController } from './checkDependencyInController';
import path from 'path';

/**
* @param {boolean} force - Delete without checking dependency.
 */
export const deleteDTOConfig = async (context: RenderContext<DTOBaseConfig>, force: boolean) => {

  if (!force) {
    await checkDependencyInDTO(context);
    await checkDependencyInController(context);
  }

  const dtoPath = getDtoFilePath(context);
  const dtoConfigPath = getDTOConfigPath(context.resourceConfig.name, context.basePath);

  if (await fs.pathExists(dtoPath)) await fs.rm(dtoPath, { recursive: true });
  else throw ERROR_MESSAGE.DTO_FILE_NOT_FOUND;

  if (await fs.pathExists(dtoConfigPath)) await fs.rm(dtoConfigPath, { recursive: true });
  else throw ERROR_MESSAGE.DTO_FILE_CONFIG_NOT_FOUNT;
};

const getDtoFilePath = (context: RenderContext<DTOBaseConfig>) =>
  path.join(getDtoOutputDir(context), `${context.resourceConfig.name}${EXTENSIONS.JAVA}`)

