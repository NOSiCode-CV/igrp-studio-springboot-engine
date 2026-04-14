import path from 'path';
import {RenderContext} from '../../interfaces/types';
import {
  COMMON_FILES,
  CONFIG_FILES,
  CONFIG_FILES_GRAALVM,
  DIRECTORIES,
  PROJECT_STRUCTURE_STYLE,
  TEMPLATES,
} from '../../utils/constants';
import {capitalize} from '../../helper/stringHelper';
import {renderTemplate} from '../common/renderTemplate';
import {getMainPath} from '../../utils/helpers';
import {saveToFile} from '../common/saveToFile';

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
        template: TEMPLATES.ENUM_EXPOSER_CONFIG,
        name: COMMON_FILES.ENUM_EXPOSER_CONFIG,
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
      // IAM User Profile — domain layer
      {
        output: path.join(domainPath, DIRECTORIES.MODELS),
        template: TEMPLATES.IAM_USER_PROFILE_DOMAIN_MODEL,
        name: COMMON_FILES.IAM_USER_PROFILE_DOMAIN_MODEL,
      },
      {
        output: path.join(domainPath, DIRECTORIES.REPOSITORY),
        template: TEMPLATES.IAM_USER_PROFILE_DOMAIN_REPOSITORY,
        name: COMMON_FILES.IAM_USER_PROFILE_DOMAIN_REPOSITORY,
      },
      // IAM User Profile — infrastructure layer
      {
        output: path.join(infraPath, DIRECTORIES.PERSISTENCE, DIRECTORIES.ENTITY),
        template: TEMPLATES.IAM_USER_PROFILE_ENTITY,
        name: COMMON_FILES.IAM_USER_PROFILE_ENTITY,
      },
      {
        output: path.join(infraPath, DIRECTORIES.PERSISTENCE, DIRECTORIES.REPOSITORY),
        template: TEMPLATES.IAM_USER_PROFILE_ENTITY_REPOSITORY,
        name: COMMON_FILES.IAM_USER_PROFILE_ENTITY_REPOSITORY,
      },
      {
        output: path.join(infraPath, DIRECTORIES.PERSISTENCE, DIRECTORIES.REPOSITORYADAPTER),
        template: TEMPLATES.IAM_USER_PROFILE_REPOSITORY_IMPL,
        name: COMMON_FILES.IAM_USER_PROFILE_REPOSITORY_IMPL,
      },
      {
        output: path.join(infraPath, 'mapper'),
        template: TEMPLATES.IAM_USER_PROFILE_MAPPER,
        name: COMMON_FILES.IAM_USER_PROFILE_MAPPER,
      },
      {
        output: securityPath,
        template: TEMPLATES.IAM_USER_PROFILE_SYNC_FILTER,
        name: COMMON_FILES.IAM_USER_PROFILE_SYNC_FILTER,
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
        output: configPath,
        template: TEMPLATES.SWAGGER_CONFIG,
        name: COMMON_FILES.SWAGGER_CONFIG,
      },
      {
        output: configPath,
        template: TEMPLATES.ENUM_EXPOSER_CONFIG,
        name: COMMON_FILES.ENUM_EXPOSER_CONFIG,
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
      // IAM User Profile — entity and JPA repo follow the model convention (models/{name}/)
      {
        output: path.join(mainPath, DIRECTORIES.MODELS, 'iamuserprofileentity'),
        template: TEMPLATES.IAM_USER_PROFILE_ENTITY,
        name: COMMON_FILES.IAM_USER_PROFILE_ENTITY,
      },
      {
        output: path.join(mainPath, DIRECTORIES.MODELS, 'iamuserprofileentity'),
        template: TEMPLATES.IAM_USER_PROFILE_ENTITY_REPOSITORY,
        name: COMMON_FILES.IAM_USER_PROFILE_ENTITY_REPOSITORY,
      },
      {
        output: securityPath,
        template: TEMPLATES.IAM_USER_PROFILE_SYNC_FILTER,
        name: COMMON_FILES.IAM_USER_PROFILE_SYNC_FILTER,
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

const getWorkspaceComposeName = (name: string) => `igrp-compose-${name.toLowerCase()}.yaml`;
const getWorkspaceEnvName = (name: string) => `.igrp.${name.toLowerCase()}.env`;

const saveRenderedTemplate = async (
  templatePath: string,
  outputPath: string,
  context: RenderContext,
  overwrite = true,
) => {
  const template = await renderTemplate(templatePath, context);
  await saveToFile(template, outputPath, overwrite);
};

const saveAdditionalBaseConfigFiles = async (context: RenderContext) => {
  const configFiles = context.baseConfig.enableGraalVm ? CONFIG_FILES_GRAALVM : CONFIG_FILES;

  await Promise.all(
    configFiles.map(async (file) => {
      await saveRenderedTemplate(
        file.template,
        path.join(context.basePath, file.output),
        context,
        false,
      );
    }),
  );

  await Promise.all([
    saveRenderedTemplate(
      TEMPLATES.CONFIG_IGRP_DOCKER_COMPOSE,
      path.join(context.basePath, getWorkspaceComposeName(context.baseConfig.name)),
      context,
      false,
    ),
    saveRenderedTemplate(
      TEMPLATES.CONFIG_IGRP_ENV_FILE,
      path.join(context.basePath, getWorkspaceEnvName(context.baseConfig.name)),
      context,
      false,
    ),
  ]);

  if (context.baseConfig.database === 'Postgresql') {
    await saveRenderedTemplate(
      TEMPLATES.CONFIG_DB_INIT_SCRIPT,
      path.join(context.basePath, DIRECTORIES.DATABASE, COMMON_FILES.INIT_DATABASE_SCRIPT),
      context,
      false,
    );
  }
};

const saveBaseApiFiles = async (baseApiFiles: BASE_API_FILES, context: RenderContext) => {
  await Promise.all(
    baseApiFiles.map(async (file) => {
      const outputPath = path.join(file.output, file.name);
      const fileContext = { ...context, fullPath: file.output };
      await saveRenderedTemplate(file.template, outputPath, fileContext);
    }),
  );

  await saveAdditionalBaseConfigFiles(context);
};
