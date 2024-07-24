import path from 'path';
import fs from 'fs-extra';
import { isApiConfig } from '../utils/checkFileType';
import { ApiConfig, ModelConfig } from '../interfaces/types';
import { generateFromTemplate } from './generateFromTemplate';
import { CONFIG_FILES, COMMON_FILES, TEMPLATES, ERROR_MESSAGE, DIRECTORIES } from '../utils/constants';
import { capitalize } from '../utils/capitalizeStrings';

const APPLICATION_SUFFIX = 'Application.java'

export const saveFileConfig = async (config: ApiConfig | ModelConfig, outputDir: string) => {

  if (isApiConfig(config)) {
    const apiName = `${capitalize(config.apiName)}${APPLICATION_SUFFIX}`;
    const igrpstudioPath = path.join(outputDir, DIRECTORIES.IGRPSTUDIO);

    if (!(await fs.pathExists(igrpstudioPath))) {
      throw ERROR_MESSAGE.DIRECTORY_DOES_NOT_EXISTS;
    }
    await generateFromTemplate(igrpstudioPath, TEMPLATES.IGRP_BASE_API, COMMON_FILES.BASE_API, config);

    await generateFromTemplate(outputDir, TEMPLATES.APPLICATION, apiName, config);

    await Promise.all(
      CONFIG_FILES.map((file) =>
        generateFromTemplate(outputDir, file.template, file.output, config),
      ),
    );
  }
};