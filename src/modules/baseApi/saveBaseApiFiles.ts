import path from 'path';
import { RenderContext } from '../../interfaces/types';
import {
  DIRECTORIES,
  TEMPLATES,
  COMMON_FILES,
  CONFIG_FILES,
  OBSERVABILITY_CONFIG_FILES,
  OBSERVABILITY_BINARY_FILES,
  TEMPLATE_DIR,
  OBSERVABILITY_YAML_CONFIG_FILES,
  PROJECT_STRUCTURE_STYLE,
} from '../../utils/constants';
import { capitalize } from '../../utils/capitalizeStrings';
import { renderTemplate } from '../common/renderTemplate';
import { getMainPath } from '../../utils/helpers';
import { saveBinaryToFile, saveToFile } from '../common/saveToFile';
import fs from 'fs-extra';

const APPLICATION_SUFFIX = 'Application.java';

export type BASE_API_FILES = { output: string; template: string; name: string }[];

export const saveFileConfig = async (context: RenderContext) => {
  const baseApiFiles = generateBaseAPIFiles(context);
  await saveBaseApiFiles(baseApiFiles, context);
};

const generateBaseAPIFiles = (context: RenderContext): BASE_API_FILES => {

  context.baseConfig.name = capitalize(context.baseConfig.apiName);
  context.baseConfig.package = `${context.baseConfig.group}.${context.baseConfig.artifact}`;
  const apiName = `${capitalize(context.baseConfig.apiName)}${APPLICATION_SUFFIX}`;

  const resourcePath = path.join(context.basePath, DIRECTORIES.RESOURCES);

  const mainPath = 
    path.join(
      context.basePath,
      getMainPath(context.baseConfig.group, context.baseConfig.artifact)
    );
  
  if (context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {

    const sharedPath = path.join(mainPath, DIRECTORIES.SHARED);
    const configPath = path.join(sharedPath, 'config');
    const securityPath = path.join(sharedPath, 'security');
    const applicationPath = path.join(sharedPath, DIRECTORIES.APPLICATION);
    const commandPath = path.join(applicationPath, DIRECTORIES.COMMANDS);
    const queryPath = path.join(applicationPath, DIRECTORIES.QUERIES);
    const domainPath = path.join(sharedPath, DIRECTORIES.DOMAIN);
    const eventPath = path.join(domainPath, DIRECTORIES.EVENTS);
    const infraPath = path.join(sharedPath, DIRECTORIES.INFRASTRUCTURE);

    return [
      { output: mainPath, template: TEMPLATES.APPLICATION, name: apiName },

      // DOMAIN LAYER
      { output: eventPath, template: TEMPLATES.DDD_LITE_EVENT_PUBLISHER, name: COMMON_FILES.EVENT_PUBLISHER},

      {
        output: configPath,
        template: TEMPLATES.DOMAIN_MODEL_AUDIT,
        name: COMMON_FILES.AUDIT_ENTITY,
      },
      {
        output: resourcePath,
        template: TEMPLATES.DDD_DOMAIN_RESOURCES,
        name: COMMON_FILES.APPLICATION_PROPERTIES_FILE,
      },
      {
        output: resourcePath,
        template: TEMPLATES.DDD_DOMAIN_RESOURCES_LOCAL,
        name: COMMON_FILES.APPLICATION_PROPERTIES_FILE_LOCAL,
      },
      {
        output: resourcePath,
        template: TEMPLATES.DDD_DOMAIN_RESOURCES_DOCKER,
        name: COMMON_FILES.APPLICATION_PROPERTIES_FILE_DOCKER,
      },
      {
        output: configPath,
        template: TEMPLATES.APPLICATION_AUDIT_AWARE,
        name: COMMON_FILES.APPLICATION_AUDIT_AWARE,
      },
      {
        output: securityPath,
        template: TEMPLATES.CONFIG_SECURITY,
        name: COMMON_FILES.APPLICATION_SECURITY,
      },
    ];

  } else {
    const configPath = path.join(mainPath, 'config');
    const securityPath = path.join(mainPath, 'security');

    return [
      { output: mainPath, template: TEMPLATES.APPLICATION, name: apiName },
      {
        output: configPath,
        template: TEMPLATES.DOMAIN_MODEL_AUDIT,
        name: COMMON_FILES.AUDIT_ENTITY,
      },
      {
        output: resourcePath,
        template: TEMPLATES.DOMAIN_RESOURCES,
        name: COMMON_FILES.APPLICATION_PROPERTIES_FILE,
      },
      {
        output: configPath,
        template: TEMPLATES.APPLICATION_AUDIT_AWARE,
        name: COMMON_FILES.APPLICATION_AUDIT_AWARE,
      },
      {
        output: securityPath,
        template: TEMPLATES.CONFIG_SECURITY,
        name: COMMON_FILES.APPLICATION_SECURITY,
      },
    ];

    /*
    DDD FULL

    const applicationPath = path.join(mainPath, DIRECTORIES.APPLICATION);
    const queryPath = path.join(applicationPath, DIRECTORIES.QUERY);
    const domainPath = path.join(mainPath, DIRECTORIES.DOMAIN);
    const infraPath = path.join(mainPath, DIRECTORIES.INFRASTRUCTURE);
    const dbPath = path.join(infraPath, DIRECTORIES.DATABASE);

    return [
      { output: mainPath, template: TEMPLATES.APPLICATION, name: apiName },

      // APPLICATION LAYER
      { output: path.join(applicationPath, DIRECTORIES.COMMAND), template: TEMPLATES.DDD_COMMAND, name: COMMON_FILES.COMMAND},
      { output: path.join(applicationPath, DIRECTORIES.COMMAND), template: TEMPLATES.DDD_COMMAND_BUS, name: COMMON_FILES.COMMAND_BUS},
      { output: path.join(applicationPath, DIRECTORIES.COMMAND), template: TEMPLATES.DDD_COMMAND_HANDLER, name: COMMON_FILES.COMMAND_HANDLER},
      { output: path.join(applicationPath, DIRECTORIES.COMMAND), template: TEMPLATES.DDD_COMMAND_LISTENER, name: COMMON_FILES.COMMAND_LISTENER},

      { output: path.join(queryPath, DIRECTORIES.ASSEMBLER), template: TEMPLATES.DDD_ASSEMBLER, name: COMMON_FILES.ASSEMBLER},

      // DOMAIN LAYER
      { output: path.join(domainPath, DIRECTORIES.AGGREGATE), template: TEMPLATES.DDD_AGGREGATE, name: COMMON_FILES.AGGREGATE},
      { output: path.join(domainPath, DIRECTORIES.AGGREGATE), template: TEMPLATES.DDD_AGGREGATE_IDENTIFIER, name: COMMON_FILES.AGGREGATE_IDENTIFIER},
      { output: path.join(domainPath, DIRECTORIES.AGGREGATE), template: TEMPLATES.DDD_AGGREGATE_ROOT, name: COMMON_FILES.AGGREGATE_ROOT},
      { output: path.join(domainPath, DIRECTORIES.AGGREGATE), template: TEMPLATES.DDD_VALUE_OBJECT, name: COMMON_FILES.VALUE_OBJECT},

      { output: path.join(domainPath, DIRECTORIES.EVENT), template: TEMPLATES.DDD_EVENT, name: COMMON_FILES.EVENT},
      { output: path.join(domainPath, DIRECTORIES.EVENT), template: TEMPLATES.DDD_EVENT_BUS, name: COMMON_FILES.EVENT_BUS},
      { output: path.join(domainPath, DIRECTORIES.EVENT), template: TEMPLATES.DDD_EVENT_LISTENER, name: COMMON_FILES.EVENT_LISTENER},

      { output: domainPath, template: TEMPLATES.DDD_DOMAIN_ENTITY, name: COMMON_FILES.DOMAIN_ENTITY},

      // INFRASTRUCTURE LAYER
      { output: path.join(infraPath, DIRECTORIES.CACHE), template: TEMPLATES.DDD_CACHE_SERVICE, name: COMMON_FILES.CACHE_SERVICE},
      
      { output: path.join(dbPath, DIRECTORIES.CONVERTER), template: TEMPLATES.DDD_CONVERTER, name: COMMON_FILES.CONVERTER},
      { output: path.join(dbPath, DIRECTORIES.DATA_OBJECT), template: TEMPLATES.DDD_DATA_OBJECT, name: COMMON_FILES.DATA_OBJECT},
      { output: path.join(dbPath, DIRECTORIES.ENTITY), template: TEMPLATES.DDD_ENTITY_BASE, name: COMMON_FILES.ENTITY_BASE},
      { output: path.join(dbPath, DIRECTORIES.REPOSITORY), template: TEMPLATES.DDD_BASE_REPOSITORY, name: COMMON_FILES.BASE_REPOSITORY},

      { output: path.join(infraPath, DIRECTORIES.SPRING), template: TEMPLATES.DDD_SPRING_COMMAND_BUS, name: COMMON_FILES.SPRING_COMMAND_BUS},
      { output: path.join(infraPath, DIRECTORIES.SPRING), template: TEMPLATES.DDD_SPRING_EVENT_BUS, name: COMMON_FILES.SPRING_EVENT_BUS},

      {
        output: configPath,
        template: TEMPLATES.DOMAIN_MODEL_AUDIT,
        name: COMMON_FILES.AUDIT_ENTITY,
      },
      {
        output: resourcePath,
        template: TEMPLATES.DDD_DOMAIN_RESOURCES,
        name: COMMON_FILES.APPLICATION_PROPERTIES_FILE,
      },
      {
        output: resourcePath,
        template: TEMPLATES.DDD_DOMAIN_RESOURCES_LOCAL,
        name: COMMON_FILES.APPLICATION_PROPERTIES_FILE_LOCAL,
      },
      {
        output: resourcePath,
        template: TEMPLATES.DDD_DOMAIN_RESOURCES_DOCKER,
        name: COMMON_FILES.APPLICATION_PROPERTIES_FILE_DOCKER,
      },
      {
        output: configPath,
        template: TEMPLATES.APPLICATION_AUDIT_AWARE,
        name: COMMON_FILES.APPLICATION_AUDIT_AWARE,
      },
      {
        output: securityPath,
        template: TEMPLATES.CONFIG_SECURITY,
        name: COMMON_FILES.APPLICATION_SECURITY,
      },
    ];

  } else {
    const configPath = path.join(mainPath, 'config');
    const securityPath = path.join(mainPath, 'security');

    return [
      { output: mainPath, template: TEMPLATES.APPLICATION, name: apiName },
      {
        output: configPath,
        template: TEMPLATES.DOMAIN_MODEL_AUDIT,
        name: COMMON_FILES.AUDIT_ENTITY,
      },
      {
        output: resourcePath,
        template: TEMPLATES.DOMAIN_RESOURCES,
        name: COMMON_FILES.APPLICATION_PROPERTIES,
      },
      {
        output: configPath,
        template: TEMPLATES.APPLICATION_AUDIT_AWARE,
        name: COMMON_FILES.APPLICATION_AUDIT_AWARE,
      },
      {
        output: securityPath,
        template: TEMPLATES.CONFIG_SECURITY,
        name: COMMON_FILES.APPLICATION_SECURITY,
      },
    ];*/
  }
};

function getSubfolder(file: {template: string; output: string}) {
  switch (file.template) {
    case TEMPLATES.MONITORING_COLLECTOR:
      return "collector"
    case TEMPLATES.MONITORING_PROMETHEUS:
      return "prometheus"
    case TEMPLATES.MONITORING_PROMTAIL:
      return "promtail"
    case TEMPLATES.MONITORING_TEMPO:
      return "tempo"
    default:
      return ""
  }
}

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
  if(context.baseConfig.enableObservability) {
    await Promise.all(
      OBSERVABILITY_YAML_CONFIG_FILES.map(async (file) => {
        const basePath = path.join(context.basePath, DIRECTORIES.MONITORING);
        const subPath = path.join(basePath, getSubfolder(file));
        const outputPath = path.join(subPath, file.output);
        const template = await renderTemplate(file.template, context);
        await saveToFile(template, outputPath);
      }),
    );
    await Promise.all(
      OBSERVABILITY_CONFIG_FILES.map(async (file) => {
        const outputPath = path.join(context.basePath, file.output);
        const template = await renderTemplate(file.template, context);
        await saveToFile(template, outputPath, false);
      }),
    );
    await Promise.all(
      OBSERVABILITY_BINARY_FILES.map(async (file) => {
        const outputPath = path.join(context.basePath, file.output);
        const templatePath = path.join(TEMPLATE_DIR, file.template);
        const binaryContent = await fs.readFile(templatePath);
        await saveBinaryToFile(binaryContent, outputPath, false);
      })
    );
  } else {
    await Promise.all(
      CONFIG_FILES.map(async (file) => {
        const outputPath = path.join(context.basePath, file.output);
        const template = await renderTemplate(file.template, context);
        await saveToFile(template, outputPath, false);
      }),
    );
  }
};
