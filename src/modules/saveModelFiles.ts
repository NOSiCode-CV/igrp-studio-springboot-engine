import path from 'path';
import { ModelConfig } from '../interfaces/types';
import { DIRECTORIES, EXTENSIONS, TEMPLATES } from '../utils/constants';
import { generateFromTemplate } from './generateFromTemplate';

export const saveModelFiles = async (config: ModelConfig, outputPath: string) => {
  const modelOutputIgrpstudio = path.join(outputPath, DIRECTORIES.IGRPSTUDIO, DIRECTORIES.MODELS);
  const MODEL_NAME = `${config.name}${EXTENSIONS.JSON}`;

  await generateFromTemplate(modelOutputIgrpstudio, TEMPLATES.IGRP_MODEL, MODEL_NAME, config);
};
