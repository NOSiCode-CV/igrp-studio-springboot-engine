import path from 'path';
import fs from 'fs-extra';
import { ApiConfig } from '../../interfaces/types';
import {
  DIRECTORIES,
  ERROR_MESSAGE,
  TEMPLATES,
  COMMON_FILES,
  CONFIG_FILES,
} from '../../utils/constants';
import { capitalize } from '../../utils/capitalizeStrings';
import { templateGenerator } from '../common/templateGenerator';
import { getMainPath } from '../../utils/helpers';
import { saveToFile } from '../common/saveToFile';

const APPLICATION_SUFFIX = 'Application.java';

/**
 * Function that creates the api files
 * @param {ApiConfig} config - API base configuration file containning all the basic API information.
 * @param {string} outputDir - Output path where directories are created
 */
export const saveFileConfig = async (config: ApiConfig, outputDir: string) => {
  if (!config || !config.apiName || !config.group || !config.artifact){
    throw ERROR_MESSAGE.INVALID_API_CONFIG
  }

  if(!outputDir){
    throw ERROR_MESSAGE.INVALID_OUTPUT_PATH
  }

  config.name = capitalize(config.apiName);
  config.package = `${config.group}.${config.artifact}`;
  const apiName = `${capitalize(config.apiName)}${APPLICATION_SUFFIX}`;

  const resourcePath = path.join(outputDir, DIRECTORIES.RESOURCES);
  const igrpstudioPath = path.join(outputDir, DIRECTORIES.IGRPSTUDIO);
  const mainPath = path.join(outputDir, getMainPath(config.group, config.artifact));


  if (!(await fs.pathExists(igrpstudioPath))) {
    throw ERROR_MESSAGE.DIRECTORY_DOES_NOT_EXIST;
  }

  if (!(await fs.pathExists(mainPath))) {
    throw ERROR_MESSAGE.DIRECTORY_DOES_NOT_EXIST;
  }

  if (!(await fs.pathExists(resourcePath))) {
    throw ERROR_MESSAGE.DIRECTORY_DOES_NOT_EXIST;
  }

  const MAIN_FILES = [
    { output: mainPath, template: TEMPLATES.APPLICATION, name: apiName },
    { output: igrpstudioPath, template: TEMPLATES.IGRP_BASE_API, name: COMMON_FILES.BASE_API },
    { output: resourcePath, template: TEMPLATES.DOMAIN_RESOURCES, name: COMMON_FILES.APPLICATION_PROPERTIES },
  ];

   // Generation and saving of the main files.
  await Promise.all(
    MAIN_FILES.map(async (file) => {
      const outputPath = path.join(file.output, file.name)
      const template = await templateGenerator(file.template, config)
      await saveToFile(template, outputPath);
    })
  );

   // Generation and saving of additional configuration files.
  await Promise.all(
    CONFIG_FILES.map( async (file) => {
      const outputPath = path.join(outputDir, file.output);
      const template = await templateGenerator(file.template, config);
      await saveToFile(template, outputPath);
    })
  );
};
