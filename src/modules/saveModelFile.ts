import path from 'path';
import fs from 'fs-extra';
import { ModelConfig } from '../interfaces/types';
import { templateGenerator } from './templateGenerator';
import { DIRECTORIES, ERROR_MESSAGE, EXTENSIONS, TEMPLATES } from '../utils/constants';

export const saveModelFile = async (config: ModelConfig, output: string) => {
  if (!config || !config.type || !config.name || !config.attributs) {
    throw ERROR_MESSAGE.INVALID_MODEL_CONFIG;
  }
  
  if (!output || !(await fs.pathExists(output))) {
    throw ERROR_MESSAGE.INVALID_OUTPUT_PATH
  }

  if (config.attributs.length === 0) {
    throw ERROR_MESSAGE.EMPTY_ATTRIBUTE;
  }

  const MODEL_NAME = `${config.name}${EXTENSIONS.JSON}`;
  const modelOutputIgrpstudio = path.join(
    output,
    DIRECTORIES.IGRPSTUDIO,
    DIRECTORIES.MODELS,
    MODEL_NAME,
  );

  const modelFile = await templateGenerator(TEMPLATES.IGRP_MODEL, config);

  await fs.writeFile(modelOutputIgrpstudio, modelFile, 'utf-8');
  
};
