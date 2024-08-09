import path from 'path';
import { ApiConfig } from '../../interfaces/types';
import {
  DIRECTORIES,
  ERROR_MESSAGE,
  TEMPLATES,
  COMMON_FILES,
  CONFIG_FILES,
} from '../../utils/constants';
import { capitalize } from '../../utils/capitalizeStrings';
import { renderTemplate } from '../common/renderTemplate';
import { getMainPath } from '../../utils/helpers';
import { saveToFile } from '../common/saveToFile';

const APPLICATION_SUFFIX = 'Application.java';

export type BASE_API_FILES = {output: string, template: string, name: string}[];


export const saveFileConfig = async (config: ApiConfig, outputDir: string) => {
  const baseApiFiles = generateBaseAPIFiles(config, outputDir);
  await saveBaseApiFiles(baseApiFiles, config, outputDir);
}

/**
 * Function that creates the api files
 * @param config - API base configuration file containning all the basic API information.
 * @param outputDir - Output path where directories are created
 */
export const generateBaseAPIFiles = (config: ApiConfig, outputDir: string): BASE_API_FILES => {
  if (!config || !config.apiName || !config.group || !config.artifact) {
    throw ERROR_MESSAGE.INVALID_API_CONFIG
  }

  if (!outputDir) {
    throw ERROR_MESSAGE.INVALID_OUTPUT_PATH
  }

  config.name = capitalize(config.apiName);
  config.package = `${config.group}.${config.artifact}`;
  const apiName = `${capitalize(config.apiName)}${APPLICATION_SUFFIX}`;

  const resourcePath = path.join(outputDir, DIRECTORIES.RESOURCES);
  const igrpstudioPath = path.join(outputDir, DIRECTORIES.IGRPSTUDIO);
  const mainPath = path.join(outputDir, getMainPath(config.group, config.artifact));

  return [
    { output: mainPath, template: TEMPLATES.APPLICATION, name: apiName },
    { output: igrpstudioPath, template: TEMPLATES.IGRP_BASE_API, name: COMMON_FILES.BASE_API },
    { output: resourcePath, template: TEMPLATES.DOMAIN_RESOURCES, name: COMMON_FILES.APPLICATION_PROPERTIES },
  ];


};

const saveBaseApiFiles = async (baseApiFiles: BASE_API_FILES, config: ApiConfig, outputDir: string) => {
  // Generation and saving of the main files.
  await Promise.all(
    baseApiFiles.map(async (file) => {
      const outputPath = path.join(file.output, file.name)
      const template = await renderTemplate(file.template, config)
      await saveToFile(template, outputPath);
    })
  );

  // Generation and saving of additional configuration files.
  await Promise.all(
    CONFIG_FILES.map(async (file) => {
      const outputPath = path.join(outputDir, file.output);
      const template = await renderTemplate(file.template, config);
      await saveToFile(template, outputPath);
    })
  );
}
