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
import { generateTemplate } from './generateTemplate';

const APPLICATION_SUFFIX = 'Application.java';

export const saveFileConfig = async (config: ApiConfig, outputDir: string) => {
  config.name = capitalize(config.apiName);
  config.package = `${config.group}.${config.artifact}`;
  const mainPath = path.join(outputDir, DIRECTORIES.MAIN(config.group, config.artifact));
  const resourcePath = path.join(outputDir, DIRECTORIES.RESOURCES);
  const igrpstudioPath = path.join(outputDir, DIRECTORIES.IGRPSTUDIO);
  const apiName = `${capitalize(config.apiName)}${APPLICATION_SUFFIX}`;

  if (!(await fs.pathExists(igrpstudioPath))) {
    throw ERROR_MESSAGE.DIRECTORY_DOES_NOT_EXISTS;
  }

  const MAIN_FILES = [
    { output: mainPath, template: TEMPLATES.APPLICATION, name: apiName },
    { output: igrpstudioPath, template: TEMPLATES.IGRP_BASE_API, name: COMMON_FILES.BASE_API },
    {
      output: resourcePath,
      template: TEMPLATES.DOMAIN_RESOURCES,
      name: COMMON_FILES.APPLICATION_PROPERTIES,
    },
  ];

  await Promise.all(
    MAIN_FILES.map(async (file) => {
      const outputPath = path.join(file.output, file.name)
      const template = await generateTemplate(file.template, config)
      await fs.writeFile(outputPath, template, 'utf-8');
    })
  );

  await Promise.all(
    CONFIG_FILES.map( async (file) => {
      const outputPath = path.join(outputDir, file.output);
      const template = await generateTemplate(file.template, config);
      await fs.writeFile(outputPath, template, 'utf-8');
    })
  );
};
