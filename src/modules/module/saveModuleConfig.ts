import path from 'path';
import { ModuleConfig, RenderContext } from '../../interfaces/types';
import { saveToFile } from '../common/saveToFile';
import {
  COMMON_FILES,
  DIRECTORIES,
  EXTENSIONS,
  PROJECT_STRUCTURE_STYLE,
  TEMPLATES,
} from '../../utils/constants';
import { capitalize } from '../../helper/stringHelper';
import { getMainPath } from '../../utils/helpers';
import { BASE_API_FILES } from '../baseApi/saveBaseApiFiles';
import { renderTemplate } from '../common/renderTemplate';

export const saveModuleConfig = async (context: RenderContext<ModuleConfig>, basePath: string) => {
  // No need to save any file when creating a module yet
  //const baseApiFiles = generateBaseModuleFiles(context);
  //await saveBaseApiFiles(baseApiFiles, context);

  const baseApiFileOutputPah = path.join(
    basePath,
    DIRECTORIES.IGRPSTUDIO,
    context.resourceConfig.name,
    `${context.resourceConfig.type}${EXTENSIONS.JSON}`,
  );
  await saveToFile(JSON.stringify(context.resourceConfig, null, 2), baseApiFileOutputPah);

  const gitkeepFiles = generateGitKeepFile(context);
  await saveBaseApiFiles(gitkeepFiles, context);
};

const generateGitKeepFile = (context: RenderContext<ModuleConfig>): BASE_API_FILES => {
  const moduleName = context.resourceConfig.name;

  const resolvePath = (templatePath: string) =>
    path.join(context.basePath, templatePath.replace('{{module}}', moduleName));

  const modulePath = path.join(context.basePath, moduleName);
  const domainPath = path.join(modulePath, DIRECTORIES.DOMAIN);

  const files: BASE_API_FILES = [
    {
      output: resolvePath(DIRECTORIES.CONFIG_MODEL),
      template: TEMPLATES.GITKEEPFILE,
      name: COMMON_FILES.GITKEEPFILE,
    },
    {
      output: resolvePath(DIRECTORIES.CONFIG_DTO),
      template: TEMPLATES.GITKEEPFILE,
      name: COMMON_FILES.GITKEEPFILE,
    },
  ];

  if (context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
    files.push(
      {
        output: path.join(domainPath, DIRECTORIES.MODELS),
        template: TEMPLATES.GITKEEPFILE,
        name: COMMON_FILES.GITKEEPFILE,
      },
      {
        output: path.join(domainPath, DIRECTORIES.SERVICE),
        template: TEMPLATES.GITKEEPFILE,
        name: COMMON_FILES.GITKEEPFILE,
      },
      {
        output: path.join(domainPath, DIRECTORIES.REPOSITORY),
        template: TEMPLATES.GITKEEPFILE,
        name: COMMON_FILES.GITKEEPFILE,
      }
    );
  }

  return files;
};


const generateBaseModuleFiles = (context: RenderContext<ModuleConfig>): BASE_API_FILES => {
  context.baseConfig.name = capitalize(context.baseConfig.name);
  context.baseConfig.package = `${context.baseConfig.group}.${context.baseConfig.packageName}`;

  const mainPath = path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.packageName),
  );

  if (context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
    const modulePath = path.join(mainPath, context.resourceConfig.name);
    const domainPath = path.join(modulePath, DIRECTORIES.DOMAIN);
    const eventPath = path.join(domainPath, DIRECTORIES.EVENTS);

    return [
      // DOMAIN LAYER
      {
        output: eventPath,
        template: TEMPLATES.DDD_LITE_EVENT_PUBLISHER,
        name: COMMON_FILES.EVENT_PUBLISHER,
      },
    ];
  }

  return [];
};

const saveBaseApiFiles = async (
  baseApiFiles: BASE_API_FILES,
  context: RenderContext<ModuleConfig>,
) => {
  // Generation and saving of the main files.
  await Promise.all(
    baseApiFiles.map(async (file) => {
      const outputPath = path.join(file.output, file.name);
      const template = await renderTemplate(file.template, context);
      await saveToFile(template, outputPath);
    }),
  );
};
