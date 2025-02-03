import {
  ApiConfig, Body,
  DTOConfig,
  JavaType,
  ModelConfig,
  RenderContext, ResponseConfig,
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
  getDDDDtoOutputDir, getDtoOutputDir,
  getPackageNameFromConfig,
} from '../../utils/helpers';
import path from 'path';
import { getModelTypes } from '../model/helpers';
import { getDTOTypes } from '../dto/helpers';
import { normalizeName } from '../dto/saveDTOConfig';
import { capitalize } from '../../utils/capitalizeStrings';

export const generateSingleResponse = async (context: RenderContext<ResponseConfig>) => {

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

      const modelOutputPath = getDTOOutputPath(dtoContext, context);
      const template = await _renderDTO(context);

      await saveToFile(template, modelOutputPath);

};

/**
 * Generates the DTO in the API using the provided configuration.
 * WARN: this is for internal use only 
 * @param context - The configuration of the DTO including the DTO name and attributes.
 * @returns - A string representing the DTO generated from the template.
 * @throws - Throws an error if the DTO configuration is invalid or has no attributes.
 */
export const _renderDTO = async (context: RenderContext<ResponseConfig>) => {

  if (Object.entries(context.resourceConfig.content).length === 0) {
    throw ERROR_MESSAGE.EMPTY_ATTRIBUTE;
  }
  let tn;

  if(context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN)
    tn = TEMPLATES.DDD_RESPONSE_DTO[context.resourceConfig.template];
  else
    tn = TEMPLATES.DOMAIN_RESPONSE[context.resourceConfig.template];
  
  if (!tn) {
    throw ERROR_MESSAGE.TEMPLATE_NAME_NOT_REGISTERED;
  }
  return await renderTemplate(tn, context);
};

export const transformSchemaDTOConfig = async function(
  config: Body,
  api: ApiConfig,
  basePath: string,
): Promise<DTOConfig> {

  const bodyCfg = structuredClone(config);
  const ncfg: DTOConfig = {
    type: 'response',
    name: capitalize(bodyCfg.name),
    template: 'classic',
    module: bodyCfg.module,
    attributes: []
  };
  const schemacfg = bodyCfg.content["application/json"].schema
  const errors = [];

  let mtypes: Map<string, ModelConfig> | undefined = undefined;
  let dtypes: Map<string, DTOConfig> | undefined = undefined;

  for (const [key, attr] of Object.entries(schemacfg.properties ?? {})) {
    let type: JavaType;
    type = { name: attr.type };

    let typeNotFound = false;
    if (attr.objectType === PACKAGE_NS.model) {
      if (mtypes === undefined) {
        mtypes = await getModelTypes(bodyCfg.module ?? DIRECTORIES.SHARED, basePath);
      }
      const mt = mtypes.get(attr.type!);
      if (mt) {
        if(api.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN){
          type.namespace = `${getPackageNameFromConfig(api)}.${bodyCfg.module ?? DIRECTORIES.SHARED}.domain.${PACKAGES.MODELS}`;
        } else {
          type.namespace = `${getPackageNameFromConfig(api)}.${PACKAGES.MODELS}`;
        }
      } else {
        typeNotFound = true;
      }
    } else if (attr.objectType === PACKAGE_NS.dto) {
      if (dtypes === undefined) {
        dtypes = await getDTOTypes(bodyCfg.module ?? DIRECTORIES.SHARED, basePath);
      }

      const dt = dtypes.get(attr.type!);

      if (!dt) {
        dtypes = await getDTOTypes(DIRECTORIES.SHARED, basePath);
        const dtype = dtypes.get(attr.type!);
        if(!dtype) {
            typeNotFound = true;
        }
      }

      if(!typeNotFound) {
        if(api.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN){
          type.namespace = `${getPackageNameFromConfig(api)}.${bodyCfg.module ?? DIRECTORIES.SHARED}.application.${PACKAGES.DTO}`;
        } else {
          type.namespace = `${getPackageNameFromConfig(api)}.${PACKAGES.DTO}`;
        }
      }

    } else {
      const jtOpt = GENERIC_TYPES.get(type.name)
      if (jtOpt) {
        const jt = jtOpt.java;
        if (!jt.primitive && jt.namespace && jt.namespace != 'java.lang') {
          type.namespace = jt.namespace;
        }
      } else {
        typeNotFound = true;
      }
    }

    if (typeNotFound) {
      errors.push({
        message: `on attribute ${key}, Type ${type.name} not on the allowed '${attr.objectType}' list`,
      });
    }

    attr.type = type.name;
    ncfg.attributes.push({
      name: key,
      type: attr.type!,
      objectType: (attr.objectType != 'dto' && attr.objectType != 'model')? 'java' : attr.objectType,
      required: attr.required ?? false,
      minLength: attr.minimum,
      maxLength: attr.maximum,
      regex: attr.pattern,
      isEmail: attr.format === 'email',
      isUrl: attr.format === 'url',
      primaryKey: attr.identifier ?? false
    })
  }

  // normalize the name of the DTO
  ncfg.name = normalizeName(bodyCfg.name, 'dto')

  if (errors.length > 0) {
    throw errors;
  }

  return ncfg;
};

const getDTOOutputPath = (dtoContext: RenderContext<DTOConfig>, context: RenderContext<ResponseConfig>) => {
  if (context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
      const outputDir = getDDDDtoOutputDir(dtoContext)
      context.fullPath = outputDir
      return path.join(
        outputDir,
        `${context.resourceConfig.name}DTO${EXTENSIONS.JAVA}`,
      );
  } else {
    const outputDir = getDtoOutputDir(dtoContext);
    context.fullPath = outputDir
    return path.join(outputDir, `${context.resourceConfig.name}DTO${EXTENSIONS.JAVA}`);
  }
};