import { DIRECTORIES, ERROR_MESSAGE, EXTENSIONS } from './constants';
import path from 'path';
import fs from 'fs-extra';
import { ControllerConfig, DTOConfig, ModelConfig, RenderContext } from '../interfaces/types';

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

export const formatPackageName = (group: string, artifact: string) =>
  `${group}.${artifact}`.replace(/\./g, '/');

export const getTestPath = (group: string, artifact: string) =>
  `src/test/java/${formatPackageName(group, artifact)}`;

export const getMainPath = (group: string, artifact: string) =>
  `src/main/java/${formatPackageName(group, artifact)}`;

export const getModelConfigPath = (model: string, output: string) =>
  path.join(output, DIRECTORIES.CONFIG_MODEL, `${model}${EXTENSIONS.JSON}`);

export const getModelOutputDir = (context: RenderContext<ModelConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.artifact),
    DIRECTORIES.MODELS,
    context.resourceConfig.name
  );

export const getDtoOutputDir = (context: RenderContext<DTOConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.artifact),
    DIRECTORIES.DTO,
    context.resourceConfig.name
  );

export const getControllerConfigPath = (controller: string, output: string) =>
  path.join(output, DIRECTORIES.CONFIG_CONTROLLER, `${controller}${EXTENSIONS.JSON}`);

export const getControllerDir = (context: RenderContext<ControllerConfig | ModelConfig>) =>
  path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.artifact),
    DIRECTORIES.CONTROLLERS,
    context.resourceConfig.name,
  );
