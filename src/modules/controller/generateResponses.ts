import {
  ApiConfig,
  Body,
  ControllerConfig,
  DTOConfig, EnumConfig,
  ExceptionConfig,
  JavaType,
  ModelConfig,
  RenderContext,
  ResponseConfig,
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
import { capitalize } from '../../helper/stringHelper';
import { getDTOTypes } from '../dto/helpers';
import { normalizeName } from '../dto/saveDTOConfig';
import { generateException } from './generateException';
import { getEnumTypes } from '../enum/helpers';

export const generateResponses = async (context: RenderContext<ControllerConfig>) => {

  const baseConfig = context.baseConfig
  const basePath = context.basePath

  for (const action of context.resourceConfig.actions) {

    if (!action.responses || !Object.keys(action.responses)) continue

    for (const [status, response] of Object.entries(action.responses)) {

      if (status == '204') continue;

      const schema = (response?.content['application/json'] ?? response?.content['multipart/form-data'])?.schema;
      /*if (schema?.objectType == 'dto' || schema?.type !== 'object') {
        continue;
      }*/

      if (schema?.type !== 'object') {
        //console.log("schema?.type ", schema?.type);
        continue;
      }

      response.name = capitalize(response.name ?? '');
      response.module = context.resourceConfig.module ?? DIRECTORIES.SHARED;


      const dtoContext: RenderContext<DTOConfig> = {
        baseConfig: baseConfig,
        basePath: basePath,
        resourceConfig: await transformSchemaDTOConfig(
          (context.resourceConfig.module ?? DIRECTORIES.SHARED),
          response,
          baseConfig,
          basePath,
        ),
        fullPath: basePath,
      };



      const responseContext: RenderContext<ResponseConfig> = {
        resourceConfig: { ...response, statusCode: status, template: 'classic', type: 'response' },
        basePath,
        baseConfig,
        fullPath: basePath,
      };

      const modelOutputPath = getDTOOutputPath(dtoContext, responseContext);
      const template = await _renderDTO(responseContext);

      await saveToFile(template, modelOutputPath, true, DIRECTORIES.DTO, dtoContext.resourceConfig.id, dtoContext.resourceConfig.module, context.basePath);

      const statusCode = parseInt(status, 10);

      if (statusCode >= 400 && statusCode <= 599) {

        const exceptionContext: RenderContext<ExceptionConfig> = {
          baseConfig: context.baseConfig,
          basePath: context.basePath,
          resourceConfig: {
            module: dtoContext.resourceConfig.module,
            name: action.actionName,
            body: dtoContext.resourceConfig.name + "DTO"
          },
          fullPath: context.basePath,
        };

        await generateException(exceptionContext);

      }

    }
  }
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

  if (context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN)
    tn = TEMPLATES.DDD_RESPONSE_DTO[context.resourceConfig.template];
  else
    tn = TEMPLATES.DOMAIN_RESPONSE[context.resourceConfig.template];

  if (!tn) {
    throw ERROR_MESSAGE.TEMPLATE_NAME_NOT_REGISTERED;
  }
  return await renderTemplate(tn, context);
};

export const transformSchemaDTOConfig = async function (
  module: string,
  config: Body,
  api: ApiConfig,
  basePath: string,
): Promise<DTOConfig> {


  const bodyCfg = structuredClone(config);


  const ncfg: DTOConfig = {
    type: 'response',
    name: bodyCfg.name ?? '',
    template: 'classic',
    module: bodyCfg.module,
    attributes: []
  };
  const schemacfg = bodyCfg.content["application/json"].schema
  const errors = [];

  let mtypes: Map<string, ModelConfig> | undefined = undefined;
  let dtypes: Map<string, DTOConfig> | undefined = undefined;
  let etypes: Map<string, EnumConfig> | undefined = undefined;

  for (const [key, attr] of Object.entries(schemacfg.properties ?? {})) {
    let type: JavaType;
    type = { name: attr.type };

    let typeNotFound = false;
    if (attr.objectType === PACKAGE_NS.model) {
      if (mtypes === undefined) {
        mtypes = await getModelTypes(module ?? DIRECTORIES.SHARED, basePath);
      }
      const mt = mtypes.get(attr.type!);
      if (mt) {
        if (api.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
          type.namespace = `${getPackageNameFromConfig(api)}.${bodyCfg.module ?? DIRECTORIES.SHARED}.domain.${PACKAGES.MODELS}`;
        } else {
          type.namespace = `${getPackageNameFromConfig(api)}.${PACKAGES.MODELS}`;
        }
      } else {
        typeNotFound = true;
      }
    } else if (attr.objectType === PACKAGE_NS.dto) {

      dtypes = await getDTOTypes(attr.module ?? module ?? DIRECTORIES.SHARED, basePath);

      const dt = dtypes.get(normalizeName(attr.type!, 'dto') + "DTO");

      if (!dt) {
        dtypes = await getDTOTypes(DIRECTORIES.SHARED, basePath);
        const dtype = dtypes.get(normalizeName(attr.type!, 'dto') + "DTO");
        if (!dtype) {
          typeNotFound = true;
        }
      }

      if (!typeNotFound) {
        if (api.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
          type.namespace = `${getPackageNameFromConfig(api)}.${bodyCfg.module ?? DIRECTORIES.SHARED}.application.${PACKAGES.DTO}`;
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
        if (!etype) {
          typeNotFound = true;
        }
      }

      if (!typeNotFound) {
        if (api.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
          type.namespace = `${getPackageNameFromConfig(api)}.${config.module ?? DIRECTORIES.SHARED}.application.${PACKAGES.CONSTANTS}`;
        } else {
          type.namespace = `${getPackageNameFromConfig(api)}.${PACKAGES.CONSTANTS}`;
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
      objectType: (attr.objectType != 'dto' && attr.objectType != 'model') ? 'java' : attr.objectType,
      required: attr.required ?? false,
      minLength: attr.minimum,
      maxLength: attr.maximum,
      regex: attr.pattern,
      isEmail: attr.format === 'email',
      isUrl: attr.format === 'url',
      primaryKey: attr.identifier ?? false,
      collectionType: attr.collectionType
    })
  }

  // normalize the name of the DTO
  ncfg.name = normalizeName(bodyCfg.name ?? '', 'dto')
  ncfg.id = bodyCfg.id

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