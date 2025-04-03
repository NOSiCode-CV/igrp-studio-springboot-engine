import { ImportTypeMetadata, TypeMetadata } from '../interfaces/types';
import { normalizeName } from '../modules/dto/saveDTOConfig';

export const DIRECTORIES = {
  BASE_API: '.igrpstudio/baseApi.json',
  CONFIG_CONTROLLER: '.igrpstudio/{{module}}/controllers',
  CONFIG_ICONTROLLER: '.igrpstudio/{{module}}/controllers',
  CONFIG_MODEL: '.igrpstudio/{{module}}/models',
  CONFIG_PERMISSION: '.igrpstudio/permissions',
  CONFIG_DTO: '.igrpstudio/{{module}}/dto',
  CONFIG_RESPONSE: '.igrpstudio/{{module}}/responses',
  CONFIG_ENUM: '.igrpstudio/{{module}}/enum',
  CONFIG_LIBRARIES: 'libraries',
  CONFIG_LIBRARY: 'library',
  CONTROLLERS: 'controllers',
  CONTROLLER: 'controller',
  IGRPSTUDIO: '.igrpstudio',
  MONITORING: 'monitoring',
  MODELS: 'models',
  MODEL: 'model',
  DTO: 'dto',
  ENUM: 'enum',
  RESOURCES: 'src/main/resources',
  REPOSITORIES: 'repositories',
  SERVICES: 'services',
  SERVICE: 'service',
  AUDIT_CONFIG: 'config',
  SECURITY: 'security',
  API: 'api',
  APPLICATION: 'application',
  DOMAIN: 'domain',
  INFRASTRUCTURE: 'infrastructure',
  COMMAND: 'command',
  COMMANDS: 'commands',
  QUERY: 'query',
  QUERIES: 'queries',
  ASSEMBLER: 'assembler',
  AGGREGATE: 'aggregate',
  EVENT: 'event',
  EVENTS: 'events',
  EXCEPTIONS: 'exceptions',
  IMPLEMENTATION: 'impl',
  REPOSITORY: 'repository',
  CACHE: 'cache',
  DATABASE: 'db',
  CONVERTER: 'converter',
  DATA_OBJECT: 'dataobject',
  ENTITY: 'entity',
  SPRING: 'spring',
  COLLECTOR: 'collector',
  PROMETHEUS: 'prometheus',
  PROMTAIL: 'promtail',
  TEMPO: 'tempo',
  SHARED: 'shared',
  HANDLERS: 'handlers',
  MESSAGING: 'messaging',
  PERSISTENCE: 'persistence',
  MODULE: 'module',
  CONSTANTS: 'constants',
  KUBERNETES: 'k8s',
};

export const PACKAGES = {
  MODELS: 'models',
  DTO: 'dto',
  CONTROLLERS: 'controller',
  CONSTANTS: 'constants',
  ENUM: 'enum',
};

export const PACKAGE_NS = {
  local: 'local',
  java: 'java',
  enum: 'enum',
  model: 'model',
  dto: 'dto',
  controller: 'controller',
};

export const PROJECT_STRUCTURE_STYLE = {
  DOMAIN_DRIVEN_DESIGN: 'domain',
  TECHNICAL: 'technical',
};

export const PARTIALS = [
  'controller-action-definition.hbs',
  'controller-action-documentation.hbs',
  'controller-constructor.hbs',
  'controller-imports.hbs',
  'controller-injection.hbs',
  'database-docker-env.hbs',
  'database-docker-volumes.hbs',
  'database-env.hbs',
  'auth-env.hbs',
  'database-maven-dependencies.hbs',
  'generic-maven-dependencies.hbs',
  'igrp-maven-dependencies.hbs',
  'lombok-java-annotations.hbs',
  'lombok-java-imports.hbs',
  'mysql-docker-service.hbs',
  'oauth-maven-dependencies.hbs',
  'observability-docker-env.hbs',
  'observability-docker-services.hbs',
  'observability-docker-volumes.hbs',
  'observability-env.hbs',
  'observability-maven-dependencies.hbs',
  'oracle-docker-service.hbs',
  'package-java.hbs',
  'postgres-docker-service.hbs',
  'security-maven-dependencies.hbs',
  'spring-maven-dependencies.hbs',
  'spring-entity-revision-dependencies.hbs',
  'graal-vm-plugin.hbs',
  'graal-vm-observability-dependencies.hbs'
];

export const ERROR_MESSAGE = {
  BASE_API_NOT_FOUND: 'The base api json file configuration was not found.',
  CONTROLLER_FILE_CONFIG_NOT_FOUND: 'Controller file configuration not found',
  CONTROLLER_FILE_NOT_FOUND: 'Controller class not found',
  AGGREGATE_NOT_FOUND: 'Aggregate package not found',
  DIRECTORY_DOES_NOT_EXIST:
    'The specified directory does not exist. Please select a different directory.',
  DIRECTORY_ALREADY_IN_USE:
    'The specified directory is already in use. Please select a different directory or remove the existing files.',
  MODULE_CREATED_ALREADY:
    'The specified module is created already. Please try to define a different module name.',
  EMPTY_CONTEXT: 'Provide a valid context. The context must not be empty.',
  ERROR_SAVING_FILE_CONFIG:
    'An error occurred while saving the file. Please check the log for more details.',
  ERROR_CREATING_DIRECTORY:
    'An error occurred while creating directories. Please check the log for more details.',
  EMPTY_ATTRIBUTE: 'Model attributes must not be empty.',
  EMPTY_ACTION_ATTRIBUTES: 'Request or Response attributes must not be empty.',
  FILE_CHECKING: 'Error checking if the path is a file. Please verify your path and try again.',
  INVALID_API_CONFIG:
    'The provided API configuration is invalid. Please verify the API details and try again.',
  INVALID_CONTROLLER_CONFIG:
    'The provided controller configuration is invalid. Please verify the API details and try again.',
  INVALID_MODEL_CONFIG:
    'The provided Model configuration is invalid. Please verify the model details and try again.',
  INVALID_PERMISSION_CONFIG:
    'The provided Permission configuration is invalid. Please verify the model details and try again.',
  INVALID_OUTPUT_PATH: 'The provided output path is invalid or does not exist.',
  FAILED_TO_GET_SPRING_DEPENDENCIES: 'Failed to fetch dependencies from Spring Initializr.',
  MODEL_REQUIRED:
    'The model is required. Please provide the model configuration to save your data.',
  MODEL_FILE_CONFIG_NOT_FOUNT: 'Model file configuration not found',
  DTO_FILE_CONFIG_NOT_FOUNT: 'DTO file configuration not found',
  ENUM_FILE_CONFIG_NOT_FOUNT: 'ENUM configuration file not found',
  DTO_FILE_NOT_FOUND: 'DTO file not found',
  ENUM_FILE_NOT_FOUND: 'ENUM file not found',
  TEMPLATE_NAME_REQUIRED: 'The name of the template must be provided.',
  TEMPLATE_NAME_NOT_REGISTERED: 'The name of the template must be registered.',
  CONFLICTING_PRIMARY_KEY_TYPES:
    'A compound primary key and a simple primary key cannot be selected simultaneously.',
  MULTIPLE_SIMPLE_PRIMARY_KEYS:
    'Only one simple primary key is allowed; multiple simple primary keys are not acceptable',
  MISSING_GENERATION_TYPE_FOR_SIMPLE_PRIMARY_KEY:
    'A generation type must be specified when a simple primary key is selected.',
  MISSING_PRIMARY_KEY: 'A primary key must be defined for the entity.',
  ACCEPTS_REQUIRED: 'Accepts is required for POST, PUT and PATCH methods',
  REQUEST_BODY_REQUIRED: 'Request Body is required for POST, PUT and PATCH methods',
};

export const TEMPLATES = {
  APPLICATION: 'struct/application.hbs',
  APPLICATION_TEST: 'struct/application-test.hbs',

  DOMAIN_CONTROLLER: 'struct/technical/java/controller/controller.hbs',
  DOMAIN_ICONTROLLER: 'struct/technical/java/controller/controllerInterface.hbs',
  DOMAIN_SERVICE: 'struct/technical/java/service/serviceImpl.hbs',
  DOMAIN_CRUD_SERVICE: 'struct/technical/java/service/serviceCrudImpl.hbs',
  DOMAIN_TEST_SERVICE: 'struct/technical/java/service/serviceImplTest.hbs',
  DOMAIN_MODEL: 'struct/technical/java/data/model/model.hbs',
  DOMAIN_ENUM: 'struct/technical/java/constants/enum.hbs',
  DOMAIN_REPOSITORY: 'struct/technical/java/data/repository/repository.hbs',
  DOMAIN_RESOURCES: 'struct/resource/application.properties.hbs',
  APPLICATION_RESOURCES_DEVELOPMENT: 'struct/resource/application-development.properties.hbs',
  APPLICATION_RESOURCES_STAGING: 'struct/resource/application-staging.properties.hbs',
  APPLICATION_RESOURCES_PRODUCTION: 'struct/resource/application-production.properties.hbs',
  APPLICATION_RESOURCES_BANNER: 'struct/resource/banner.hbs',
  DOMAIN_MODEL_PRIMARY_KEY: 'struct/technical/java/data/model/primaryKey.hbs',
  DOMAIN_MODEL_AUDIT: 'struct/technical/java/data/model/audit.hbs',
  APPLICATION_AUDIT_AWARE: 'struct/technical/java/data/model/applicationAditorAware.hbs',

  DOMAIN_DTO: {
    classic: 'struct/technical/java/dto/lombok.hbs',
    record: 'struct/technical/java/dto/record.hbs',
  },

  DOMAIN_RESPONSE: {
    classic: 'struct/technical/java/response/lombok.hbs',
    record: 'struct/technical/java/response/record.hbs',
  },

  DOMAIN_FILTER: 'struct/technical/java/dto/filter.hbs',

  DDD_DATA_TRANSFER_OBJECT_DTO: {
    classic: 'struct/domain/java/application/query/dto/dtolombok.hbs',
    record: 'struct/domain/java/application/query/dto/dtorecord.hbs',
  },

  DDD_COMMAND_DTO: {
    classic: 'struct/domain/java/application/command/commandlombok.hbs',
    record: 'struct/domain/java/application/command/commandrecord.hbs',
  },

  DDD_QUERY_DTO: {
    classic: 'struct/domain/java/application/query/querylombok.hbs',
    record: 'struct/domain/java/application/query/queryrecord.hbs',
  },

  DDD_DOMAIN_ENTITY_DTO: {
    classic: 'struct/domain/java/domain/aggregate/domainentitylombok.hbs',
    record: 'struct/domain/java/domain/aggregate/domainentityrecord.hbs',
  },

  DDD_VALUE_OBJECT_DTO: {
    classic: 'struct/domain/java/domain/aggregate/valueobjectlombok.hbs',
    record: 'struct/domain/java/domain/aggregate/valueobjectrecord.hbs',
  },

  DDD_EVENT_DTO: {
    classic: 'struct/domain/java/domain/event/eventlombok.hbs',
    record: 'struct/domain/java/domain/event/eventrecord.hbs',
  },

  DDD_DATA_OBJECT_DTO: {
    classic: 'struct/domain/java/infrastructure/db/dataobject/dataobjectlombok.hbs',
    record: 'struct/domain/java/infrastructure/db/dataobject/dataobjectrecord.hbs',
  },

  IGRP_BASE_API: 'igrpstudio/baseApi.hbs',
  IGRP_MODEL: 'igrpstudio/model.hbs',
  IGRP_CONTROLLER: 'igrpstudio/controller.hbs',

  ENV_FILE: 'config/env.hbs',
  CONFIG_MVNW: 'config/mvnw',
  CONFIG_MVN_WRAPPER: 'config/mvn-wrapper.properties.hbs',
  CONFIG_POM_XML: 'config/pom.xml.hbs',
  CONFIG_MVNW_CMD: 'config/mvnw.cmd.hbs',
  CONFIG_GITIGNORE: 'config/gitignore.hbs',
  CONFIG_DOCKER_FILE: 'config/dockerfile.hbs',
  CONFIG_DOCKER_FILE_GRAALVM: 'config/dockerfileGraalVM.hbs',
  CONFIG_DOCKER_COMPOSE: 'config/docker-compose.hbs',
  CONFIG_EDITOR_CONFIG: 'config/.editorconfig.hbs',
  CONFIG_DOCKER_FILE_OBSERVABILITY: 'config/dockerfile-observability.hbs',
  CONFIG_DOCKER_FILE_GRAALVM_OBSERVABILITY: 'config/dockerfile-graalvm-observability.hbs',
  CONFIG_DOCKER_COMPOSE_OBSERVABILITY: 'config/docker-compose-observability.hbs',
  CONFIG_OTEL_AGENT: 'config/opentelemetry-javaagent.jar',
  CONFIG_GITLABCIYAML: 'config/gitlabciyaml.hbs',
  CONFIG_DOCKERIGNORE: 'config/dockerignore.hbs',
  CONFIG_SECURITY: 'config/security.hbs',
  OPEN_TELEMETRY_CONFIG_GRAALVM: 'config/open-telemetry-config-graalvm.hbs',
  ENVER_HINTS_GRAALVM_CONFIG: 'config/enver-hints-graalvm-config.hbs',

  // OBSERVABILITY
  MONITORING_COLLECTOR: 'monitoring/collector.hbs',
  MONITORING_PROMETHEUS: 'monitoring/prometheus.hbs',
  MONITORING_PROMTAIL: 'monitoring/promtail.hbs',
  MONITORING_TEMPO: 'monitoring/tempo.hbs',

  // DOMAIN DRIVEN DESIGN
  DDD_COMMAND: 'struct/domain/java/application/command/command.hbs',
  DDD_COMMAND_BUS: 'struct/domain/java/application/command/commandbus.hbs',
  DDD_COMMAND_HANDLER: 'struct/domain/java/application/command/commandhandler.hbs',
  DDD_COMMAND_HANDLER_IMPL: 'struct/domain/java/domain/aggregate/commandhandlerimpl.hbs',
  DDD_COMMAND_LISTENER: 'struct/domain/java/application/command/commandlistener.hbs',
  DDD_COMMAND_LISTENER_IMPL: 'struct/domain/java/application/command/commandlistenerimpl.hbs',
  DDD_ASSEMBLER: 'struct/domain/java/application/query/assembler/assembler.hbs',
  DDD_ASSEMBLER_DATA_IMPL: 'struct/domain/java/application/query/assembler/assemblerdataimpl.hbs',
  DDD_ASSEMBLER_AGGREGATE_IMPL:
    'struct/domain/java/application/query/assembler/assembleraggimpl.hbs',
  DDD_DATA_TRANSFER_OBJECT: 'struct/domain/java/application/query/dto/datatransferobject.hbs',
  DDD_AGGREGATE: 'struct/domain/java/domain/aggregate/aggregate.hbs',
  DDD_AGGREGATE_IDENTIFIER: 'struct/domain/java/domain/aggregate/aggregateidentifier.hbs',
  DDD_AGGREGATE_ROOT: 'struct/domain/java/domain/aggregate/aggregateroot.hbs',
  DDD_AGGREGATE_ROOT_ABSTRACT: 'struct/domain/java/domain/aggregate/aggregaterootabstract.hbs',
  DDD_AGGREGATE_ROOT_IMPL: 'struct/domain/java/domain/aggregate/aggregaterootimpl.hbs',
  DDD_VALUE_OBJECT: 'struct/domain/java/domain/aggregate/valueobject.hbs',
  GLOBAL_EXCEPTION_HANDLER: 'struct/domain/java/domain/exceptions/globalexceptionhandler.hbs',
  IGRP_RESPONSE_STATUS_EXCEPTION: 'struct/domain/java/domain/exceptions/baseexception.hbs',
  IGRP_PROBLEM: 'struct/domain/java/domain/exceptions/igrpproblem.hbs',
  CUSTOM_RESPONSE_STATUS_EXCEPTION: 'struct/domain/java/domain/exceptions/objectexception.hbs',
  DDD_EVENT: 'struct/domain/java/domain/event/event.hbs',
  DDD_EVENT_BUS: 'struct/domain/java/domain/event/eventbus.hbs',
  DDD_EVENT_LISTENER: 'struct/domain/java/domain/event/eventlistener.hbs',
  DDD_EVENT_LISTENER_IMPL: 'struct/domain/java/domain/event/eventlistenerimpl.hbs',
  DDD_AGGREGATE_SERVICE: 'struct/domain/java/domain/service/aggregateservice.hbs',
  DDD_CMD_SERVICE: 'struct/domain/java/domain/service/cmdservice.hbs',
  DDD_CMD_SERVICE_IMPL: 'struct/domain/java/domain/impl/cmdserviceimpl.hbs',
  DDD_TEST_CMD_SERVICE_IMPL: 'struct/domain/java/domain/impl/cmdserviceimpltest.hbs',
  DDD_QUERY_SERVICE: 'struct/domain/java/domain/service/queryservice.hbs',
  DDD_QUERY_SERVICE_IMPL: 'struct/domain/java/domain/impl/queryserviceimpl.hbs',
  DDD_DOMAIN_ENTITY: 'struct/domain/java/domain/domainentity.hbs',
  DDD_CACHE_SERVICE: 'struct/domain/java/infrastructure/cache/cacheservice.hbs',
  DDD_CONVERTER: 'struct/domain/java/infrastructure/db/converter/converter.hbs',
  DDD_CONVERTER_IMPL: 'struct/domain/java/infrastructure/db/converter/converterimpl.hbs',
  DDD_DATA_OBJECT: 'struct/domain/java/infrastructure/db/dataobject/dataobject.hbs',
  DDD_ENTITY_BASE: 'struct/domain/java/infrastructure/db/entity/entitybase.hbs',
  DDD_ENTITY_BASE_IMPL: 'struct/domain/java/infrastructure/db/entity/entitybaseimpl.hbs',
  DDD_BASE_REPOSITORY: 'struct/domain/java/infrastructure/db/repository/baserepository.hbs',
  DDD_BASE_REPOSITORY_IMPL:
    'struct/domain/java/infrastructure/db/repository/baserepositoryimpl.hbs',
  DDD_AGGREGATE_REPOSITORY: 'struct/domain/java/domain/repository/domainrepository.hbs',
  DDD_AGGREGATE_REPOSITORY_IMPL:
    'struct/domain/java/infrastructure/db/impl/domainrepositoryimpl.hbs',
  DDD_SPRING_COMMAND_BUS: 'struct/domain/java/infrastructure/spring/springcommandbus.hbs',
  DDD_SPRING_QUERY_BUS: 'struct/domain/java/infrastructure/spring/springquerybus.hbs',
  DDD_SPRING_EVENT_BUS: 'struct/domain/java/infrastructure/spring/springeventbus.hbs',

  // DOMAIN DRIVEN DESIGN LITE
  DDD_LITE_COMMAND: {
    classic: 'struct/domain-lite/java/application/commands/commands/command-ddd.hbs',
    record: 'struct/domain-lite/java/application/commands/commands/command-record-ddd.hbs',
  },

  DDD_LITE_COMMAND_HANDLER:
    'struct/domain-lite/java/application/commands/handlers/commandhandler-ddd.hbs',
  DDD_LITE_TEST_COMMAND_HANDLER:
    'struct/domain-lite/java/application/commands/handlers/commandhandler-ddd-test.hbs',

  DDD_LITE_DTO: {
    classic: 'struct/domain-lite/java/application/dto/dto-ddd.hbs',
    record: 'struct/domain-lite/java/application/dto/dto-record-ddd.hbs',
  },

  DDD_RESPONSE_DTO: {
    classic: 'struct/domain-lite/java/application/response/response-ddd.hbs',
    record: 'struct/domain-lite/java/application/response/response-record-ddd.hbs',
  },

  DDD_LITE_FILTER: 'struct/domain-lite/java/application/dto/filter-ddd.hbs',

  DDD_LITE_QUERY: {
    classic: 'struct/domain-lite/java/application/queries/queries/query-ddd.hbs',
    record: 'struct/domain-lite/java/application/queries/queries/query-record-ddd.hbs',
  },

  DDD_LITE_QUERY_HANDLER:
    'struct/domain-lite/java/application/queries/handlers/queryhandler-ddd.hbs',
  DDD_LITE_TEST_QUERY_HANDLER:
    'struct/domain-lite/java/application/queries/handlers/queryhandler-ddd-test.hbs',

  DDD_LITE_EVENT: {
    classic: 'struct/domain-lite/java/domain/events/events/event-ddd.hbs',
    record: 'struct/domain-lite/java/domain/events/events/event-record-ddd.hbs',
  },

  DDD_LITE_EVENT_HANDLER: 'struct/domain-lite/java/domain/events/handlers/eventhandler-ddd.hbs',
  DDD_LITE_TEST_EVENT_HANDLER:
    'struct/domain-lite/java/domain/events/handlers/eventhandler-ddd-test.hbs',
  DDD_LITE_EVENT_PUBLISHER: 'struct/domain-lite/java/domain/events/eventpublisher-ddd.hbs',
  DDD_LITE_REPOSITORY: 'struct/domain-lite/java/domain/repository/repository-ddd.hbs',
  DDD_LITE_CONTROLLER: 'struct/domain-lite/java/infrastructure/controller/controller-ddd.hbs',
  DDD_LITE_REPOSITORY_IMPL:
    'struct/domain-lite/java/infrastructure/persistence/repositoryimpl-ddd.hbs',

  CONFIG_DEPLOYMENT: 'config/k8s/deploymentyaml.hbs',
  CONFIG_INGRESS: 'config/k8s/ingressyaml.hbs',
  CONFIG_SERVICE: 'config/k8s/serviceyaml.hbs',
  CONFIG_CLUSTER: 'config/k8s/clusteryaml.hbs',


  VALIDATOR_DTO_INTERFACE: 'struct/technical/java/dto/dtoValidatorInterface.hbs',
  VALIDATOR_DTO_IMPL: 'struct/technical/java/dto/dtoValidatorImpl.hbs'
};

export const CONFIG_FILES = [
  { template: TEMPLATES.ENV_FILE, output: '.env' },
  //{ template: TEMPLATES.CONFIG_MVN_WRAPPER, output: '.mvn/wrapper/maven-wrapper.properties' },
  { template: TEMPLATES.CONFIG_POM_XML, output: 'pom.xml' },
  //{ template: TEMPLATES.CONFIG_MVNW_CMD, output: 'mvnw.cmd' },
  { template: TEMPLATES.CONFIG_DOCKER_FILE, output: 'Dockerfile' },
  { template: TEMPLATES.CONFIG_DOCKER_COMPOSE, output: 'docker-compose.yml' },
  { template: TEMPLATES.CONFIG_EDITOR_CONFIG, output: '.editorconfig' },
  { template: TEMPLATES.CONFIG_GITIGNORE, output: '.gitignore' },
  { template: TEMPLATES.CONFIG_GITLABCIYAML, output: '.gitlab-ci.yml' },
  { template: TEMPLATES.CONFIG_DOCKERIGNORE, output: '.dockerignore' },
];

export const CONFIG_FILES_GRAALVM = [
  { template: TEMPLATES.ENV_FILE, output: '.env' },
  //{ template: TEMPLATES.CONFIG_MVN_WRAPPER, output: '.mvn/wrapper/maven-wrapper.properties' },
  { template: TEMPLATES.CONFIG_POM_XML, output: 'pom.xml' },
  //{ template: TEMPLATES.CONFIG_MVNW_CMD, output: 'mvnw.cmd' },
  { template: TEMPLATES.CONFIG_DOCKER_FILE_GRAALVM, output: 'Dockerfile' },
  { template: TEMPLATES.CONFIG_DOCKER_COMPOSE, output: 'docker-compose.yml' },
  { template: TEMPLATES.CONFIG_EDITOR_CONFIG, output: '.editorconfig' },
  { template: TEMPLATES.CONFIG_GITIGNORE, output: '.gitignore' },
  { template: TEMPLATES.CONFIG_GITLABCIYAML, output: '.gitlab-ci.yml' },
  { template: TEMPLATES.CONFIG_DOCKERIGNORE, output: '.dockerignore' },
];


export const OBSERVABILITY_CONFIG_FILES = [
  { template: TEMPLATES.ENV_FILE, output: '.env' },
  //{ template: TEMPLATES.CONFIG_MVN_WRAPPER, output: '.mvn/wrapper/maven-wrapper.properties' },
  { template: TEMPLATES.CONFIG_POM_XML, output: 'pom.xml' },
  //{ template: TEMPLATES.CONFIG_MVNW_CMD, output: 'mvnw.cmd' },
  { template: TEMPLATES.CONFIG_DOCKER_FILE_OBSERVABILITY, output: 'Dockerfile' },
  { template: TEMPLATES.CONFIG_DOCKER_COMPOSE, output: 'docker-compose.yml' },
  { template: TEMPLATES.CONFIG_GITIGNORE, output: '.gitignore' },
  { template: TEMPLATES.CONFIG_GITLABCIYAML, output: 'gitlab-ci.yaml' },
  { template: TEMPLATES.CONFIG_DOCKERIGNORE, output: '.dockerignore' },
];

export const OBSERVABILITY_CONFIG_FILES_GRAALVM = [
  { template: TEMPLATES.ENV_FILE, output: '.env' },
  //{ template: TEMPLATES.CONFIG_MVN_WRAPPER, output: '.mvn/wrapper/maven-wrapper.properties' },
  { template: TEMPLATES.CONFIG_POM_XML, output: 'pom.xml' },
  //{ template: TEMPLATES.CONFIG_MVNW_CMD, output: 'mvnw.cmd' },
  { template: TEMPLATES.CONFIG_DOCKER_FILE_GRAALVM_OBSERVABILITY, output: 'Dockerfile' },
  { template: TEMPLATES.CONFIG_DOCKER_COMPOSE, output: 'docker-compose.yml' },
  { template: TEMPLATES.CONFIG_GITIGNORE, output: '.gitignore' },
  { template: TEMPLATES.CONFIG_GITLABCIYAML, output: 'gitlab-ci.yaml' },
  { template: TEMPLATES.CONFIG_DOCKERIGNORE, output: '.dockerignore' },
  // { template: TEMPLATES.OPEN_TELEMETRY_CONFIG_GRAALVM, output: 'config/OtelConfig.java' }
];

export const OBSERVABILITY_YAML_CONFIG_FILES = [
  { template: TEMPLATES.MONITORING_COLLECTOR, output: 'otel-collector.yml' },
  { template: TEMPLATES.MONITORING_PROMETHEUS, output: 'prometheus.yml' },
  { template: TEMPLATES.MONITORING_PROMTAIL, output: 'promtail-docker-config.yml' },
  { template: TEMPLATES.MONITORING_TEMPO, output: 'tempo.yml' },
];

export const OBSERVABILITY_BINARY_FILES = [
  { template: TEMPLATES.CONFIG_OTEL_AGENT, output: 'opentelemetry-javaagent.jar' },
  //{ template: TEMPLATES.CONFIG_MVNW, output: 'mvnw' }
];

export const COMMON_FILES = {
  APPLICATION_PROPERTIES_FILE: 'application.properties',
  APPLICATION_PROPERTIES_FILE_DEVELOPMENT: 'application-development.properties',
  APPLICATION_PROPERTIES_FILE_STAGING: 'application-staging.properties',
  APPLICATION_PROPERTIES_FILE_PRODUCTION: 'application-production.properties',
  APPLICATION_BANNER_FILE: 'banner.txt',
  BASE_API: 'baseApi.json',
  DOCKERFILE: 'Dockerfile',
  DOCKERIGNORE: '.dockerignore',
  GITIGNORE: '.gitignore',
  GITLAB_CI_YAML: '.gitlab-ci.yml',
  MVNW: 'mvnw',
  MVNW_CMD: 'mvnw.cmd',
  POM_XML: 'pom.xml',
  REPOSITORY: 'Repository.java',
  CONTROLLER: 'Controller.java',
  SERVICE: 'Service.java',
  AUDIT_ENTITY: 'AuditEntity.java',
  AUDIT_CONFIG: 'AuditConfig.java',
  APPLICATION_AUDIT_AWARE: 'ApplicationAuditorAware.java',
  OPEN_TELEMETRY_CONFIG_JAVA_FILE: 'OtelConfig.java',
  ENVER_HINTS_GRAALVM_CONFIG_JAVA_FILE: 'EnversHints.java',
  APPLICATION_SECURITY: 'SecurityConfig.java',
  GLOBAL_EXCEPTION_HANDLER: 'GlobalExceptionHandler.java',
  IGRP_RESPONSE_STATUS_EXCEPTION: 'IgrpResponseStatusException.java',
  IGRP_PROBLEM: 'IgrpProblem.java',

  // DOMAIN DRIVEN DESIGN
  COMMAND: 'Command.java',
  COMMAND_BUS: 'CommandBus.java',
  COMMAND_HANDLER: 'CommandHandler.java',
  COMMAND_LISTENER: 'CommandListener.java',
  ASSEMBLER: 'Assembler.java',
  DATA_TRANSFER_OBJECT: 'DataTransferObject.java',
  AGGREGATE: 'Aggregate.java',
  AGGREGATE_IDENTIFIER: 'AggregateIdentifier.java',
  AGGREGATE_ROOT: 'AggregateRoot.java',
  VALUE_OBJECT: 'ValueObject.java',
  EVENT: 'Event.java',
  EVENT_BUS: 'EventBus.java',
  EVENT_LISTENER: 'EventListener.java',
  EVENT_PUBLISHER: 'EventPublisher.java',
  DOMAIN_ENTITY: 'DomainEntity.java',
  CACHE_SERVICE: 'CacheService.java',
  CONVERTER: 'Converter.java',
  DATA_OBJECT: 'DataObject.java',
  ENTITY_BASE: 'EntityBase.java',
  BASE_REPOSITORY: 'BaseRepository.java',
  SPRING_COMMAND_BUS: 'SpringCommandBus.java',
  SPRING_QUERY_BUS: 'SpringQueryBus.java',
  SPRING_EVENT_BUS: 'SpringEventBus.java',
  DEPLOYMENT: 'deployment.yaml',
  INGRESS: 'ingress.yaml',
  CLUSTER: 'cluster.yaml',
  SERVICE_K8S: 'service.yaml',
};

export const HELPER_FILES = {
  JAR_INSPECTOR: 'jar-inspector-1.0-SNAPSHOT.jar',
  APPLICATION_SECURITY: 'SecurityConfig.java',
};

export const EXTENSIONS = {
  JAVA: '.java',
  JSON: '.json',
};

export const PATTERNS = {
  NOT_EMPTY: '^.+$',
  NO_SPACE_AND_HYPHEN: '^[^\\s-][a-zA-Z_]*$',
  NAME_VALIDATION_PATTERN: '^[A-Za-z][A-Za-z0-9_]*$',
  PATH_SLASH_VALIDATION_PATTERN: '^[A-Za-z][A-Za-z0-9_/]*$',
  RELATIONS_PATTERN: '^$|^[A-Za-z_][A-Za-z0-9_]*$',
  PATH_PATTERN: '^$|^[A-Za-z_][A-Za-z0-9_{}/-]*$',
  NAMESPACE_VALIDATION_PATTERN: '^[a-z][a-z0-9_]*(\.[a-z0-9_]+)+[0-9a-z_]$',
  PARAMS_VALIDATION: '^[a-zA-Z0-9_]+$',
  PATH_VALIDATION: '^[a-zA-Z_/]+$',
  STATUS_CODE: '^\\d{3}$',
  JSON_PATTERN: '^\\{(?:[^{}]|(?:\\{[^{}]*\\}))*\\}$',
  SQL_PATTERN: '^SELECT\\s+[a-zA-Z0-9_ ,]+\\s+FROM\\s+[a-zA-Z0-9_]+;?$',
};

export const VALID_PRIMARY_KEY = ['int', 'integer', 'long', 'uuid', 'string'];

new Map(
  Object.entries({
    boolean: { name: 'boolean', primitive: true },
    short: { name: 'short', primitive: true },
    char: { name: 'char', primitive: true },
    int: { name: 'int', primitive: true },
    long: { name: 'long', primitive: true },
    float: { name: 'float', primitive: true },
    double: { name: 'double', primitive: true },
    Boolean: { name: 'Boolean', primitive: false },
    Short: { name: 'Short', primitive: false },
    Integer: { name: 'Integer', primitive: false },
    Long: { name: 'Long', primitive: false },
    Double: { name: 'Double', primitive: false },
    String: { name: 'String', primitive: false },
    Character: { name: 'Character', primitive: false },
    BigDecimal: { name: 'BigDecimal', primitive: false, namespace: 'java.math' },
    BigInteger: { name: 'BigInteger', primitive: false, namespace: 'java.math' },
    LocalDate: { name: 'LocalDate', primitive: false, namespace: 'java.time' },
    LocalDateTime: { name: 'LocalDateTime', primitive: false, namespace: 'java.time' },
    LocalTime: { name: 'LocalTime', primitive: false, namespace: 'java.time' },
    ZoneDateTime: { name: 'ZoneDateTime', primitive: false, namespace: 'java.time' },
    OffsetDateTime: { name: 'OffsetDateTime', primitive: false, namespace: 'java.time' },
    Instant: { name: 'Instant', primitive: false, namespace: 'java.time' },
    List: { name: 'List', primitive: false, namespace: 'java.util' },
    Object: { name: 'Object', primitive: false },
  }),
);

export const GENERIC_ATTRIBUTE_TYPES = [
  'boolean',
  'integer',
  'long',
  'short',
  'float',
  'double',
  'string',
  'char',
  'uuid',
  'decimal',
  'biginteger',
  'date',
  'datetime',
  'time',
  'object',
  'binary',
  'file',
  'instant',
  'uri',
  'url'
];

export const CATEGORIZED_ATTRIBUTE_TYPES = {
  timing: [
    'date', 'datetime', 'time', 'instant'
  ],
  numeric: [
    'integer', 'long', 'short', 'float', 'double', 'decimal', 'biginteger'
  ],
  text: [
    'string', 'char'
  ],
  media: [
    'file', 'binary'
  ],
  misc: [
    'uuid',
  ],
  generic: [
    'object'
  ],
  uri: ['url', 'uri']
}

const NO_OBJECT_ATTRIBUTE_TYPES = GENERIC_ATTRIBUTE_TYPES.filter((type) => type !== 'object');

export const GENERIC_MODEL_ATTRIBUTE_TYPES = [...NO_OBJECT_ATTRIBUTE_TYPES, 'relation'];

export const GENERIC_COLLECTION_TYPES = ['none', 'collection', 'map', 'pageable'];

export const GENERIC_TYPES: Map<
  string,
  { java: TypeMetadata; dotnet: TypeMetadata; python: TypeMetadata; kotlin: TypeMetadata }
> = new Map(
  Object.entries({
    // Primitive and Basic Types
    boolean: {
      java: { name: 'boolean', primitive: true },
      dotnet: { name: 'bool', primitive: true },
      python: { name: 'bool', primitive: true },
      kotlin: { name: 'Boolean', primitive: true },
    },
    integer: {
      java: { name: 'Integer', primitive: true },
      dotnet: { name: 'int', primitive: true },
      python: { name: 'int', primitive: true },
      kotlin: { name: 'Int', primitive: true },
    },
    long: {
      java: { name: 'Long', primitive: true },
      dotnet: { name: 'long', primitive: true },
      python: { name: 'int', primitive: true },
      kotlin: { name: 'Long', primitive: true },
    },
    short: {
      java: { name: 'short', primitive: true },
      dotnet: { name: 'short', primitive: true },
      python: { name: 'int', primitive: true },
      kotlin: { name: 'Short', primitive: true },
    },
    float: {
      java: { name: 'Float', primitive: true },
      dotnet: { name: 'float', primitive: true },
      python: { name: 'float', primitive: true },
      kotlin: { name: 'Float', primitive: true },
    },
    double: {
      java: { name: 'Double', primitive: true },
      dotnet: { name: 'double', primitive: true },
      python: { name: 'float', primitive: true },
      kotlin: { name: 'Double', primitive: true },
    },
    string: {
      java: { name: 'String', primitive: false },
      dotnet: { name: 'string', primitive: false },
      python: { name: 'str', primitive: false },
      kotlin: { name: 'String', primitive: false },
    },
    char: {
      java: { name: 'char', primitive: true },
      dotnet: { name: 'char', primitive: true },
      python: { name: 'str', primitive: true }, // Python treats characters as strings of length 1
      kotlin: { name: 'Char', primitive: true },
    },
    character: {
      java: { name: 'Character', primitive: true },
      dotnet: { name: 'char', primitive: true },
      python: { name: 'str', primitive: true }, // Python treats characters as strings of length 1
      kotlin: { name: 'Char', primitive: true },
    },
    uuid: {
      java: { name: 'UUID', primitive: false, namespace: 'java.util' },
      dotnet: { name: 'Guid', primitive: false, namespace: 'System' },
      python: { name: 'UUID', primitive: false, namespace: 'uuid' },
      kotlin: { name: 'UUID', primitive: false, namespace: 'java.util' },
    },
    decimal: {
      java: { name: 'BigDecimal', primitive: false, namespace: 'java.math' },
      dotnet: { name: 'decimal', primitive: false },
      python: { name: 'Decimal', primitive: false, namespace: 'decimal' },
      kotlin: { name: 'BigDecimal', primitive: false, namespace: 'java.math' },
    },
    biginteger: {
      java: { name: 'BigInteger', primitive: false, namespace: 'java.math' },
      dotnet: { name: 'BigInteger', primitive: false, namespace: 'System.Numerics' },
      python: { name: 'int', primitive: false },
      kotlin: { name: 'BigInteger', primitive: false, namespace: 'java.math' },
    },
    // Date and Time Types
    date: {
      java: { name: 'LocalDate', primitive: false, namespace: 'java.time' },
      dotnet: { name: 'DateTime', primitive: false, namespace: 'System' },
      python: { name: 'date', primitive: false, namespace: 'datetime' },
      kotlin: { name: 'LocalDate', primitive: false, namespace: 'java.time' },
    },
    datetime: {
      java: { name: 'LocalDateTime', primitive: false, namespace: 'java.time' },
      dotnet: { name: 'DateTime', primitive: false, namespace: 'System' },
      python: { name: 'datetime', primitive: false, namespace: 'datetime' },
      kotlin: { name: 'LocalDateTime', primitive: false, namespace: 'java.time' },
    },
    time: {
      java: { name: 'LocalTime', primitive: false, namespace: 'java.time' },
      dotnet: { name: 'TimeSpan', primitive: false, namespace: 'System' },
      python: { name: 'time', primitive: false, namespace: 'datetime' },
      kotlin: { name: 'LocalTime', primitive: false, namespace: 'java.time' },
    },
    uri: {
      java: { name: 'URI', primitive: false, namespace: 'java.net' },
      dotnet: { name: "Uri", primitive: false, namespace: "System" },
      python: { name: 'URI', primitive: false, namespace: 'urllib.parse' },
      kotlin: { name: 'URI', primitive: false, namespace: 'java.net' },
    },
    url: {
      java: { name: 'URL', primitive: false, namespace: 'java.net' },
      dotnet: { name: 'Uri', primitive: false, namespace: 'System' },
      python: { name: 'URL', primitive: false, namespace: 'urllib.parse' },
      kotlin: { name: 'URL', primitive: false, namespace: 'java.net' },
    },
    instant: {
      java: { name: 'Instant', primitive: false, namespace: 'java.time' },
      dotnet: { name: 'DateTimeOffset', primitive: false, namespace: 'System' },
      python: { name: 'datetime', primitive: false, namespace: 'datetime' },
      kotlin: { name: 'Instant', primitive: false, namespace: 'java.time' },
    },
    zoneddatetime: {
      java: { name: 'ZonedDateTime', primitive: false, namespace: 'java.time' },
      dotnet: { name: 'DateTimeOffset', primitive: false, namespace: 'System' },
      python: { name: 'datetime', primitive: false, namespace: 'datetime' },
      kotlin: { name: 'ZonedDateTime', primitive: false, namespace: 'java.time' },
    },
    offsetdatetime: {
      java: { name: 'OffsetDateTime', primitive: false, namespace: 'java.time' },
      dotnet: { name: 'DateTimeOffset', primitive: false, namespace: 'System' },
      python: { name: 'datetime', primitive: false, namespace: 'datetime' },
      kotlin: { name: 'OffsetDateTime', primitive: false, namespace: 'java.time' },
    },
    file: {
      java: {
        name: 'MultipartFile',
        primitive: false,
        namespace: 'org.springframework.web.multipart',
      },
      dotnet: { name: 'byte', primitive: true },
      python: { name: 'int', primitive: true },
      kotlin: {
        name: 'MultipartFile',
        primitive: false,
        namespace: 'org.springframework.web.multipart',
      },
    },
    // Collections
    list: {
      java: { name: 'List', primitive: false, namespace: 'java.util' },
      dotnet: { name: 'List', primitive: false, namespace: 'System.Collections.Generic' },
      python: { name: 'list', primitive: false },
      kotlin: { name: 'List', primitive: false },
    },
    pageable: {
      java: { name: 'Pageable', primitive: false, namespace: 'org.springframework.data.domain' },
      dotnet: { name: 'List', primitive: false, namespace: 'System.Collections.Generic' },
      python: { name: 'list', primitive: false },
      kotlin: { name: 'List', primitive: false },
    },
    set: {
      java: { name: 'Set', primitive: false, namespace: 'java.util' },
      dotnet: { name: 'HashSet', primitive: false, namespace: 'System.Collections.Generic' },
      python: { name: 'set', primitive: false },
      kotlin: { name: 'Set', primitive: false },
    },
    map: {
      java: { name: 'Map', primitive: false, namespace: 'java.util' },
      dotnet: { name: 'Dictionary', primitive: false, namespace: 'System.Collections.Generic' },
      python: { name: 'dict', primitive: false },
      kotlin: { name: 'Map', primitive: false },
    },
    collection: {
      java: { name: 'Collection', primitive: false, namespace: 'java.util' },
      dotnet: { name: 'ICollection', primitive: false, namespace: 'System.Collections.Generic' },
      python: { name: 'list', primitive: false },
      kotlin: { name: 'Collection', primitive: false },
    },

    // Miscellaneous
    enum: {
      java: { name: 'Enum', primitive: false },
      dotnet: { name: 'Enum', primitive: false, namespace: 'System' },
      python: { name: 'Enum', primitive: false, namespace: 'enum' },
      kotlin: { name: 'Enum', primitive: false },
    },
    object: {
      java: { name: 'Object', primitive: false },
      dotnet: { name: 'object', primitive: false },
      python: { name: 'object', primitive: false },
      kotlin: { name: 'Any', primitive: false },
    },
    binary: {
      java: { name: 'byte[]', primitive: true },
      dotnet: { name: 'byte[]', primitive: true },
      python: { name: 'bytes', primitive: true },
      kotlin: { name: 'ByteArray', primitive: true },
    },
  }),
);

export const GENERIC_IMPORTS = (packageNameFromConfig: string, type: string, module?: string): Map<
  string,
  { java: ImportTypeMetadata; dotnet: ImportTypeMetadata; python: ImportTypeMetadata; kotlin: ImportTypeMetadata }
> => new Map(
  Object.entries({
    model: {
      java: {
        domain: `import ${packageNameFromConfig}.${module}.domain.${PACKAGES.MODELS}.${type};`,
        technical: `import ${packageNameFromConfig}.${PACKAGES.MODELS}.${type};`
      },
      dotnet: {},
      python: {},
      kotlin: {},
    },
    dto: {
      java: {
        domain: `import ${packageNameFromConfig}.${module}.application.${PACKAGES.DTO}.${normalizeName(type, 'dto') + 'DTO'};`,
        technical: `import ${packageNameFromConfig}.${PACKAGES.DTO}.${normalizeName(type, 'dto') + 'DTO'};`
      },
      dotnet: {},
      python: {},
      kotlin: {},
    },
    enum: {
      java: {
        domain: `import ${packageNameFromConfig}.${module}.application.${PACKAGES.CONSTANTS}.${type};`,
        technical: `import ${packageNameFromConfig}.${PACKAGES.CONSTANTS}.${type};`
      },
      dotnet: {},
      python: {},
      kotlin: {},
    },
    file: {
      java: {
        domain:
          `import org.hibernate.annotations.JdbcType;`
          + '\n' +
          `import org.hibernate.type.descriptor.jdbc.BinaryJdbcType;`,
        technical:
          `import org.hibernate.annotations.JdbcType;`
          + '\n' +
          `import org.hibernate.type.descriptor.jdbc.BinaryJdbcType;`
      },
      dotnet: {},
      python: {},
      kotlin: {},
    },
    binary: {
      java: {
        domain: `import org.hibernate.annotations.JdbcType;`,
        technical: `import org.hibernate.annotations.JdbcType;`
      },
      dotnet: {},
      python: {},
      kotlin: {},
    },
    list: {
      java: {
        domain: `import java.util.List;`,
        technical: `import java.util.List;`
      },
      dotnet: {},
      python: {},
      kotlin: {},
    },
    collection: {
      java: {
        domain: `import java.util.Collection;`,
        technical: `import java.util.Collection;`
      },
      dotnet: {},
      python: {},
      kotlin: {},
    },
    pageable: {
      java: {
        domain: `import org.springframework.data.domain.Page;`,
        technical: `import org.springframework.data.domain.Page;`
      },
      dotnet: {},
      python: {},
      kotlin: {},
    },
    map: {
      java: {
        domain: `import java.util.Map;`,
        technical: `import java.util.Map;`
      },
      dotnet: {},
      python: {},
      kotlin: {},
    },
    set: {
      java: {
        domain: `import java.util.Set;`,
        technical: `import java.util.Set;`
      },
      dotnet: {},
      python: {},
      kotlin: {},
    },
    jsonProperty: {
      java: {
        domain: 'import com.fasterxml.jackson.annotation.JsonProperty;',
        technical: 'import com.fasterxml.jackson.annotation.JsonProperty;'
      },
      dotnet: {},
      python: {},
      kotlin: {},
    },
    xmlProperty: {
      java: {
        domain: 'import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;',
        technical: 'import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;'
      },
      dotnet: {},
      python: {},
      kotlin: {},
    },

  }),
);


export const TYPESCRIPT_TYPES: Map<
  string,
  {
    java: TypeMetadata;
    dotnet: TypeMetadata;
    python: TypeMetadata;
    kotlin: TypeMetadata;
    generic: TypeMetadata;
  }
> = new Map(
  Object.entries({
    boolean: {
      java: { name: 'boolean', primitive: true },
      dotnet: { name: 'bool', primitive: true },
      python: { name: 'bool', primitive: true },
      kotlin: { name: 'Boolean', primitive: true },
      generic: { name: 'boolean', primitive: true },
    },
    number: {
      java: { name: 'Double', primitive: true },
      dotnet: { name: 'double', primitive: true },
      python: { name: 'float', primitive: true },
      kotlin: { name: 'Double', primitive: true },
      generic: { name: 'double', primitive: true },
    },
    string: {
      java: { name: 'String', primitive: false },
      dotnet: { name: 'string', primitive: false },
      python: { name: 'str', primitive: false },
      kotlin: { name: 'String', primitive: false },
      generic: { name: 'string', primitive: true },
    },
    object: {
      java: { name: 'Object', primitive: false },
      dotnet: { name: 'object', primitive: false },
      python: { name: 'object', primitive: false },
      kotlin: { name: 'Any', primitive: false },
      generic: { name: 'object', primitive: true },
    },
    undefined: {
      java: { name: 'Void', primitive: false },
      dotnet: { name: 'void', primitive: false },
      python: { name: 'None', primitive: false },
      kotlin: { name: 'Unit', primitive: false },
      generic: { name: 'object', primitive: true },
    },
    function: {
      java: { name: 'Runnable', primitive: false },
      dotnet: { name: 'Action', primitive: false, namespace: 'System' },
      python: { name: 'Callable', primitive: false, namespace: 'collections.abc' },
      kotlin: { name: '() -> Unit', primitive: false },
      generic: { name: 'object', primitive: true },
    },
    symbol: {
      java: { name: 'Object', primitive: false },
      dotnet: { name: 'object', primitive: false },
      python: { name: 'object', primitive: false },
      kotlin: { name: 'Any', primitive: false },
      generic: { name: 'object', primitive: true },
    },
  }),
);

export const SCHEMA_TYPES = [
  'string',
  'integer',
  'boolean',
  'object',
  'Reference other Object',
] as const;
export const REQUEST_BODY_NOT_IMPORT = ['String', 'Integer', 'Boolean', 'Object'];
export const DATABASE_TYPES = ['MySQL', 'Oracle', 'Postgresql', 'H2'] as const;
export const STRUCT_TYPES = [
  PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN,
  PROJECT_STRUCTURE_STYLE.TECHNICAL,
] as const;
export const OBJECT_TYPES = ['dto', 'command', 'query', 'event', 'filter', 'response'] as const;
export const CONFIG_TYPES = [
  'dto',
  'controller',
  'model',
  'module',
  'enum',
  'filter',
  'response',
] as const;
export const HTTP_METHOD_TYPES = [
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'PATCH',
  'OPTIONS',
  'HEAD',
] as const;

export const MIME_TYPES = [
  '',
  'font/woff2',
  'application/json',
  'multipart/form-data',
  'video/ogg',
  'application/ogg',
  'audio/3gpp',
  'audio/webm',
  'audio/wav',
  'image/svg+xml',
  'image/jpeg',
  'audio/aac',
  'audio/mpeg',
  'application/x-csh',
  'image/webp',
  'application/x-7z-compressed',
  'font/woff',
  'font/ttf',
  'video/mpeg',
  'application/gzip',
  'application/xml',
  'text/csv',
  'text/javascript',
  'application/pdf',
  'application/x-tar',
  'font/otf',
  'application/zip',
  'audio/midi',
  'video/3gpp',
  'audio/ogg',
  'image/apng',
  'image/png',
  'text/calendar',
  'text/css',
  'application/x-cdf',
  'application/x-bzip',
  'text/plain',
  'image/tiff',
  'video/webm',
  'audio/x-midi',
  'image/gif',
  'application/x-bzip2',
  'image/bmp',
  'text/html',
  'audio/3gpp2',
  'application/octet-stream',
  'video/mp4',
  'video/3gpp2',
  'application/epub+zip',
  'image/avif',
  'video/mp2t',
];

export const REQUEST_MAPPING_OPTIONS = {
  'Content-Type': 'consumes', // Content-Type header maps to consumes
  Accept: 'produces', // Accept header maps to produces
  'Cache-Control': 'headers', // Cache-Control header maps to headers
  'Content-Length': 'headers', // Content-Length header maps to headers
  'Accept-Charset': 'headers', // Accept-Charset header maps to headers
  'Accept-Encoding': 'headers', // Accept-Encoding header maps to headers
  'Accept-Language': 'headers', // Accept-Language header maps to headers
  Expires: 'headers', // Expires header maps to headers
  'Access-Control-Allow-Origin': 'headers', // Access-Control-Allow-Origin header maps to headers
  'Access-Control-Request-Headers': 'headers', // Access-Control-Request-Headers header maps to headers
  'Access-Control-Request-Method': 'headers', // Access-Control-Request-Method header maps to headers
  'Custom-Header': 'headers', // Custom-Header maps to headers
} as const;

export const HTTP_HEADER_TYPES = [
  'Accept',
  'Cache-Control',
  'Content-Type',
  'Content-Length',
  'Accept-Charset',
  'Accept-Encoding',
  'Accept-Language',
  'Expires',
  'Access-Control-Allow-Origin',
  'Access-Control-Request-Headers',
  'Access-Control-Request-Method',
  'Custom-Header',
] as const;

export const CRUD_DISABLED_OPTIONS = [
  'save',
  'saveAll',
  'delete',
  'deleteAll',
  'deleteById',
  'findAll',
  'findById',
  'findAllById',
] as const;

export const RELATIONSHIP_TYPES = ['OneToOne', 'OneToMany', 'ManyToOne', 'ManyToMany'] as const;

export const FETCH_TYPE = ['lazy', 'eager'] as const;

export const CASCADE_TYPE = ['ALL', 'PERSIST', 'MERGE', 'REFRESH', 'REMOVE', 'DETACH'] as const;

export const PARAMS_TYPES = ['long', 'string', 'integer', 'boolean', 'object', 'file'] as const;

export const GENERATION_TYPES = ['', 'IDENTITY', 'SEQUENCE', 'TABLE', 'AUTO'] as const;