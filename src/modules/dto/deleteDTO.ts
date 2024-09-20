import fs from 'fs-extra';
import { getDTOConfigPath, getDtoOutputDir } from '../../utils/helpers';
import { DTOBaseConfig, DTOConfig, RenderContext } from '../../interfaces/types';
import { ERROR_MESSAGE } from '../../utils/constants';
import { Exception } from 'sass';

/**
* @param {boolean} force - Delete without checking dependency.
 */
export const deleteDTOConfig = async (context: RenderContext<DTOBaseConfig>, force: boolean) => {

  if (!force) {
    //TODO check dependencies
    throw "Soft delete DTO Not implemented yet.";
  }

  const dtoPath = getDtoOutputDir(context);
  const dtoConfigPath = getDTOConfigPath(context.resourceConfig.name, context.basePath);

  if (await fs.pathExists(dtoPath)) await fs.rm(dtoPath, { recursive: true });
  else throw ERROR_MESSAGE.DTO_FILE_CONFIG_NOT_FOUNT;

  if (await fs.pathExists(dtoConfigPath)) await fs.rm(dtoConfigPath, { recursive: true });
  else throw ERROR_MESSAGE.DTO_FILE_CONFIG_NOT_FOUNT;
};
