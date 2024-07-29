import path from 'path';
import fs from 'fs-extra';
import { ModelConfig } from '../interfaces/types';
import { DIRECTORIES, EXTENSIONS, TEMPLATES } from '../utils/constants';
import { templateGenerator } from './templateGenerator';

export const saveModelFiles = async (config: ModelConfig, outputPath: string) => {
  const MODEL_NAME = `${config.name}${EXTENSIONS.JSON}`;
  const modelOutputIgrpstudio = path.join(
    outputPath,
    DIRECTORIES.IGRPSTUDIO,
    DIRECTORIES.MODELS,
    MODEL_NAME,
  );

  const modelFile = await templateGenerator(TEMPLATES.IGRP_MODEL, config);

  await fs.writeFile(modelOutputIgrpstudio, modelFile, 'utf-8');
};
