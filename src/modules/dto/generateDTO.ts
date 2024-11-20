import { ApiConfig, DTOConfig, JavaType, ModelConfig, RenderContext, TypeMetadata } from '../../interfaces/types';
import { renderTemplate } from '../common/renderTemplate';
import {
  DIRECTORIES,
  ERROR_MESSAGE,
  EXTENSIONS,
  JAVA_TYPES,
  PACKAGE_NS,
  PACKAGES, PROJECT_STRUCTURE_STYLE,
  TEMPLATES,
} from '../../utils/constants';
import { saveToFile } from '../common/saveToFile';
import {
  getDDDCommandOutputDir,
  getDDDDataObjectOutputDir, getDDDDataTransferObjectOutputDir, getDDDDomainEntityOutputDir,
  getDDDDtoOutputDir, getDDDEventOutputDir, getDDDQueryOutputDir, getDDDValueObjectOutputDir,
  getDtoOutputDir,
  getPackageNameFromConfig,
} from '../../utils/helpers';
import path from 'path';
import { getModelTypes } from '../model/helpers';
import { getDTOTypes } from './helpers';
import { normalizeName } from './saveDTOConfig';

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
  let tn;
  
  switch (context.resourceConfig.type) {
    case "dto":
      if(context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN)
        tn = TEMPLATES.DDD_LITE_DTO[context.resourceConfig.template];
      else
        tn = TEMPLATES.DOMAIN_DTO[context.resourceConfig.template];
      break;
    /*case "dataobject":
      tn = TEMPLATES.DDD_DATA_OBJECT_DTO[context.resourceConfig.template];
      break;*/
    case "command":
      tn = TEMPLATES.DDD_LITE_COMMAND[context.resourceConfig.template];
      break;
    case "query":
      tn = TEMPLATES.DDD_LITE_QUERY[context.resourceConfig.template];
      break;
    case "event":
      tn = TEMPLATES.DDD_LITE_EVENT[context.resourceConfig.template];
      break;
    /*case "valueobject":
      tn = TEMPLATES.DDD_VALUE_OBJECT_DTO[context.resourceConfig.template];
      break;
    case "domainentity":
      tn = TEMPLATES.DDD_DOMAIN_ENTITY_DTO[context.resourceConfig.template];
      break;*/
  }
  
  if (!tn) {
    throw ERROR_MESSAGE.TEMPLATE_NAME_NOT_REGISTERED;
  }
  return await renderTemplate(tn, context);
};

export const transformDTOConfig = async function (
  config: DTOConfig,
  api: ApiConfig,
  basePath: string,
): Promise<DTOConfig> {
  const ncfg = structuredClone(config);
  const errors = [];

  let mtypes: Map<string, ModelConfig> | undefined = undefined;
  let dtypes: Map<string, DTOConfig> | undefined = undefined;

  for (const attr of ncfg.attributes) {
    let type: JavaType;
    if (typeof attr.type === 'string') {
      type = { name: attr.type };
    } else {
      type = attr.type;
    }

    let typeNotFound = false;
    if (attr.ns === PACKAGE_NS.java) {
      const jt: { name: string; primitive: boolean; namespace?: string } | undefined =
        JAVA_TYPES.get(type.name);
      if (jt) {
        if (!jt.primitive && jt.namespace && jt.namespace != 'java.lang') {
          type.namespace = jt.namespace;
        }
      } else {
        typeNotFound = true;
      }
    } else if (attr.ns === PACKAGE_NS.model) {
      if (mtypes === undefined) {
        mtypes = await getModelTypes(config.module ?? DIRECTORIES.SHARED, basePath);
      }
      const mt = mtypes.get(type.name);
      if (mt) {
        type.namespace = `${getPackageNameFromConfig(api)}.${PACKAGES.MODELS}`;
      } else {
        typeNotFound = true;
      }
    } else if (attr.ns === PACKAGE_NS.dto) {
      if (dtypes === undefined) {
        dtypes = await getDTOTypes(config.module ?? DIRECTORIES.SHARED, basePath);
      }
      const dt = dtypes.get(type.name);

      if (!dt) {
        typeNotFound = true;
      }
    } else {
      typeNotFound = true;
    }

    if (typeNotFound) {
      errors.push({
        message: `on attribute ${attr.name}, Type ${type.name} not on the allowed '${attr.ns}' list`,
      });
    }

    attr.type = type;
  }

  // normalize the name of the DTO
  ncfg.name = normalizeName(config.name, config.type)

  if (errors.length > 0) {
    throw errors;
  }

  return ncfg;
};

const getDTOOutputPath = (context: RenderContext<DTOConfig>) => {
  if (context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
    switch (context.resourceConfig.type) {
      case "dto":
        return path.join(getDDDDtoOutputDir(context), `${context.resourceConfig.name}DTO${EXTENSIONS.JAVA}`);
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
  } else {
    return path.join(getDtoOutputDir(context), `${context.resourceConfig.name}DTO${EXTENSIONS.JAVA}`);
  }
};


