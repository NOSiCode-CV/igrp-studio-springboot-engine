import path from 'path';
import fs from 'fs-extra';
import { ModelConfig } from '../interfaces/types';
import { DIRECTORIES, ERROR_MESSAGE, EXTENSIONS, TEMPLATES } from '../utils/constants';
import { templateGenerator } from './templateGenerator';

export const updateModel = async (config: ModelConfig, output: string) => {
  if (!config) {
    throw ERROR_MESSAGE.INVALID_MODEL_CONFIG;
  }

  if (!output) {
    throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;
  }

  const MODEL_NAME = `${config.name}${EXTENSIONS.JSON}`;
  const igrpstudioPath = path.join(output, DIRECTORIES.IGRPSTUDIO, DIRECTORIES.MODELS, MODEL_NAME);
  const modelFile = await templateGenerator(TEMPLATES.IGRP_MODEL, config);

  await fs.writeFile(igrpstudioPath, modelFile, 'utf-8');
  
};
