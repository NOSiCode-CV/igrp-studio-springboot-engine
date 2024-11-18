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

export const getModelConfigPath = (model: string, output: string) =>
  path.join(output, DIRECTORIES.CONFIG_MODEL, `${model}${EXTENSIONS.JSON}`);

export const getPermissionConfigPath = (permission: string, output: string) =>
  path.join(output, DIRECTORIES.CONFIG_PERMISSION, `${permission}${EXTENSIONS.JSON}`);

export const getDTOConfigPath = (dto: string, output: string) =>
  path.join(output, DIRECTORIES.CONFIG_DTO, `${dto}${EXTENSIONS.JSON}`);

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
    DIRECTORIES.INFRASTRUCTURE,
    DIRECTORIES.DATABASE,
    DIRECTORIES.ENTITY,
    context.resourceConfig.aggregate?.toLowerCase() ?? ""
  );

export const getDDDRepositoryOutputDir = (context: RenderContext<ModelConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.artifact),
    DIRECTORIES.INFRASTRUCTURE,
    DIRECTORIES.DATABASE,
    DIRECTORIES.REPOSITORY,
    context.resourceConfig.name.toLowerCase()
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
    DIRECTORIES.APPLICATION,
    DIRECTORIES.QUERY,
    DIRECTORIES.DTO,
    context.resourceConfig.aggregate!.toLowerCase()
  );

export const getDDDDataObjectOutputDir = (context: RenderContext<DTOBaseConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.artifact),
    DIRECTORIES.INFRASTRUCTURE,
    DIRECTORIES.DATABASE,
    DIRECTORIES.DATA_OBJECT,
    context.resourceConfig.aggregate!.toLowerCase()
  );

export const getDDDCommandOutputDir = (context: RenderContext<DTOBaseConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.artifact),
    DIRECTORIES.APPLICATION,
    DIRECTORIES.COMMAND,
    context.resourceConfig.aggregate!.toLowerCase()
  );

export const getDDDQueryOutputDir = (context: RenderContext<DTOBaseConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.artifact),
    DIRECTORIES.APPLICATION,
    DIRECTORIES.QUERY,
    context.resourceConfig.aggregate!.toLowerCase()
  );

export const getDDDEventOutputDir = (context: RenderContext<DTOBaseConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.artifact),
    DIRECTORIES.DOMAIN,
    DIRECTORIES.EVENT,
    context.resourceConfig.aggregate!.toLowerCase()
  );

export const getDDDValueObjectOutputDir = (context: RenderContext<DTOBaseConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.artifact),
    DIRECTORIES.DOMAIN,
    DIRECTORIES.AGGREGATE,
    context.resourceConfig.aggregate!.toLowerCase(),
  );

export const getDDDDomainEntityOutputDir = (context: RenderContext<DTOBaseConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.artifact),
    DIRECTORIES.DOMAIN,
    DIRECTORIES.AGGREGATE,
    context.resourceConfig.aggregate!.toLowerCase(),
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
    context.resourceConfig.aggregate!.toLowerCase(),
  );

export const getDDDDataTransferObjectOutputDir = (context: RenderContext<DTOBaseConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.artifact),
    DIRECTORIES.APPLICATION,
    DIRECTORIES.QUERY,
    DIRECTORIES.DTO,
    context.resourceConfig.aggregate!.toLowerCase()
  );

export const getDDDConverterOutputDir = (context: RenderContext<ModelConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.artifact),
    DIRECTORIES.INFRASTRUCTURE,
    DIRECTORIES.DATABASE,
    DIRECTORIES.CONVERTER,
    context.resourceConfig.aggregate!.toLowerCase()
  );

export const getDDDDomainConverterOutputDir = (context: RenderContext<ModelConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.artifact),
    DIRECTORIES.APPLICATION,
    DIRECTORIES.QUERY,
    DIRECTORIES.ASSEMBLER,
    context.resourceConfig.name.toLowerCase()
  );

export const getControllerConfigPath = (controller: string, output: string) =>
  path.join(output, DIRECTORIES.CONFIG_CONTROLLER, `${controller}${EXTENSIONS.JSON}`);

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
    DIRECTORIES.API,
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
    DIRECTORIES.DOMAIN,
    DIRECTORIES.SERVICE,
    context.resourceConfig.name.toLowerCase()
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

export const loadDTOConfigs = async function (basePath: string): Promise<DTOConfig[]> {
  return await loadConfig(path.join(basePath, DIRECTORIES.CONFIG_DTO));
}

export const loadModelConfigs = async function (basePath: string): Promise<ModelConfig[]> {
  return await loadConfig(path.join(basePath, DIRECTORIES.CONFIG_MODEL));
}

export const loadControllerConfigs = async function (basePath: string): Promise<ControllerConfig[]> {
  return await loadConfig(path.join(basePath, DIRECTORIES.CONFIG_CONTROLLER));
}

export const loadPermissionConfigs = async function (basePath: string): Promise<PermissionConfig[]> {
  return await loadConfig(path.join(basePath, DIRECTORIES.CONFIG_PERMISSION));
}


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