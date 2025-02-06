import {
  ApiConfig,
  DTOConfig,
  EnumConfig,
  JavaType,
  ModelConfig,
  RenderContext,
  TypeMetadata,
} from '../../interfaces/types';
import { renderTemplate } from '../common/renderTemplate';
import {
  DIRECTORIES,
  ERROR_MESSAGE,
  EXTENSIONS, GENERIC_TYPES,
  PACKAGE_NS,
  PACKAGES, PROJECT_STRUCTURE_STYLE,
  TEMPLATES,
} from '../../utils/constants';
import { saveToFile } from '../common/saveToFile';
import {
  getDDDCommandOutputDir,
  getDDDDtoOutputDir, getDDDEventOutputDir, getDDDQueryOutputDir, getDtoOutputDir,
  getPackageNameFromConfig,
} from '../../utils/helpers';
import path from 'path';
import { getModelTypes } from '../model/helpers';
import { getDTOTypes } from './helpers';
import { normalizeName } from './saveDTOConfig';
import { capitalize } from '../../utils/capitalizeStrings';
import { getEnumTypes } from '../enum/helpers';

export const generateDTO = async (context: RenderContext<DTOConfig>) => {
  const modelOutputPath = getDTOOutputPath(context);
  const template = await _renderDTO(context);

  await saveToFile(template, modelOutputPath, true, DIRECTORIES.DTO, context.resourceConfig.id, context.resourceConfig.module, context.basePath);
};

/**
 * Generates the DTO in the API using the provided configuration.
 * WARN: this is for internal use only 
 * @param context - The configuration of the DTO including the DTO name and attributes.
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
    case "response":
      if(context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN)
        tn = TEMPLATES.DDD_LITE_DTO[context.resourceConfig.template];
      else
        tn = TEMPLATES.DOMAIN_DTO[context.resourceConfig.template];
      break;
    case "filter":
      if(context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN)
        tn = TEMPLATES.DDD_LITE_FILTER;
      else
        tn = TEMPLATES.DOMAIN_FILTER;
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
  let etypes: Map<string, EnumConfig> | undefined = undefined;

  for (const attr of ncfg.attributes) {
    let type: JavaType;
    type = { name: attr.type };

    let typeNotFound = false;
    if (attr.objectType === PACKAGE_NS.java) {
      const jtOpt: { java: { name: string, primitive: boolean, namespace?: string }, dotnet: { name: string, primitive: boolean, namespace?: string }, python: { name: string, primitive: boolean, namespace?: string }, kotlin: { name: string, primitive: boolean, namespace?: string } } | undefined =
        GENERIC_TYPES.get(type.name)
      if (jtOpt) {
        const jt = jtOpt.java;
        if (!jt.primitive && jt.namespace && jt.namespace != 'java.lang') {
          type.namespace = jt.namespace;
        }
      } else {
        typeNotFound = true;
      }
    } else if (attr.objectType === PACKAGE_NS.model) {
      if (mtypes === undefined) {
        mtypes = await getModelTypes(config.module ?? DIRECTORIES.SHARED, basePath);
      }
      const mt = mtypes.get(type.name);
      if (mt) {
        if(api.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN){
          type.namespace = `${getPackageNameFromConfig(api)}.${config.module ?? DIRECTORIES.SHARED}.domain.${PACKAGES.MODELS}`;
        } else {
          type.namespace = `${getPackageNameFromConfig(api)}.${PACKAGES.MODELS}`;
        }
      } else {
        typeNotFound = true;
      }
    } else if (attr.objectType === PACKAGE_NS.dto) {
      if (dtypes === undefined) {
        dtypes = await getDTOTypes(config.module ?? DIRECTORIES.SHARED, basePath);
      }

      const dt = dtypes.get(type.name);

      if (!dt) {
        dtypes = await getDTOTypes(DIRECTORIES.SHARED, basePath);
        const dtype = dtypes.get(type.name);
        if(!dtype) {
            typeNotFound = true;
        }
      }

      if(!typeNotFound) {
        if(api.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN){
          type.namespace = `${getPackageNameFromConfig(api)}.${config.module ?? DIRECTORIES.SHARED}.application.${PACKAGES.DTO}`;
        } else {
          type.namespace = `${getPackageNameFromConfig(api)}.${PACKAGES.DTO}`;
        }
      }

    } else if (attr.objectType === PACKAGE_NS.enum) {
      if (etypes === undefined) {
        etypes = await getEnumTypes(config.module ?? DIRECTORIES.SHARED, basePath);
      }

      const et = etypes.get(type.name);

      if (!et) {
        etypes = await getEnumTypes(DIRECTORIES.SHARED, basePath);
        const etype = etypes.get(type.name);
        if(!etype) {
          typeNotFound = true;
        }
      }

      if(!typeNotFound) {
        if(api.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN){
          type.namespace = `${getPackageNameFromConfig(api)}.${config.module ?? DIRECTORIES.SHARED}.application.${PACKAGES.CONSTANTS}`;
        } else {
          type.namespace = `${getPackageNameFromConfig(api)}.${PACKAGES.CONSTANTS}`;
        }
      }

    } else {
      typeNotFound = true;
    }

    if (typeNotFound) {
      errors.push({
        message: `on attribute ${attr.name}, Type ${type.name} not on the allowed '${attr.objectType}' list`,
      });
    }

    attr.type = type.name;
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
      case "dto": {
        const outputDir = getDDDDtoOutputDir(context)
        context.fullPath = outputDir
        return path.join(
          outputDir,
          `${context.resourceConfig.name}DTO${EXTENSIONS.JAVA}`,
        );
      }
      case "response": {
        const outputDir = getDDDDtoOutputDir(context)
        context.fullPath = outputDir
        return path.join(
          outputDir,
          `${context.resourceConfig.name}DTO${EXTENSIONS.JAVA}`,
        );
      }
      case "filter": {
        const outputDir = getDDDDtoOutputDir(context)
        context.fullPath = outputDir
        return path.join(
          outputDir,
          `${context.resourceConfig.name}DTO${EXTENSIONS.JAVA}`,
        );
      }
      /*case "dataobject":
        return path.join(getDDDDataObjectOutputDir(context), `${context.resourceConfig.name}DO${EXTENSIONS.JAVA}`);*/
      case "command": {
        const outputDir = getDDDCommandOutputDir(context);
        context.fullPath = outputDir
        return path.join(
          outputDir,
          `${context.resourceConfig.name}Command${EXTENSIONS.JAVA}`,
        );
      }
      case "query": {
        const outputDir = getDDDQueryOutputDir(context);
        context.fullPath = outputDir
        return path.join(
          outputDir,
          `${context.resourceConfig.name}Query${EXTENSIONS.JAVA}`,
        );
      }
      case "event": {
        const outputDir = getDDDEventOutputDir(context);
        context.fullPath = outputDir
        return path.join(
          outputDir,
          `${context.resourceConfig.name}Event${EXTENSIONS.JAVA}`,
        );
      }
      /*case "valueobject":
        return path.join(getDDDValueObjectOutputDir(context), `${context.resourceConfig.name}ValueObject${EXTENSIONS.JAVA}`);
      case "domainentity":
        return path.join(getDDDDomainEntityOutputDir(context), `${context.resourceConfig.name}DomainEntity${EXTENSIONS.JAVA}`);*/
    }
  } else {
    const outputDir = getDtoOutputDir(context);
    context.fullPath = outputDir
    return path.join(outputDir, `${context.resourceConfig.name}DTO${EXTENSIONS.JAVA}`);
  }
};