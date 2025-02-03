import {
  ApiConfig, ControllerAction,
  ControllerConfig,
  DTOConfig,
  JavaType,
  ModelConfig,
  RenderContext,
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
import { getDTOTypes } from '../dto/helpers';
import { normalizeName, saveDTOConfig } from '../dto/saveDTOConfig';
import { capitalize } from '../../utils/capitalizeStrings';

export const generateRequest = async (context: RenderContext<ControllerConfig>) => {

  for(const action of context.resourceConfig.actions) {

    if(!action.requestBody ||
      (!Object.keys(action.requestBody.content).includes("application/json")
      && !Object.keys(action.requestBody.content).includes("multipart/form-data"))
      || (action.requestBody.content["application/json"] ?? action.requestBody.content["multipart/form-data"]).schema.objectType
    ) continue

    const dtoContext: RenderContext<DTOConfig> = {
      baseConfig: context.baseConfig,
      basePath: context.basePath,
      resourceConfig: await transformSchemaDTOConfig(action, context.baseConfig, context.basePath),
      fullPath: context.basePath,
    };

    //await saveDTOConfig(dtoContext.resourceConfig, context.basePath);

    const modelOutputPath = getDTOOutputPath(dtoContext);
    const template = await _renderDTO(dtoContext);

    await saveToFile(template, modelOutputPath);

    return dtoContext;

  }
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
    throw ERROR_MESSAGE.EMPTY_ACTION_ATTRIBUTES;
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
    case "command":
      tn = TEMPLATES.DDD_LITE_COMMAND[context.resourceConfig.template];
      break;
    case "query":
      tn = TEMPLATES.DDD_LITE_QUERY[context.resourceConfig.template];
      break;
    case "event":
      tn = TEMPLATES.DDD_LITE_EVENT[context.resourceConfig.template];
      break;
  }
  
  if (!tn) {
    throw ERROR_MESSAGE.TEMPLATE_NAME_NOT_REGISTERED;
  }
  return await renderTemplate(tn, context);
};

export const transformSchemaDTOConfig = async function(
  action: ControllerAction,
  api: ApiConfig,
  basePath: string,
): Promise<DTOConfig> {

  const config = action.requestBody!;

  const bodyCfg = structuredClone(config);
  const ncfg: DTOConfig = {
    type: 'dto',
    name: capitalize(action.actionName) + "Request",
    template: 'classic',
    module: DIRECTORIES.SHARED,
    attributes: []
  };
  const schemacfg = bodyCfg.content["application/json"]?.schema ?? bodyCfg.content["multipart/form-data"]?.schema
  const errors = [];

  let mtypes: Map<string, ModelConfig> | undefined = undefined;
  let dtypes: Map<string, DTOConfig> | undefined = undefined;

  for (const [key, attr] of Object.entries(schemacfg.properties ?? {})) {
    let type: JavaType;
    type = { name: attr.type };

    let typeNotFound = false;
    if (attr.objectType === PACKAGE_NS.model) {
      if (mtypes === undefined) {
        mtypes = await getModelTypes(DIRECTORIES.SHARED, basePath);
      }
      const mt = mtypes.get(attr.type!);
      if (mt) {
        if(api.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN){
          type.namespace = `${getPackageNameFromConfig(api)}.${DIRECTORIES.SHARED}.domain.${PACKAGES.MODELS}`;
        } else {
          type.namespace = `${getPackageNameFromConfig(api)}.${PACKAGES.MODELS}`;
        }
      } else {
        typeNotFound = true;
      }
    } else if (attr.objectType === PACKAGE_NS.dto) {
      if (dtypes === undefined) {
        dtypes = await getDTOTypes(DIRECTORIES.SHARED, basePath);
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
          type.namespace = `${getPackageNameFromConfig(api)}.${DIRECTORIES.SHARED}.application.${PACKAGES.DTO}`;
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
  ncfg.name = normalizeName(capitalize(action.actionName) + "Request", 'dto')

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
    }
  } else {
    const outputDir = getDtoOutputDir(context);
    context.fullPath = outputDir
    return path.join(outputDir, `${context.resourceConfig.name}DTO${EXTENSIONS.JAVA}`);
  }
};