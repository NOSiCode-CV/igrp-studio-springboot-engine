import path from 'path';
import { RenderContext } from '../../interfaces/types';
import {
  TEMPLATES,
} from '../../utils/constants';
import { capitalize } from '../../utils/capitalizeStrings';
import { renderTemplate } from '../common/renderTemplate';
import { getTestPath } from '../../utils/helpers';
import { saveToFile } from '../common/saveToFile';

const APPLICATION_SUFFIX = 'ApplicationTests.java';

export type BASE_API_FILES = { output: string; template: string; name: string }[];

export const saveBaseTestApiFileConfig = async (context: RenderContext) => {
  const baseApiFiles = generateBaseAPIFiles(context);
  await saveBaseApiFiles(baseApiFiles, context);
};

const generateBaseAPIFiles = (context: RenderContext): BASE_API_FILES => {

  context.baseConfig.name = capitalize(context.baseConfig.apiName);
  context.baseConfig.package = `${context.baseConfig.group}.${context.baseConfig.packageName}`;
  const apiName = `${capitalize(context.baseConfig.apiName)}${APPLICATION_SUFFIX}`;

  const testPath =
    path.join(
      context.basePath,
      getTestPath(context.baseConfig.group, context.baseConfig.packageName)
    );

  context.fullPath = testPath;

  return [
    { output: testPath, template: TEMPLATES.APPLICATION_TEST, name: apiName },
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

};
