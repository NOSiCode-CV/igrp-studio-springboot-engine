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
import { getMainPath } from '../../utils/helpers';
import { BASE_API_FILES } from '../baseApi/saveBaseApiFiles';
import { renderTemplate } from '../common/renderTemplate';

export const saveModuleConfig = async (context: RenderContext<ModuleConfig>, basePath: string) => {

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
  const { name: moduleName } = context.resourceConfig;
  const { group, packageName, projectStructureStyle } = context.baseConfig;
  const basePath = context.basePath;

  const mainPath = path.join(basePath, getMainPath(group, packageName));
  const modulePath = path.join(mainPath, moduleName);
  const domainPath = path.join(modulePath, DIRECTORIES.DOMAIN);

  const resolvePath = (templatePath: string) =>
    path.join(basePath, templatePath.replace('{{module}}', moduleName));

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

  if (projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
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
      },
      {
        output: path.join(domainPath, DIRECTORIES.EVENTS),
        template: TEMPLATES.GITKEEPFILE,
        name: COMMON_FILES.GITKEEPFILE,
      }
    );
  }

  return files;
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
