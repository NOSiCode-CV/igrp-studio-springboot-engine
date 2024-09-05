import path from 'path';
import { RenderContext } from '../../interfaces/types';
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
import { apiValidation } from '../../schema/apiConfig';

const APPLICATION_SUFFIX = 'Application.java';

export type BASE_API_FILES = { output: string; template: string; name: string }[];

export const saveFileConfig = async (context: RenderContext) => {
  const baseApiFiles = generateBaseAPIFiles(context);
  await saveBaseApiFiles(baseApiFiles, context);
};

const generateBaseAPIFiles = (context: RenderContext): BASE_API_FILES => {
  const valid = apiValidation(context.baseConfig);

  if (!valid && apiValidation.errors) throw apiValidation.errors;

  context.baseConfig.name = capitalize(context.baseConfig.apiName);
  context.baseConfig.package = `${context.baseConfig.group}.${context.baseConfig.artifact}`;
  const apiName = `${capitalize(context.baseConfig.apiName)}${APPLICATION_SUFFIX}`;

  const resourcePath = path.join(context.basePath, DIRECTORIES.RESOURCES);
  const mainPath = path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.artifact),
  );

  return [
    { output: mainPath, template: TEMPLATES.APPLICATION, name: apiName },
    {
      output: resourcePath,
      template: TEMPLATES.DOMAIN_RESOURCES,
      name: COMMON_FILES.APPLICATION_PROPERTIES,
    },
  ];
};

const saveBaseApiFiles = async (baseApiFiles: BASE_API_FILES, context: RenderContext) => {
  // Generation and saving of the main files.
  await Promise.all(
    baseApiFiles.map(async (file) => {
      const outputPath = path.join(file.output, file.name);
      const template = await renderTemplate(file.template, context);
      await saveToFile(template, outputPath);
    }),
  );

  // Generation and saving of additional configuration files.
  await Promise.all(
    CONFIG_FILES.map(async (file) => {
      const outputPath = path.join(context.basePath, file.output);
      const template = await renderTemplate(file.template, context);
      await saveToFile(template, outputPath);
    }),
  );
};
