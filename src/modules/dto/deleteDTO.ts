import fs from 'fs-extra';
import { getDTOConfigPath, getDtoOutputDir } from '../../utils/helpers';
import { DTOBaseConfig, DTOConfig, JavaType, RenderContext } from '../../interfaces/types';
import { ERROR_MESSAGE } from '../../utils/constants';
import { getDTOTypes } from './helpers';

/**
* @param {boolean} force - Delete without checking dependency.
 */
export const deleteDTOConfig = async (context: RenderContext<DTOBaseConfig>, force: boolean) => {

  if (!force) {
    await checkDependencyInDTO(context);
    await checkDependencyInModel(context);
    await checkDependencyInController(context);
  }

  const dtoPath = getDtoOutputDir(context);
  const dtoConfigPath = getDTOConfigPath(context.resourceConfig.name, context.basePath);

  if (await fs.pathExists(dtoPath)) await fs.rm(dtoPath, { recursive: true });
  else throw ERROR_MESSAGE.DTO_FILE_CONFIG_NOT_FOUNT;

  if (await fs.pathExists(dtoConfigPath)) await fs.rm(dtoConfigPath, { recursive: true });
  else throw ERROR_MESSAGE.DTO_FILE_CONFIG_NOT_FOUNT;
};


const checkDependencyInDTO = async function(context: RenderContext<DTOBaseConfig>) {
  const types = await getDTOTypes(context.basePath);
  const cfg = context.resourceConfig;
  types.delete(cfg.name);
  const errors: Array<{message: string}> = [];
  for(const t of types.values()) {
    t.attributes.map(attr => {
      if (attr.ns === 'dto') {
        let type: JavaType;
        if (typeof attr.type === 'string') {
          type = { name: attr.type };
        } else {
          type = attr.type;
        }

        if (type.name === cfg.name) {
          errors.push({message: `'dto.${cfg.name}' is beeing used in 'dto.${t.name}' on attribute line '${attr.name}'.`});
        }

        if (type.generics) {
          for(const gt of type.generics) {
            if (gt.ns === 'dto' && gt.name === cfg.name) {
              errors.push({message: `'dto.${cfg.name}' is beeing used as generic type on 'dto.${t.name}' on attribute line '${attr.name}'.`});
            }
          }
        }
      }
    })
  }

  if (errors.length > 0) {
    throw errors;
  }
}

const checkDependencyInModel = async function(context: RenderContext<DTOBaseConfig>) {
  //TODO implement this when there is dependency specification on Model
}

const checkDependencyInController = async function(context: RenderContext<DTOBaseConfig>) {
  //TODO implement this when there is dependency specification on Model
}