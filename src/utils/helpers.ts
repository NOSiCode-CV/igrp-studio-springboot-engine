import { DIRECTORIES, ERROR_MESSAGE, EXTENSIONS, REQUEST_BODY_NOT_IMPORT } from './constants';
import path from 'path';
import fs from 'fs-extra';
import { ApiConfig, ControllerConfig, DTOBaseConfig, DTOConfig, ModelConfig, PermissionConfig, RenderContext } from '../interfaces/types';


export const getPackage = async (outputDir: string) => {
  const baseApiPath = path.join(outputDir, DIRECTORIES.BASE_API);

  if (!(await fs.pathExists(baseApiPath))) {
    throw ERROR_MESSAGE.BASE_API_NOT_FOUND;
  }

  const baseApi = await fs.readJSON(baseApiPath);
  const { group, artifact } = baseApi;

  if (!group || !artifact) {
    throw ERROR_MESSAGE.INVALID_API_CONFIG;
  }

  return `${group}.${artifact}`;
};

export const getPackageNameFromConfig = function (config: ApiConfig) {
  return `${config.group}.${config.artifact}`;
}

export const formatPackageName = (group: string, artifact: string) =>
  `${group}.${artifact}`.replace(/\./g, '/');

export const getTestPath = (group: string, artifact: string) =>
  `src/test/java/${formatPackageName(group, artifact)}`;

export const getMainPath = (group: string, artifact: string) =>
  `src/main/java/${formatPackageName(group, artifact)}`;

export const getModelConfigPath = (module:string, model: string, output: string) =>
  path.join(output, replaceTemplate(DIRECTORIES.CONFIG_MODEL, { module }), `${model}${EXTENSIONS.JSON}`);

export const getPermissionConfigPath = (permission: string, output: string) =>
  path.join(output, DIRECTORIES.CONFIG_PERMISSION, `${permission}${EXTENSIONS.JSON}`);

export const getDTOConfigPath = (module: string, dto: string, output: string) =>
  path.join(output, replaceTemplate(DIRECTORIES.CONFIG_DTO, { module }), `${dto}${EXTENSIONS.JSON}`);

export const getModelOutputDir = (context: RenderContext<ModelConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.artifact),
    DIRECTORIES.MODELS,
    context.resourceConfig.name.toLowerCase()
  );

export const getDDDModelOutputDir = (context: RenderContext<ModelConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.artifact),
    context.resourceConfig.module?.toLowerCase() ?? DIRECTORIES.SHARED,
    DIRECTORIES.DOMAIN,
    DIRECTORIES.MODEL,
  );

export const getDDDRepositoryOutputDir = (context: RenderContext<ModelConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.artifact),
    context.resourceConfig.module?.toLowerCase() ?? DIRECTORIES.SHARED,
    DIRECTORIES.DOMAIN,
    DIRECTORIES.REPOSITORY
  );

export const getDDDRepositoryImplOutputDir = (context: RenderContext<ModelConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.artifact),
    context.resourceConfig.module?.toLowerCase() ?? DIRECTORIES.SHARED,
    DIRECTORIES.INFRASTRUCTURE,
    DIRECTORIES.PERSISTENCE
  );

export const getDDDAggregateRepositoryOutputDir = (context: RenderContext<ModelConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.artifact),
    DIRECTORIES.DOMAIN,
    DIRECTORIES.REPOSITORIES,
    context.resourceConfig.name.toLowerCase()
  );

export const getDDDAggregateRepositoryImplOutputDir = (context: RenderContext<ModelConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.artifact),
    DIRECTORIES.INFRASTRUCTURE,
    DIRECTORIES.DATABASE,
    DIRECTORIES.IMPLEMENTATION,
    context.resourceConfig.name.toLowerCase()
  );

export const getDtoOutputDir = (context: RenderContext<DTOBaseConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.artifact),
    DIRECTORIES.DTO
  );

export const getDDDDtoOutputDir = (context: RenderContext<DTOBaseConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.artifact),
    context.resourceConfig.module?.toLowerCase() ?? DIRECTORIES.SHARED,
    DIRECTORIES.APPLICATION,
    DIRECTORIES.DTO
  );

export const getDDDDataObjectOutputDir = (context: RenderContext<DTOBaseConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.artifact),
    DIRECTORIES.INFRASTRUCTURE,
    DIRECTORIES.DATABASE,
    DIRECTORIES.DATA_OBJECT,
    context.resourceConfig.module!.toLowerCase()
  );

export const getDDDCommandOutputDir = (context: RenderContext<DTOBaseConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.artifact),
    context.resourceConfig.module?.toLowerCase() ?? DIRECTORIES.SHARED,
    DIRECTORIES.APPLICATION,
    DIRECTORIES.COMMANDS,
    DIRECTORIES.COMMANDS
  );

export const getDDDCommandHandlerOutputDir = (context: RenderContext<DTOBaseConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.artifact),
    context.resourceConfig.module?.toLowerCase() ?? DIRECTORIES.SHARED,
    DIRECTORIES.APPLICATION,
    DIRECTORIES.COMMANDS,
    DIRECTORIES.HANDLERS
  );

export const getDDDQueryOutputDir = (context: RenderContext<DTOBaseConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.artifact),
    context.resourceConfig.module?.toLowerCase() ?? DIRECTORIES.SHARED,
    DIRECTORIES.APPLICATION,
    DIRECTORIES.QUERIES,
    DIRECTORIES.QUERIES
  );

export const getDDDQueryHandlerOutputDir = (context: RenderContext<DTOBaseConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.artifact),
    context.resourceConfig.module?.toLowerCase() ?? DIRECTORIES.SHARED,
    DIRECTORIES.APPLICATION,
    DIRECTORIES.QUERIES,
    DIRECTORIES.HANDLERS
  );

export const getDDDEventOutputDir = (context: RenderContext<DTOBaseConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.artifact),
    context.resourceConfig.module?.toLowerCase() ?? DIRECTORIES.SHARED,
    DIRECTORIES.DOMAIN,
    DIRECTORIES.EVENTS,
    DIRECTORIES.EVENTS
  );

export const getDDDEventHandlerOutputDir = (context: RenderContext<DTOBaseConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.artifact),
    context.resourceConfig.module?.toLowerCase() ?? DIRECTORIES.SHARED,
    DIRECTORIES.DOMAIN,
    DIRECTORIES.EVENTS,
    DIRECTORIES.HANDLERS
  );

export const getDDDValueObjectOutputDir = (context: RenderContext<DTOBaseConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.artifact),
    DIRECTORIES.DOMAIN,
    DIRECTORIES.AGGREGATE,
    context.resourceConfig.module!.toLowerCase(),
  );

export const getDDDDomainEntityOutputDir = (context: RenderContext<DTOBaseConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.artifact),
    DIRECTORIES.DOMAIN,
    DIRECTORIES.AGGREGATE,
    context.resourceConfig.module!.toLowerCase(),
  );

export const getDDDAggregateRootOutputDir = (context: RenderContext<DTOBaseConfig> | RenderContext<ControllerConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.artifact),
    DIRECTORIES.DOMAIN,
    DIRECTORIES.AGGREGATE,
    context.resourceConfig.name.toLowerCase(),
  );

export const getDDDAggregateElementsOutputDir = (context: RenderContext<DTOBaseConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.artifact),
    DIRECTORIES.DOMAIN,
    DIRECTORIES.AGGREGATE,
    context.resourceConfig.module!.toLowerCase(),
  );

export const getDDDDataTransferObjectOutputDir = (context: RenderContext<DTOBaseConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.artifact),
    DIRECTORIES.APPLICATION,
    DIRECTORIES.QUERY,
    DIRECTORIES.DTO,
    context.resourceConfig.module!.toLowerCase()
  );

export const getDDDConverterOutputDir = (context: RenderContext<ModelConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.artifact),
    DIRECTORIES.INFRASTRUCTURE,
    DIRECTORIES.DATABASE,
    DIRECTORIES.CONVERTER,
    context.resourceConfig.module!.toLowerCase()
  );

export const getDDDAggDomainConverterOutputDir = (context: RenderContext<ModelConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.artifact),
    DIRECTORIES.APPLICATION,
    DIRECTORIES.QUERY,
    DIRECTORIES.ASSEMBLER,
    context.resourceConfig.name!.toLowerCase()
  );

export const getDDDDomainConverterOutputDir = (context: RenderContext<ModelConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.artifact),
    DIRECTORIES.APPLICATION,
    DIRECTORIES.QUERY,
    DIRECTORIES.ASSEMBLER,
    context.resourceConfig.module!.toLowerCase()
  );

export const getControllerConfigPath = (module: string, controller: string, output: string) =>
  path.join(output, replaceTemplate(DIRECTORIES.CONFIG_CONTROLLER, { module }), `${controller}${EXTENSIONS.JSON}`);

export const getControllerDir = (context: RenderContext<ControllerConfig | ModelConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.artifact),
    DIRECTORIES.CONTROLLERS,
    context.resourceConfig.name.toLowerCase()
  );
export const getDDDControllerDir = (context: RenderContext<ControllerConfig | ModelConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.artifact),
    context.resourceConfig.module?.toLowerCase() ?? DIRECTORIES.SHARED,
    DIRECTORIES.INFRASTRUCTURE,
    DIRECTORIES.CONTROLLER
  );
export const getServiceDir = (context: RenderContext<ControllerConfig | ModelConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.artifact),
    DIRECTORIES.SERVICES
  );

export const getDDDServiceDir = (context: RenderContext<ControllerConfig | ModelConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.artifact),
    context.resourceConfig.module?.toLowerCase() ?? DIRECTORIES.SHARED,
    DIRECTORIES.DOMAIN,
    DIRECTORIES.SERVICE
  );

export const getDDDServiceImplDir = (context: RenderContext<ControllerConfig | ModelConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.artifact),
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

export const loadDTOConfig = async function <DTOConfig>(basePath: string, name: string): Promise<DTOConfig> {
  if (!name || name.trim() === '') {
    throw new Error("Invalid DTO config name");
  }

  if (!(await fs.pathExists(basePath))) {
    throw new Error("Invalid DTO config path");
  }

  const files = await fs.readdir(basePath);
  const matchingFile = files.find(f => f === `${name}.json`);

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