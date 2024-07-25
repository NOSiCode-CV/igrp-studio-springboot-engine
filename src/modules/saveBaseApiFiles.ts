import path from 'path';
import fs from 'fs-extra';
import { ApiConfig } from '../interfaces/types';
import {
  DIRECTORIES,
  ERROR_MESSAGE,
  TEMPLATES,
  COMMON_FILES,
  CONFIG_FILES,
} from '../utils/constants';
import { capitalize } from '../utils/capitalizeStrings';
import { generateFromTemplate } from './generateFromTemplate';

const APPLICATION_SUFFIX = 'Application.java';

export const saveFileConfig = async (config: ApiConfig, outputDir: string) => {
  config.package = `${config.group}.${config.artifact}`;
  const mainPath = path.join(outputDir, DIRECTORIES.MAIN(config));
  const apiName = `${capitalize(config.apiName)}${APPLICATION_SUFFIX}`;
  const igrpstudioPath = path.join(outputDir, DIRECTORIES.IGRPSTUDIO);
  const resourcePath = path.join(outputDir, DIRECTORIES.RESOURCES);
  config.name = capitalize(config.apiName);

  if (!(await fs.pathExists(igrpstudioPath))) {
    throw ERROR_MESSAGE.DIRECTORY_DOES_NOT_EXISTS;
  }

  const MAIN_FILES = [
    { output: mainPath, template: TEMPLATES.APPLICATION, file: apiName },
    { output: igrpstudioPath, template: TEMPLATES.IGRP_BASE_API, file: COMMON_FILES.BASE_API },
    {
      output: resourcePath,
      template: TEMPLATES.DOMAIN_RESOURCES,
      file: COMMON_FILES.APPLICATION_PROPERTIES,
    },
  ];

  await Promise.all(
    MAIN_FILES.map((file) => generateFromTemplate(file.output, file.template, file.file, config)),
  );

  await Promise.all(
    CONFIG_FILES.map((file) => generateFromTemplate(outputDir, file.template, file.output, config)),
  );
};
