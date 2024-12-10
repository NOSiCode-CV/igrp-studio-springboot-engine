import fs from 'fs-extra';
import { getDDDModelOutputDir, getModelConfigPath, getModelOutputDir } from '../../utils/helpers';
import { ModelConfig, RenderContext } from '../../interfaces/types';
import { DIRECTORIES, ERROR_MESSAGE, PROJECT_STRUCTURE_STYLE } from '../../utils/constants';
import { updatePermissions } from '../permission/permissionManagement';

export const deleteModelConfig = async (context: RenderContext<ModelConfig>) => {

  let modelPath;

  if(context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
    modelPath = getDDDModelOutputDir(context);
  } else {
    modelPath = getModelOutputDir(context);
  }

  const modelConfigPath = getModelConfigPath(context.resourceConfig.module ?? DIRECTORIES.SHARED, context.resourceConfig.name, context.basePath);

  if (await fs.pathExists(modelPath)) await fs.rm(modelPath, { recursive: true });
  else throw ERROR_MESSAGE.MODEL_FILE_CONFIG_NOT_FOUNT;

  if (await fs.pathExists(modelConfigPath)) await fs.rm(modelConfigPath, { recursive: true });
  else throw ERROR_MESSAGE.MODEL_FILE_CONFIG_NOT_FOUNT;

  await updatePermissions(context.basePath, context.resourceConfig.type);
};
