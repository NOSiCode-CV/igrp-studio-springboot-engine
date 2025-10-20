import path from 'path';
import {RenderContext} from '../../interfaces/types';
import {
  COMMON_FILES,
  CONFIG_FILES,
  CONFIG_FILES_GRAALVM,
  DIRECTORIES,
  OBSERVABILITY_BINARY_FILES,
  OBSERVABILITY_CONFIG_FILES,
  OBSERVABILITY_CONFIG_FILES_GRAALVM,
  OBSERVABILITY_YAML_CONFIG_FILES,
  PROJECT_STRUCTURE_STYLE,
  TEMPLATES,
} from '../../utils/constants';
import {capitalize} from '../../helper/stringHelper';
import {renderTemplate} from '../common/renderTemplate';
import {getMainPath} from '../../utils/helpers';
import {saveBinaryToFile, saveToFile} from '../common/saveToFile';
import fs from 'fs-extra';
import {getPaths} from '../../index';

const APPLICATION_SUFFIX = 'Application.java';

export type BASE_API_FILES = { output: string; template: string; name: string }[];

export const saveFileConfig = async (context: RenderContext) => {
  const baseApiFiles = generateBaseAPIFiles(context);
  await saveBaseApiFiles(baseApiFiles, context);
};

const generateBaseAPIFiles = (context: RenderContext): BASE_API_FILES => {
  context.baseConfig.name = capitalize(context.baseConfig.name);
  context.baseConfig.package = `${context.baseConfig.group}.${context.baseConfig.packageName}`;
  const name = `${capitalize(context.baseConfig.name)}${APPLICATION_SUFFIX}`;

  const resourcePath = path.join(context.basePath, DIRECTORIES.RESOURCES);

  const mainPath = path.join(
    context.basePath,
    getMainPath(context.baseConfig.group, context.baseConfig.packageName),
  );

  let files: BASE_API_FILES = [];

  const igrpstudioSharedPath = path.join(context.basePath, DIRECTORIES.IGRPSTUDIO, DIRECTORIES.SHARED);
  //console.log('igrpstudioPath:: ' + igrpstudioSharedPath);

  if (context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
    const sharedPath = path.join(mainPath, DIRECTORIES.SHARED);
    const configPath = path.join(sharedPath, 'config');
    const securityPath = path.join(sharedPath, 'security');
    const domainPath = path.join(sharedPath, DIRECTORIES.DOMAIN);
    const eventPath = path.join(domainPath, DIRECTORIES.EVENTS);
    const exceptionsPath = path.join(domainPath, DIRECTORIES.EXCEPTIONS);
    const infraPath = path.join(sharedPath, DIRECTORIES.INFRASTRUCTURE);
    const kubernetesPath = path.join(context.basePath, 'k8s');

    if (context.baseConfig.enableGraalVm) {
      files.push({
        output: configPath,
        template: TEMPLATES.ENVER_HINTS_GRAALVM_CONFIG,
        name: COMMON_FILES.ENVER_HINTS_GRAALVM_CONFIG_JAVA_FILE,
      });

      if (context.baseConfig.enableObservability) {
        files.push({
          output: configPath,
          template: TEMPLATES.OPEN_TELEMETRY_CONFIG_GRAALVM,
          name: COMMON_FILES.OPEN_TELEMETRY_CONFIG_JAVA_FILE,
        });
      }
    }

    files.push(
      { output: mainPath, template: TEMPLATES.APPLICATION, name: name },

      {
        output: kubernetesPath,
        template: TEMPLATES.CONFIG_DEPLOYMENT,
        name: COMMON_FILES.DEPLOYMENT,
      },
      { output: kubernetesPath, template: TEMPLATES.CONFIG_INGRESS, name: COMMON_FILES.INGRESS },
      { output: kubernetesPath, template: TEMPLATES.CONFIG_CLUSTER, name: COMMON_FILES.CLUSTER },
      {
        output: kubernetesPath,
        template: TEMPLATES.CONFIG_SERVICE,
        name: COMMON_FILES.SERVICE_K8S,
      },

      // DOMAIN LAYER
      {
        output: eventPath,
        template: TEMPLATES.DDD_LITE_EVENT_PUBLISHER,
        name: COMMON_FILES.EVENT_PUBLISHER,
      },

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
        output: resourcePath,
        template: TEMPLATES.APPLICATION_RESOURCES_DEVELOPMENT,
        name: COMMON_FILES.APPLICATION_PROPERTIES_FILE_DEVELOPMENT,
      },
      {
        output: resourcePath,
        template: TEMPLATES.APPLICATION_RESOURCES_STAGING,
        name: COMMON_FILES.APPLICATION_PROPERTIES_FILE_STAGING,
      },
      {
        output: resourcePath,
        template: TEMPLATES.APPLICATION_RESOURCES_PRODUCTION,
        name: COMMON_FILES.APPLICATION_PROPERTIES_FILE_PRODUCTION,
      },
      {
        output: resourcePath,
        template: TEMPLATES.APPLICATION_RESOURCES_BANNER,
        name: COMMON_FILES.APPLICATION_BANNER_FILE,
      },
      {
        output: configPath,
        template: TEMPLATES.SWAGGER_CONFIG,
        name: COMMON_FILES.SWAGGER_CONFIG,
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
      {
        output: exceptionsPath,
        template: TEMPLATES.GLOBAL_EXCEPTION_HANDLER,
        name: COMMON_FILES.GLOBAL_EXCEPTION_HANDLER,
      },
      {
        output: exceptionsPath,
        template: TEMPLATES.IGRP_RESPONSE_STATUS_EXCEPTION,
        name: COMMON_FILES.IGRP_RESPONSE_STATUS_EXCEPTION,
      },
      {
        output: path.join(infraPath, DIRECTORIES.SPRING),
        template: TEMPLATES.DDD_SPRING_COMMAND_BUS,
        name: COMMON_FILES.SPRING_COMMAND_BUS,
      },

      {
        output: path.join(infraPath, DIRECTORIES.SPRING),
        template: TEMPLATES.DDD_SPRING_QUERY_BUS,
        name: COMMON_FILES.SPRING_QUERY_BUS,
      },

      {
        output: path.join(igrpstudioSharedPath, DIRECTORIES.DTO),
        template: TEMPLATES.GITKEEPFILE,
        name: COMMON_FILES.GITKEEPFILE,
      },
      {
        output: path.join(igrpstudioSharedPath, DIRECTORIES.MODELS),
        template: TEMPLATES.GITKEEPFILE,
        name: COMMON_FILES.GITKEEPFILE,
      },
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
  } else {
    const configPath = path.join(mainPath, 'config');
    const securityPath = path.join(mainPath, 'security');
    const exceptionPath = path.join(mainPath, 'exceptions');
    const kubernetesPath = path.join(context.basePath, 'k8s');

    if (context.baseConfig.enableGraalVm) {
      files.push({
        output: configPath,
        template: TEMPLATES.ENVER_HINTS_GRAALVM_CONFIG,
        name: COMMON_FILES.ENVER_HINTS_GRAALVM_CONFIG_JAVA_FILE,
      });

      if (context.baseConfig.enableObservability) {
        files.push({
          output: configPath,
          template: TEMPLATES.OPEN_TELEMETRY_CONFIG_GRAALVM,
          name: COMMON_FILES.OPEN_TELEMETRY_CONFIG_JAVA_FILE,
        });
      }
    }

    files.push(
      { output: mainPath, template: TEMPLATES.APPLICATION, name: name },
      {
        output: kubernetesPath,
        template: TEMPLATES.CONFIG_DEPLOYMENT,
        name: COMMON_FILES.DEPLOYMENT,
      },
      { output: kubernetesPath, template: TEMPLATES.CONFIG_INGRESS, name: COMMON_FILES.INGRESS },
      { output: kubernetesPath, template: TEMPLATES.CONFIG_CLUSTER, name: COMMON_FILES.CLUSTER },
      {
        output: kubernetesPath,
        template: TEMPLATES.CONFIG_SERVICE,
        name: COMMON_FILES.SERVICE_K8S,
      },
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
        output: resourcePath,
        template: TEMPLATES.APPLICATION_RESOURCES_DEVELOPMENT,
        name: COMMON_FILES.APPLICATION_PROPERTIES_FILE_DEVELOPMENT,
      },
      {
        output: resourcePath,
        template: TEMPLATES.APPLICATION_RESOURCES_STAGING,
        name: COMMON_FILES.APPLICATION_PROPERTIES_FILE_STAGING,
      },
      {
        output: resourcePath,
        template: TEMPLATES.APPLICATION_RESOURCES_PRODUCTION,
        name: COMMON_FILES.APPLICATION_PROPERTIES_FILE_PRODUCTION,
      },
      {
        output: resourcePath,
        template: TEMPLATES.APPLICATION_RESOURCES_BANNER,
        name: COMMON_FILES.APPLICATION_BANNER_FILE,
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
      {
        output: exceptionPath,
        template: TEMPLATES.GLOBAL_EXCEPTION_HANDLER,
        name: COMMON_FILES.GLOBAL_EXCEPTION_HANDLER,
      },
      {
        output: exceptionPath,
        template: TEMPLATES.IGRP_RESPONSE_STATUS_EXCEPTION,
        name: COMMON_FILES.IGRP_RESPONSE_STATUS_EXCEPTION,
      },
      {
        output: path.join(igrpstudioSharedPath, DIRECTORIES.DTO),
        template: TEMPLATES.GITKEEPFILE,
        name: COMMON_FILES.GITKEEPFILE,
      },
      {
        output: path.join(igrpstudioSharedPath, DIRECTORIES.MODELS),
        template: TEMPLATES.GITKEEPFILE,
        name: COMMON_FILES.GITKEEPFILE,
      }
    );
  }

  return files;
};

function getSubfolder(file: { template: string; output: string }) {
  switch (file.template) {
    case TEMPLATES.MONITORING_COLLECTOR:
      return 'collector';
    case TEMPLATES.MONITORING_PROMETHEUS:
      return 'prometheus';
    case TEMPLATES.MONITORING_PROMTAIL:
      return 'promtail';
    case TEMPLATES.MONITORING_TEMPO:
      return 'tempo';
    default:
      return '';
  }
}

const saveBaseApiFiles = async (baseApiFiles: BASE_API_FILES, context: RenderContext) => {
  // Generation and saving of the main files.
  await Promise.all(
    baseApiFiles.map(async (file) => {
      const outputPath = path.join(file.output, file.name);

      // Create a new context for each file to avoid overwriting `fullPath`.
      const fileContext = { ...context, fullPath: file.output };

      const template = await renderTemplate(file.template, fileContext);
      await saveToFile(template, outputPath);
    }),
  );

  // Generation and saving of additional configuration files.
  if (context.baseConfig.enableObservability) {
    await Promise.all(
      OBSERVABILITY_YAML_CONFIG_FILES.map(async (file) => {
        const basePath = path.join(context.basePath, DIRECTORIES.MONITORING);
        const subPath = path.join(basePath, getSubfolder(file));
        const outputPath = path.join(subPath, file.output);
        const template = await renderTemplate(file.template, context);
        await saveToFile(template, outputPath);
      }),
    );

    if (context.baseConfig.enableGraalVm) {
      await Promise.all(
        OBSERVABILITY_CONFIG_FILES_GRAALVM.map(async (file) => {
          const outputPath = path.join(context.basePath, file.output);
          const template = await renderTemplate(file.template, context);
          await saveToFile(template, outputPath, false);
        }),
      );
    } else {
      await Promise.all(
        OBSERVABILITY_CONFIG_FILES.map(async (file) => {
          const outputPath = path.join(context.basePath, file.output);
          const template = await renderTemplate(file.template, context);
          await saveToFile(template, outputPath, false);
        }),
      );
    }

    await Promise.all(
      OBSERVABILITY_BINARY_FILES.map(async (file) => {
        const outputPath = path.join(context.basePath, file.output);
        const templatePath = path.join(getPaths().template, file.template);
        const binaryContent = await fs.readFile(templatePath);
        await saveBinaryToFile(binaryContent, outputPath, false);
      }),
    );
  } else {
    if (context.baseConfig.enableGraalVm) {
      await Promise.all(
        CONFIG_FILES_GRAALVM.map(async (file) => {
          const outputPath = path.join(context.basePath, file.output);
          const template = await renderTemplate(file.template, context);
          await saveToFile(template, outputPath, false);
        }),
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
  }
};
