import { ApiConfig, DTOConfig, JavaType, ModelConfig, RenderContext, TypeMetadata } from '../../interfaces/types';
import { renderTemplate } from '../common/renderTemplate';
import { ERROR_MESSAGE, EXTENSIONS, JAVA_TYPES, PACKAGE_NS, PACKAGES, TEMPLATES } from '../../utils/constants';
import { saveToFile } from '../common/saveToFile';
import { getDtoOutputDir, getPackageNameFromConfig } from '../../utils/helpers';
import path from 'path';
import { getModelTypes } from '../model/helpers';
import { getDTOTypes } from './helpers';

export const generateDTO = async (context: RenderContext<DTOConfig>) => {
  const template = await _renderDTO(context);
  const modelOutputPath = getDTOOutputPath(context);


  await saveToFile(template, modelOutputPath);
};

/**
 * Generates the DTO in the API using the provided configuration.
 * WARN: this is for internal use only 
 * @param ontext - The configuration of the DTO including the DTO name and attributes.
 * @returns - A string representing the DTO generated from the template.
 * @throws - Throws an error if the DTO configuration is invalid or has no attributes.
 */
export const _renderDTO = async (context: RenderContext<DTOConfig>) => {

  if (context.resourceConfig.attributes.length === 0) {
    throw ERROR_MESSAGE.EMPTY_ATTRIBUTE;
  }
  const tn = TEMPLATES.DOMAIN_DTO[context.resourceConfig.template];
  if (!tn) {
    throw ERROR_MESSAGE.TEMPLATE_NAME_NOT_REGISTERED;
  }
  return await renderTemplate(tn, context);
};

export const transformDTOConfig = async function (config: DTOConfig, api: ApiConfig, basePath: string): Promise<DTOConfig> {
  const ncfg = structuredClone(config);
  const errors = [];

  let mtypes: Map<string, ModelConfig> | undefined = undefined;
  let dtypes: Map<string, DTOConfig> | undefined = undefined;

  for (const attr of  ncfg.attributes) {
    let type: JavaType;
    if (typeof attr.type === 'string') {
      type = { name: attr.type };
    } else {
      type = attr.type;
    }

    let typeNotFound = false;
    if (attr.ns === PACKAGE_NS.java) {
      const jt:{name: string, primitive: boolean, namespace?:string}|undefined = JAVA_TYPES.get(type.name);
      if (jt) {
        if (!jt.primitive && jt.namespace && jt.namespace != 'java.lang') {
          type.namespace = jt.namespace;
        }
      } else {
        typeNotFound = true;
      }
    } else if (attr.ns === PACKAGE_NS.model){
      if (mtypes === undefined) {
        mtypes = await getModelTypes(basePath);
      }
      const mt = mtypes.get(type.name);
      if (mt) {
        type.namespace = `${getPackageNameFromConfig(api)}.${PACKAGES.MODELS}`;
      } else {
        typeNotFound = true;
      }
      
    } else if (attr.ns === PACKAGE_NS.dto) {
      if (dtypes === undefined) {
        dtypes = await getDTOTypes(basePath);
      }

      const dt = dtypes.get(type.name);
      if (!dt) {
        typeNotFound = true;
      }
    } else {
      typeNotFound = true;
    }

    if (typeNotFound) {
      errors.push({message: `on attribute ${attr.name}, Type ${type.name} not on the allowed '${attr.ns}' list`});
    }

    if (type.generics) {
      for (const gt of type.generics) {
        let typeNotFound = false;
        if (gt.ns === PACKAGE_NS.java) {
          const jt:TypeMetadata|undefined = JAVA_TYPES.get(type.name);
          if (jt) {
            if (!jt.primitive && jt.namespace && jt.namespace != 'java.lang') {
              gt.namespace = jt.namespace;
            }
          } else {
            typeNotFound = true;
          }
        } else if (gt.ns === PACKAGE_NS.model){
          if (mtypes === undefined) {
            mtypes = await getModelTypes(basePath);
          }
          const mt = mtypes.get(type.name);
          if (mt) {
            gt.namespace = `${getPackageNameFromConfig(api)}.${PACKAGES.MODELS}`;
          } else {
            typeNotFound = true;
          }
          
        } else if (gt.ns === PACKAGE_NS.dto) {
          if (dtypes === undefined) {
            dtypes = await getDTOTypes(basePath);
          }

          const dt = dtypes.get(type.name);
          if (!dt) {
            typeNotFound = true;
          }
        } else if (gt.ns === PACKAGE_NS.local) {
          if (!ncfg.generics ||  !ncfg.generics.includes(gt.name)) {
            typeNotFound = true;
          }
        } else {
          typeNotFound = true;
        }

        if (typeNotFound) {
          errors.push({message: `Type ${type.name} not on the allowed '${attr.ns}' list`});
        }
      }
    }

    attr.type = type;
  }

  if (errors.length > 0) {
    throw errors;
  }

  return ncfg;
}


const getDTOOutputPath = (context: RenderContext<DTOConfig>) => 
  path.join(getDtoOutputDir(context), `${context.resourceConfig.name}${EXTENSIONS.JAVA}`)



