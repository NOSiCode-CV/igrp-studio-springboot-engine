import path from "path";
import { ApiConfig, ModuleConfig, RenderContext } from '../../interfaces/types';
import { saveBinaryToFile, saveToFile } from '../common/saveToFile';
import {
  COMMON_FILES, CONFIG_FILES,
  DIRECTORIES, EXTENSIONS, OBSERVABILITY_BINARY_FILES,
  OBSERVABILITY_CONFIG_FILES,
  OBSERVABILITY_YAML_CONFIG_FILES, PROJECT_STRUCTURE_STYLE, TEMPLATE_DIR,
  TEMPLATES,
} from '../../utils/constants';
import { capitalize } from '../../utils/capitalizeStrings';
import { getMainPath } from '../../utils/helpers';
import { BASE_API_FILES } from '../baseApi/saveBaseApiFiles';
import { renderTemplate } from '../common/renderTemplate';
import fs from 'fs-extra';

export const saveModuleConfig = async (context: RenderContext<ModuleConfig>, basePath: string) => {

  const baseApiFiles = generateBaseModuleFiles(context);
  await saveBaseApiFiles(baseApiFiles, context);

  const baseApiFileOutputPah = path.join(
    basePath,
    DIRECTORIES.IGRPSTUDIO,
    context.resourceConfig.name,
    `${context.resourceConfig.type}${EXTENSIONS.JSON}`,
  );
  await saveToFile(JSON.stringify(context.resourceConfig), baseApiFileOutputPah);
}

const generateBaseModuleFiles = (context: RenderContext<ModuleConfig>): BASE_API_FILES => {

  context.baseConfig.name = capitalize(context.baseConfig.apiName);
  context.baseConfig.package = `${context.baseConfig.group}.${context.baseConfig.artifact}`;

  const mainPath =
    path.join(
      context.basePath,
      getMainPath(context.baseConfig.group, context.baseConfig.artifact)
    );

  if (context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {

    const modulePath = path.join(mainPath, context.resourceConfig.name);
    const domainPath = path.join(modulePath, DIRECTORIES.DOMAIN);
    const eventPath = path.join(domainPath, DIRECTORIES.EVENTS);

    return [

      // DOMAIN LAYER
      { output: eventPath, template: TEMPLATES.DDD_LITE_EVENT_PUBLISHER, name: COMMON_FILES.EVENT_PUBLISHER},

    ];

  }

  return [];

};

const saveBaseApiFiles = async (baseApiFiles: BASE_API_FILES, context: RenderContext<ModuleConfig>) => {
  // Generation and saving of the main files.
  await Promise.all(
    baseApiFiles.map(async (file) => {
      const outputPath = path.join(file.output, file.name);
      const template = await renderTemplate(file.template, context);
      await saveToFile(template, outputPath);
    }),
  );
};
