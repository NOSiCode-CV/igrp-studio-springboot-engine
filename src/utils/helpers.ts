import { DIRECTORIES, ERROR_MESSAGE, EXTENSIONS, PARTIALS, PARTIALS_DIR, REQUEST_BODY_NOT_IMPORT } from './constants';
import path from 'path';
import fs from 'fs-extra';
import * as Handlebars from 'handlebars';
import {
  ApiConfig,
  ControllerConfig, DeleteConfig,
  DTOBaseConfig,
  DTOConfig, EnumConfig, ExceptionConfig,
  ModelConfig,
  ObjectTypes,
  PermissionConfig,
  RenderContext,
} from '../interfaces/types';
import { normalizeDTOType } from '../modules/dto/saveDTOConfig';

/**
 * Dynamically loads and registers Handlebars partials in a React.js application.
 */
export const loadPartials = async (): Promise<void> => {
  try {
    // Fetch a list of partial files (You may need to hardcode or retrieve this list from a backend API)
    // Fetch each partial and register it
    await Promise.all(
      PARTIALS.map(async (file) => {
        const partialName = file.replace('.hbs', ''); // Extract partial name
        const partialContent: string = await fs.readFile(`${PARTIALS_DIR}/${file}`, 'utf-8');
        if (!partialContent) {
          throw new Error(`Failed to load partial: ${file}`);
        }
        Handlebars.registerPartial(partialName, partialContent); // Register the partial
      })
    );

  } catch (error) {
    console.error('Error loading partials:', error);
  }
};

export const getPackage = async (outputDir: string) => {
  const baseApiPath = path.join(outputDir, DIRECTORIES.BASE_API);

  if (!(await fs.pathExists(baseApiPath))) {
    throw ERROR_MESSAGE.BASE_API_NOT_FOUND;
  }

  const baseApi = await fs.readJSON(baseApiPath);
  const { group, packageName } = baseApi;

  if (!group || !packageName) {
    throw ERROR_MESSAGE.INVALID_API_CONFIG;
  }

  return `${group}.${packageName}`;
};

export const getPackageNameFromConfig = function (config: ApiConfig) {
  return `${config.group}.${config.packageName}`;
}

export const formatPackageName = (group: string, packageName: string) =>
  `${group}.${packageName}`.replace(/\./g, '/');

export const getTestPath = (group: string, packageName: string) =>
  `src/test/java/${formatPackageName(group, packageName)}`;

export const getMainPath = (group: string, packageName: string) =>
  `src/main/java/${formatPackageName(group, packageName)}`;

export const getModelConfigPath = (module:string, model: string, output: string) =>
  path.join(output, replaceTemplate(DIRECTORIES.CONFIG_MODEL, { module }), `${model}${EXTENSIONS.JSON}`);

export const getPermissionConfigPath = (permission: string, output: string) =>
  path.join(output, DIRECTORIES.CONFIG_PERMISSION, `${permission}${EXTENSIONS.JSON}`);

export const getDTOConfigPath = (type: string, module: string, dto: string, output: string) =>
  path.join(output, replaceTemplate(DIRECTORIES.CONFIG_DTO, { module }), `${dto}${type}${EXTENSIONS.JSON}`);

export const getResponseConfigPath = (module: string, response: string, output: string) =>
  path.join(output, replaceTemplate(DIRECTORIES.CONFIG_RESPONSE, { module }), `${response}${EXTENSIONS.JSON}`);

export const getEnumConfigPath = (module: string, enumerated: string, output: string) =>
  path.join(output, replaceTemplate(DIRECTORIES.CONFIG_ENUM, { module }), `${enumerated}${EXTENSIONS.JSON}`);

export const getModelOutputDir = (context: RenderContext<ModelConfig | DeleteConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.packageName),
    DIRECTORIES.MODELS,
    context.resourceConfig.name.toLowerCase()
  );

export const getDDDModelOutputDir = (context: RenderContext<ModelConfig | DeleteConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.packageName),
    context.resourceConfig.module?.toLowerCase() ?? DIRECTORIES.SHARED,
    DIRECTORIES.DOMAIN,
    DIRECTORIES.MODELS,
  );

export const getDDDRepositoryOutputDir = (context: RenderContext<ModelConfig | DeleteConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.packageName),
    context.resourceConfig.module?.toLowerCase() ?? DIRECTORIES.SHARED,
    DIRECTORIES.DOMAIN,
    DIRECTORIES.REPOSITORY
  );

export const getDDDRepositoryImplOutputDir = (context: RenderContext<ModelConfig | DeleteConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.packageName),
    context.resourceConfig.module?.toLowerCase() ?? DIRECTORIES.SHARED,
    DIRECTORIES.INFRASTRUCTURE,
    DIRECTORIES.PERSISTENCE
  );

export const getDDDAggregateRepositoryOutputDir = (context: RenderContext<ModelConfig | DeleteConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.packageName),
    DIRECTORIES.DOMAIN,
    DIRECTORIES.REPOSITORIES,
    context.resourceConfig.name.toLowerCase()
  );

export const getDDDAggregateRepositoryImplOutputDir = (context: RenderContext<ModelConfig | DeleteConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.packageName),
    DIRECTORIES.INFRASTRUCTURE,
    DIRECTORIES.DATABASE,
    DIRECTORIES.IMPLEMENTATION,
    context.resourceConfig.name.toLowerCase()
  );

export const getDtoOutputDir = (context: RenderContext<DTOBaseConfig | DeleteConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.packageName),
    DIRECTORIES.DTO
  );

export const getDDDDtoOutputDir = (context: RenderContext<DTOBaseConfig | DeleteConfig> ) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.packageName),
    context.resourceConfig.module?.toLowerCase() ?? DIRECTORIES.SHARED,
    DIRECTORIES.APPLICATION,
    DIRECTORIES.DTO
  );

export const getEnumOutputDir = (context: RenderContext<EnumConfig | DeleteConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.packageName),
    DIRECTORIES.CONSTANTS
  );

export const getDDDEnumOutputDir = (context: RenderContext<EnumConfig | DeleteConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.packageName),
    context.resourceConfig.module?.toLowerCase() ?? DIRECTORIES.SHARED,
    DIRECTORIES.APPLICATION,
    DIRECTORIES.CONSTANTS
  );

export const getDDDDataObjectOutputDir = (context: RenderContext<DTOBaseConfig | DeleteConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.packageName),
    DIRECTORIES.INFRASTRUCTURE,
    DIRECTORIES.DATABASE,
    DIRECTORIES.DATA_OBJECT,
    context.resourceConfig.module!.toLowerCase()
  );

export const getDDDCommandOutputDir = (context: RenderContext<DTOBaseConfig | DeleteConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.packageName),
    context.resourceConfig.module?.toLowerCase() ?? DIRECTORIES.SHARED,
    DIRECTORIES.APPLICATION,
    DIRECTORIES.COMMANDS,
    DIRECTORIES.COMMANDS
  );

export const getDDDCommandHandlerOutputDir = (context: RenderContext<DTOBaseConfig | DeleteConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.packageName),
    context.resourceConfig.module?.toLowerCase() ?? DIRECTORIES.SHARED,
    DIRECTORIES.APPLICATION,
    DIRECTORIES.COMMANDS,
    DIRECTORIES.HANDLERS
  );

export const getDDDQueryOutputDir = (context: RenderContext<DTOBaseConfig | DeleteConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.packageName),
    context.resourceConfig.module?.toLowerCase() ?? DIRECTORIES.SHARED,
    DIRECTORIES.APPLICATION,
    DIRECTORIES.QUERIES,
    DIRECTORIES.QUERIES
  );

export const getDDDQueryHandlerOutputDir = (context: RenderContext<DTOBaseConfig | DeleteConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.packageName),
    context.resourceConfig.module?.toLowerCase() ?? DIRECTORIES.SHARED,
    DIRECTORIES.APPLICATION,
    DIRECTORIES.QUERIES,
    DIRECTORIES.HANDLERS
  );

export const getDDDEventOutputDir = (context: RenderContext<DTOBaseConfig | DeleteConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.packageName),
    context.resourceConfig.module?.toLowerCase() ?? DIRECTORIES.SHARED,
    DIRECTORIES.DOMAIN,
    DIRECTORIES.EVENTS,
    DIRECTORIES.EVENTS
  );

export const getDDDEventHandlerOutputDir = (context: RenderContext<DTOBaseConfig | DeleteConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.packageName),
    context.resourceConfig.module?.toLowerCase() ?? DIRECTORIES.SHARED,
    DIRECTORIES.DOMAIN,
    DIRECTORIES.EVENTS,
    DIRECTORIES.HANDLERS
  );

export const getDDDValueObjectOutputDir = (context: RenderContext<DTOBaseConfig | DeleteConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.packageName),
    DIRECTORIES.DOMAIN,
    DIRECTORIES.AGGREGATE,
    context.resourceConfig.module!.toLowerCase(),
  );

export const getDDDDomainEntityOutputDir = (context: RenderContext<DTOBaseConfig | DeleteConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.packageName),
    DIRECTORIES.DOMAIN,
    DIRECTORIES.AGGREGATE,
    context.resourceConfig.module!.toLowerCase(),
  );

export const getDDDAggregateRootOutputDir = (context: RenderContext<DTOBaseConfig | ControllerConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.packageName),
    DIRECTORIES.DOMAIN,
    DIRECTORIES.AGGREGATE,
    context.resourceConfig.name.toLowerCase(),
  );

export const getDDDAggregateElementsOutputDir = (context: RenderContext<DTOBaseConfig | DeleteConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.packageName),
    DIRECTORIES.DOMAIN,
    DIRECTORIES.AGGREGATE,
    context.resourceConfig.module!.toLowerCase(),
  );

export const getDDDDataTransferObjectOutputDir = (context: RenderContext<DTOBaseConfig | DeleteConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.packageName),
    DIRECTORIES.APPLICATION,
    DIRECTORIES.QUERY,
    DIRECTORIES.DTO,
    context.resourceConfig.module!.toLowerCase()
  );

export const getDDDConverterOutputDir = (context: RenderContext<ModelConfig | DeleteConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.packageName),
    DIRECTORIES.INFRASTRUCTURE,
    DIRECTORIES.DATABASE,
    DIRECTORIES.CONVERTER,
    context.resourceConfig.module!.toLowerCase()
  );

export const getDDDAggDomainConverterOutputDir = (context: RenderContext<ModelConfig | DeleteConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.packageName),
    DIRECTORIES.APPLICATION,
    DIRECTORIES.QUERY,
    DIRECTORIES.ASSEMBLER,
    context.resourceConfig.name!.toLowerCase()
  );

export const getDDDDomainConverterOutputDir = (context: RenderContext<ModelConfig | DeleteConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.packageName),
    DIRECTORIES.APPLICATION,
    DIRECTORIES.QUERY,
    DIRECTORIES.ASSEMBLER,
    context.resourceConfig.module!.toLowerCase()
  );

export const getControllerConfigPath = (module: string, controller: string, output: string) =>
  path.join(output, replaceTemplate(DIRECTORIES.CONFIG_CONTROLLER, { module }), `${controller}Controller${EXTENSIONS.JSON}`);

export const getControllerDir = (context: RenderContext<ControllerConfig | ModelConfig | DeleteConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.packageName),
    DIRECTORIES.CONTROLLERS,
    context.resourceConfig.name.toLowerCase()
  );
export const getDDDControllerDir = (context: RenderContext<ControllerConfig | ModelConfig | DeleteConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.packageName),
    context.resourceConfig.module?.toLowerCase() ?? DIRECTORIES.SHARED,
    DIRECTORIES.INFRASTRUCTURE,
    DIRECTORIES.CONTROLLER
  );

export const getExceptionDir = (context: RenderContext<ExceptionConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.packageName),
    DIRECTORIES.EXCEPTIONS
  );

export const getDDDExceptionDir = (context: RenderContext<ExceptionConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.packageName),
    context.resourceConfig.module?.toLowerCase() ?? DIRECTORIES.SHARED,
    DIRECTORIES.DOMAIN,
    DIRECTORIES.EXCEPTIONS
  );

export const getServiceDir = (context: RenderContext<ControllerConfig | ModelConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.packageName),
    DIRECTORIES.SERVICES
  );

export const getDDDServiceDir = (context: RenderContext<ControllerConfig | ModelConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.packageName),
    context.resourceConfig.module?.toLowerCase() ?? DIRECTORIES.SHARED,
    DIRECTORIES.DOMAIN,
    DIRECTORIES.SERVICE
  );

export const getDDDServiceImplDir = (context: RenderContext<ControllerConfig | ModelConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.packageName),
    DIRECTORIES.DOMAIN,
    DIRECTORIES.IMPLEMENTATION,
    context.resourceConfig.name.toLowerCase()
  );

export const loadConfig = async function<T> (basePath: string): Promise<T[]> {
  if (!(await fs.pathExists(basePath))) {
    return [];
  }

  const files = (await fs.readdir(basePath))
    .filter(f => f.endsWith('.json'))
    .map(f => fs.readJSON(path.join(basePath,f)));
  return await Promise.all<T>(files);
}

export const loadDTOConfig = async function <DTOConfig>(type: ObjectTypes, basePath: string, name: string): Promise<DTOConfig> {
  if (!name || name.trim() === '') {
    throw new Error("Invalid DTO config name");
  }

  if (!(await fs.pathExists(basePath))) {
    throw new Error("Invalid DTO config path");
  }

  const files = await fs.readdir(basePath);
  const matchingFile = files.find(f => f === `${name}${normalizeDTOType(type)}.json`);

  if (!matchingFile) {
    throw new Error(`DTO config file "${name}.json" not found in the directory.`);
  }

  const filePath = path.join(basePath, matchingFile);
  const jsonContent = await fs.readJSON(filePath);

  return jsonContent as DTOConfig;
};

export const loadDTOConfigs = async function (module: string, basePath: string): Promise<DTOConfig[]> {
  return await loadConfig(path.join(basePath, replaceTemplate(DIRECTORIES.CONFIG_DTO, { module })));
}

export const loadModelConfigs = async function (module: string, basePath: string): Promise<ModelConfig[]> {
  return await loadConfig(path.join(basePath, replaceTemplate(DIRECTORIES.CONFIG_MODEL, { module })));
}

export const loadControllerConfigs = async function (module: string, basePath: string): Promise<ControllerConfig[]> {
  return await loadConfig(path.join(basePath, replaceTemplate(DIRECTORIES.CONFIG_CONTROLLER, { module })));
}

export const loadPermissionConfigs = async function (basePath: string): Promise<PermissionConfig[]> {
  return await loadConfig(path.join(basePath, DIRECTORIES.CONFIG_PERMISSION));
}

export const replaceTemplate = (template: string, replacements: Record<string, string>): string => {
  return template.replace(/{{(.*?)}}/g, (_, key) => replacements[key] || '');
};

export const normalizePackageName = (artifactName: string): string => {
  // Replace hyphens with underscores and remove invalid characters
  return artifactName.replace(/-/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
};

/**
 * Validates the annotations for the provided attribute object.
 * Ensures specific rules are adhered to and throws an error if violations occur.
 *
 * @param {any} attribute - The attribute object to validate.
 * @throws {Error} If validation rules are violated.
 */
export const validateAnnotations = (attribute: any) => {
  const errors: Error[] = [];

  // Check if isEmail and isUrl are applied only to String types and not simultaneously
  if (attribute.isEmail && attribute.type !== 'string') {
    errors.push(new Error(`The "isEmail" attribute can only be applied to String types. Found: ${attribute.type}`));
  }
  if (attribute.isUrl && attribute.type !== 'string') {
    errors.push(new Error(`The "isUrl" attribute can only be applied to String types. Found: ${attribute.type}`));
  }
  if (attribute.isEmail && attribute.isUrl) {
    errors.push(new Error(`The "isEmail" and "isUrl" attributes cannot be applied simultaneously.`));
  }

  // Check if before and after are applied only to LocalDate or LocalDateTime and not simultaneously
  if ((attribute.before || attribute.after) &&
    !['datetime'].includes(attribute.type)) {
    errors.push(new Error(`The "before" and "after" attributes can only be applied to LocalDate or LocalDateTime types. Found: ${attribute.type}`));
  }
  if (attribute.before && attribute.after) {
    errors.push(new Error(`The "before" and "after" attributes cannot be applied simultaneously.`));
  }

  // Check if positive is applied only to numeric types
  if (attribute.positive && !['int', 'integer', 'long', 'double', 'float', 'bigdecimal', 'biginteger'].includes(attribute.type)) {
    errors.push(new Error(`The "positive" attribute can only be applied to numeric types. Found: ${attribute.type}`));
  }

  // Check if maxLength and minLength are applied only to String types
  if ((attribute.minLength !== undefined || attribute.maxLength !== undefined) &&
    attribute.type !== 'string') {
    errors.push(new Error(`The "minLength" and "maxLength" attributes can only be applied to String types. Found: ${attribute.type}`));
  }

  // If there are any validation errors, throw them as an Error
  if (errors.length > 0) {
    throw errors
  }
};

export const extractTypeFromList = (typeString: string): string | null => {
  const listRegex = "^List<(.+)>$";
  const match = typeString.match(listRegex);
  if (match && match[1]) {
    if (match[1].trim() && !REQUEST_BODY_NOT_IMPORT.includes(match[1].trim()))
      return match[1].trim();
  }
  else if (!REQUEST_BODY_NOT_IMPORT.includes(typeString)) 
    return typeString
  return null; 
};