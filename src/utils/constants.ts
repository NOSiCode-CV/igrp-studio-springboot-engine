import path from 'path';
import { TypeMetadata } from '../interfaces/types';

 //export const TEMPLATE_DIR = path.join(__dirname, '../../public/templates');
 //export const PARTIALS_DIR = path.join(__dirname, '../../public/templates/partials');
 export const TEMPLATE_DIR = path.join(__dirname, './templates');
 export const PARTIALS_DIR = path.join(__dirname, './templates/partials');

export const DIRECTORIES = {
  BASE_API: '.igrpstudio/baseApi.json',
  CONFIG_CONTROLLER: '.igrpstudio/{{module}}/controllers',
  CONFIG_ICONTROLLER: '.igrpstudio/{{module}}/controllers',
  CONFIG_MODEL: '.igrpstudio/{{module}}/models',
  CONFIG_PERMISSION: '.igrpstudio/permissions',
  CONFIG_DTO: '.igrpstudio/{{module}}/dto',
  CONTROLLERS: 'controllers',
  CONTROLLER: 'controller',
  IGRPSTUDIO: '.igrpstudio',
  MONITORING: 'monitoring',
  MODELS: 'models',
  MODEL: 'model',
  DTO: 'dto',
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
};

export const PACKAGES = {
  MODELS: 'models',
  DTO: 'dto',
  CONTROLLERS: 'controller'
};

export const PACKAGE_NS = {
  local: 'local',
  java: 'java',
  model: 'model',
  dto: 'dto',
  controller: 'controller'
};

export const PROJECT_STRUCTURE_STYLE = {
  DOMAIN_DRIVEN_DESIGN: 'domain',
  TECHNICAL: 'technical'
}

export const SUCCESS_MESSAGE = {
  DIRECTORY_CREATED: 'Directories created',
  FILE_SAVED: 'The file has been saved successfully.',
};

export const PARTIALS = [
  "database-docker-env.hbs",
  "database-docker-volumes.hbs",
  "database-env.hbs",
  "database-maven-dependencies.hbs",
  "generic-maven-dependencies.hbs",
  "lombok-java-annotations.hbs",
  "lombok-java-imports.hbs",
  "method-documentation.hbs",
  "mysql-docker-service.hbs",
  "oauth-maven-dependencies.hbs",
  "observability-docker-env.hbs",
  "observability-docker-services.hbs",
  "observability-docker-volumes.hbs",
  "observability-env.hbs",
  "observability-maven-dependencies.hbs",
  "oracle-docker-service.hbs",
  "package-java.hbs",
  "postgres-docker-service.hbs",
  "security-maven-dependencies.hbs",
  "spring-maven-dependencies.hbs"
]

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
  EMPTY_ATTRIBUTE: 'Model attributs must not be empty.',
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
  MODEL_REQUIRED:
    'The model is required. Please provide the model configuration to save your data.',
  MODEL_FILE_CONFIG_NOT_FOUNT: 'Model file configuration not found',
  DTO_FILE_CONFIG_NOT_FOUNT: 'DTO file configuration not found',
  DTO_FILE_NOT_FOUND: 'DTO file not found',
  TEMPLATE_NAME_REQUIRED: 'The name of the template must be provided.',
  TEMPLATE_NAME_NOT_REGISTERED: 'The name of the template must be registered.',
  CONFLICTING_PRIMARY_KEY_TYPES: "A compound primary key and a simple primary key cannot be selected simultaneously.",
  MULTIPLE_SIMPLE_PRIMARY_KEYS: 'Only one simple primary key is allowed; multiple simple primary keys are not acceptable',
  MISSING_GENERATION_TYPE_FOR_SIMPLE_PRIMARY_KEY: 'A generation type must be specified when a simple primary key is selected.',
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
  DOMAIN_MODEL: 'struct/technical/java/data/model/model.hbs',
  DOMAIN_REPOSITORY: 'struct/technical/java/repository/repository.hbs',
  DOMAIN_RESOURCES: 'struct/resource/application.properties.hbs',
  APPLICATION_RESOURCES_DEVELOPMENT: 'struct/resource/application-development.properties.hbs',
  APPLICATION_RESOURCES_STAGING: 'struct/resource/application-staging.properties.hbs',
  APPLICATION_RESOURCES_PRODUCTION: 'struct/resource/application-production.properties.hbs',
  DOMAIN_MODEL_PRIMARY_KEY: 'struct/technical/java/data/model/primarykey.hbs',
  DOMAIN_MODEL_AUDIT: 'struct/technical/java/data/model/audit.hbs',
  APPLICATION_AUDIT_AWARE: 'struct/technical/java/data/model/applicationAditorAware.hbs',

  DOMAIN_DTO: {
    'classic': 'struct/technical/java/dto/lombok.hbs',
    'record': 'struct/technical/java/dto/record.hbs',
  },

  DDD_DATA_TRANSFER_OBJECT_DTO: {
    'classic': 'struct/domain/java/application/query/dto/dtolombok.hbs',
    'record': 'struct/domain/java/application/query/dto/dtorecord.hbs',
  },

  DDD_COMMAND_DTO: {
    'classic': 'struct/domain/java/application/command/commandlombok.hbs',
    'record': 'struct/domain/java/application/command/commandrecord.hbs',
  },

  DDD_QUERY_DTO: {
    'classic': 'struct/domain/java/application/query/querylombok.hbs',
    'record': 'struct/domain/java/application/query/queryrecord.hbs',
  },

  DDD_DOMAIN_ENTITY_DTO: {
    'classic': 'struct/domain/java/domain/aggregate/domainentitylombok.hbs',
    'record': 'struct/domain/java/domain/aggregate/domainentityrecord.hbs',
  },

  DDD_VALUE_OBJECT_DTO: {
    'classic': 'struct/domain/java/domain/aggregate/valueobjectlombok.hbs',
    'record': 'struct/domain/java/domain/aggregate/valueobjectrecord.hbs',
  },

  DDD_EVENT_DTO: {
    'classic': 'struct/domain/java/domain/event/eventlombok.hbs',
    'record': 'struct/domain/java/domain/event/eventrecord.hbs',
  },

  DDD_DATA_OBJECT_DTO: {
    'classic': 'struct/domain/java/infrastructure/db/dataobject/dataobjectlombok.hbs',
    'record': 'struct/domain/java/infrastructure/db/dataobject/dataobjectrecord.hbs',
  },

  IGRP_BASE_API: 'igrpstudio/baseApi.hbs',
  IGRP_MODEL: 'igrpstudio/model.hbs',
  IGRP_CONTROLLER: 'igrpstudio/controller.hbs',

  ENV_FILE: 'config/env.hbs',
  CONFIG_MVNW: 'config/mvnw',
  CONFIG_MVN_WRAPPER: 'config/mvn-wrapper.properties.hbs',
  CONFIG_POM_XML: 'config/pom.xml.hbs',
  CONFIG_POM_XML_OBSERVABILITY: 'config/pom.xml-observability.hbs',
  CONFIG_MVNW_CMD: 'config/mvnw.cmd.hbs',
  CONFIG_GITIGNORE: 'config/gitignore.hbs',
  CONFIG_DOCKER_FILE: 'config/dockerfile.hbs',
  CONFIG_DOCKER_COMPOSE: 'config/docker-compose.hbs',
  CONFIG_DOCKER_FILE_OBSERVABILITY: 'config/dockerfile-observability.hbs',
  CONFIG_DOCKER_COMPOSE_OBSERVABILITY: 'config/docker-compose-observability.hbs',
  CONFIG_OTEL_AGENT: 'config/opentelemetry-javaagent.jar',
  CONFIG_GITLABCIYAML: 'config/gitlabciyaml.hbs',
  CONFIG_DOCKERIGNORE: 'config/dockerignore.hbs',
  CONFIG_SECURITY: 'config/security.hbs',

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
  DDD_ASSEMBLER_AGGREGATE_IMPL: 'struct/domain/java/application/query/assembler/assembleraggimpl.hbs',
  DDD_DATA_TRANSFER_OBJECT: 'struct/domain/java/application/query/dto/datatransferobject.hbs',
  DDD_AGGREGATE: 'struct/domain/java/domain/aggregate/aggregate.hbs',
  DDD_AGGREGATE_IDENTIFIER: 'struct/domain/java/domain/aggregate/aggregateidentifier.hbs',
  DDD_AGGREGATE_ROOT: 'struct/domain/java/domain/aggregate/aggregateroot.hbs',
  DDD_AGGREGATE_ROOT_ABSTRACT: 'struct/domain/java/domain/aggregate/aggregaterootabstract.hbs',
  DDD_AGGREGATE_ROOT_IMPL: 'struct/domain/java/domain/aggregate/aggregaterootimpl.hbs',
  DDD_VALUE_OBJECT: 'struct/domain/java/domain/aggregate/valueobject.hbs',
  DDD_EVENT: 'struct/domain/java/domain/event/event.hbs',
  DDD_EVENT_BUS: 'struct/domain/java/domain/event/eventbus.hbs',
  DDD_EVENT_LISTENER: 'struct/domain/java/domain/event/eventlistener.hbs',
  DDD_EVENT_LISTENER_IMPL: 'struct/domain/java/domain/event/eventlistenerimpl.hbs',
  DDD_AGGREGATE_SERVICE: 'struct/domain/java/domain/service/aggregateservice.hbs',
  DDD_CMD_SERVICE: 'struct/domain/java/domain/service/cmdservice.hbs',
  DDD_CMD_SERVICE_IMPL: 'struct/domain/java/domain/impl/cmdserviceimpl.hbs',
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
  DDD_BASE_REPOSITORY_IMPL: 'struct/domain/java/infrastructure/db/repository/baserepositoryimpl.hbs',
  DDD_AGGREGATE_REPOSITORY: 'struct/domain/java/domain/repository/domainrepository.hbs',
  DDD_AGGREGATE_REPOSITORY_IMPL: 'struct/domain/java/infrastructure/db/impl/domainrepositoryimpl.hbs',
  DDD_SPRING_COMMAND_BUS: 'struct/domain/java/infrastructure/spring/springcommandbus.hbs',
  DDD_SPRING_EVENT_BUS: 'struct/domain/java/infrastructure/spring/springeventbus.hbs',

  // DOMAIN DRIVEN DESIGN LITE
  DDD_LITE_COMMAND: {
    'classic': 'struct/domain-lite/java/application/commands/commands/command-ddd.hbs',
    'record': 'struct/domain-lite/java/application/commands/commands/command-record-ddd.hbs',
  },

  DDD_LITE_COMMAND_HANDLER: 'struct/domain-lite/java/application/commands/handlers/commandhandler-ddd.hbs',

  DDD_LITE_DTO: {
    'classic': 'struct/domain-lite/java/application/dto/dto-ddd.hbs',
    'record': 'struct/domain-lite/java/application/dto/dto-record-ddd.hbs',
  },

  DDD_LITE_QUERY: {
    'classic': 'struct/domain-lite/java/application/queries/queries/query-ddd.hbs',
    'record': 'struct/domain-lite/java/application/queries/queries/query-record-ddd.hbs',
  },

  DDD_LITE_QUERY_HANDLER: 'struct/domain-lite/java/application/queries/handlers/queryhandler-ddd.hbs',

  DDD_LITE_EVENT: {
    'classic': 'struct/domain-lite/java/domain/events/events/event-ddd.hbs',
    'record': 'struct/domain-lite/java/domain/events/events/event-record-ddd.hbs',
  },

  DDD_LITE_EVENT_HANDLER: 'struct/domain-lite/java/domain/events/handlers/eventhandler-ddd.hbs',
  DDD_LITE_EVENT_PUBLISHER: 'struct/domain-lite/java/domain/events/eventpublisher-ddd.hbs',
  DDD_LITE_MODEL: 'struct/domain-lite/java/domain/model/model-ddd.hbs',
  DDD_LITE_REPOSITORY: 'struct/domain-lite/java/domain/repository/repository-ddd.hbs',
  DDD_LITE_CONTROLLER: 'struct/domain-lite/java/infrastructure/controller/controller-ddd.hbs',
  DDD_LITE_REPOSITORY_IMPL: 'struct/domain-lite/java/infrastructure/persistence/repositoryimpl-ddd.hbs',

};

export const CONFIG_FILES = [
  { template: TEMPLATES.ENV_FILE, output: '.env' },
  { template: TEMPLATES.CONFIG_MVN_WRAPPER, output: '.mvn/wrapper/maven-wrapper.properties' },
  { template: TEMPLATES.CONFIG_POM_XML, output: 'pom.xml' },
  { template: TEMPLATES.CONFIG_MVNW_CMD, output: 'mvnw.cmd' },
  { template: TEMPLATES.CONFIG_DOCKER_FILE, output: 'Dockerfile' },
  { template: TEMPLATES.CONFIG_DOCKER_COMPOSE, output: 'docker-compose.yml' },
  { template: TEMPLATES.CONFIG_GITIGNORE, output: '.gitignore' },
  { template: TEMPLATES.CONFIG_GITLABCIYAML, output: 'gitlab-ci.yaml' },
  { template: TEMPLATES.CONFIG_DOCKERIGNORE, output: '.dockerignore' },
];

export const CONFIG_BINARY_FILES = [
  { template: TEMPLATES.CONFIG_MVNW, output: 'mvnw' }
]

export const OBSERVABILITY_CONFIG_FILES = [
  { template: TEMPLATES.ENV_FILE, output: '.env' },
  { template: TEMPLATES.CONFIG_MVNW, output: 'mvnw' },
  { template: TEMPLATES.CONFIG_MVN_WRAPPER, output: '.mvn/wrapper/maven-wrapper.properties' },
  { template: TEMPLATES.CONFIG_POM_XML, output: 'pom.xml' },
  { template: TEMPLATES.CONFIG_MVNW_CMD, output: 'mvnw.cmd' },
  { template: TEMPLATES.CONFIG_DOCKER_FILE_OBSERVABILITY, output: 'Dockerfile' },
  { template: TEMPLATES.CONFIG_DOCKER_COMPOSE, output: 'docker-compose.yml' },
  { template: TEMPLATES.CONFIG_GITIGNORE, output: '.gitignore' },
  { template: TEMPLATES.CONFIG_GITLABCIYAML, output: 'gitlab-ci.yaml' },
  { template: TEMPLATES.CONFIG_DOCKERIGNORE, output: '.dockerignore' },
];

export const OBSERVABILITY_YAML_CONFIG_FILES = [
  { template: TEMPLATES.MONITORING_COLLECTOR, output: 'otel-collector.yml' },
  { template: TEMPLATES.MONITORING_PROMETHEUS, output: 'prometheus.yml' },
  { template: TEMPLATES.MONITORING_PROMTAIL, output: 'promtail-docker-config.yml' },
  { template: TEMPLATES.MONITORING_TEMPO, output: 'tempo.yml' },
];

export const OBSERVABILITY_BINARY_FILES = [
  { template: TEMPLATES.CONFIG_OTEL_AGENT, output: 'opentelemetry-javaagent.jar' }
]

export const COMMON_FILES = {
  APPLICATION_PROPERTIES_FILE: 'application.properties',
  APPLICATION_PROPERTIES_FILE_DEVELOPMENT: 'application-development.properties',
  APPLICATION_PROPERTIES_FILE_STAGING: 'application-staging.properties',
  APPLICATION_PROPERTIES_FILE_PRODUCTION: 'application-production.properties',
  BASE_API: 'baseApi.json',
  DOCKERFILE: 'Dockerfile',
  DOCKERIGNORE: '.dockerignore',
  GITIGNORE: '.gitignore',
  GITLAB_CI_YAML: 'gitlab-ci.yaml',
  MVNW: 'mvnw',
  MVNW_CMD: 'mvnw.cmd',
  POM_XML: 'pom.xml',
  REPOSITORY: 'Repository.java',
  CONTROLLER: 'Controller.java',
  SERVICE: 'ServiceInterface.java',
  AUDIT_ENTITY: 'AuditEntity.java',
  AUDIT_CONFIG: 'AuditConfig.java',
  APPLICATION_AUDIT_AWARE: 'ApplicationAuditorAware.java',
  APPLICATION_SECURITY: 'SecurityConfig.java',

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
  SPRING_EVENT_BUS: 'SpringEventBus.java',
};

export const EXTENSIONS = {
  JAVA: '.java',
  JSON: '.json',
};

export const PATTERNS = {
  NOT_EMPTY: '^.+$',
  NO_SPACE_AND_HYPHEN: '^[^\\s-][a-zA-Z_]*$',
  NAME_VALIDATION_PATTERN: '^[A-Za-z][A-Za-z0-9_]*$',
  RELATIONS_PATTERN: '^$|^[A-Za-z_][A-Za-z0-9_]*$',
  NAMESPACE_VALIDATION_PATTERN: '^[a-z][a-z0-9_]*(\.[a-z0-9_]+)+[0-9a-z_]$',
  PARAMS_VALIDATION: '^[a-zA-Z0-9_]+$',
  PATH_VALIDATION: '^[a-zA-Z_/]+$',  
};

const IMPORT_MAP = {
    // Core Java imports
    List: 'java.util.List',
    Map: 'java.util.Map',
    Set: 'java.util.Set',
    HashMap: 'java.util.HashMap',
    HashSet: 'java.util.HashSet',
    Optional: 'java.util.Optional',
    Date: 'java.util.Date',
    UUID: 'java.util.UUID',

    // Java time API
    LocalDate: 'java.time.LocalDate',
    LocalDateTime: 'java.time.LocalDateTime',
    LocalTime: 'java.time.LocalTime',
    ZonedDateTime: 'java.time.ZonedDateTime',
    ZoneId: 'java.time.ZoneId',
    Instant: 'java.time.Instant',
    Duration: 'java.time.Duration',
    Period: 'java.time.Period',

    // I/O and Serialization
    Serializable: 'java.io.Serializable',
    InputStream: 'java.io.InputStream',
    OutputStream: 'java.io.OutputStream',
    File: 'java.io.File',
    BufferedReader: 'java.io.BufferedReader',
    BufferedWriter: 'java.io.BufferedWriter',
    PrintWriter: 'java.io.PrintWriter',

    // Concurrency
    Thread: 'java.lang.Thread',
    Runnable: 'java.lang.Runnable',
    ExecutorService: 'java.util.concurrent.ExecutorService',
    Executors: 'java.util.concurrent.Executors',
    CompletableFuture: 'java.util.concurrent.CompletableFuture',

    // Exceptions
    IOException: 'java.io.IOException',
    IllegalArgumentException: 'java.lang.IllegalArgumentException',
    NullPointerException: 'java.lang.NullPointerException',
    RuntimeException: 'java.lang.RuntimeException',
    Exception: 'java.lang.Exception',

    // Annotations
    Override: 'java.lang.Override',
    Deprecated: 'java.lang.Deprecated',

    // Utility
    Objects: 'java.util.Objects',
    Collections: 'java.util.Collections',
    Arrays: 'java.util.Arrays',
    Comparator: 'java.util.Comparator',
    Stream: 'java.util.stream.Stream',

    // Core Spring Framework
    Autowired: 'org.springframework.beans.factory.annotation.Autowired',
    Component: 'org.springframework.stereotype.Component',
    Service: 'org.springframework.stereotype.Service',
    Repository: 'org.springframework.stereotype.Repository',
    Configuration: 'org.springframework.context.annotation.Configuration',
    Bean: 'org.springframework.context.annotation.Bean',

    // Spring Boot
    SpringApplication: 'org.springframework.boot.SpringApplication',
    SpringBootApplication: 'org.springframework.boot.autoconfigure.SpringBootApplication',
    Value: 'org.springframework.beans.factory.annotation.Value',
    Environment: 'org.springframework.core.env.Environment',

    // Validation
    NotNull: 'jakarta.validation.constraints.NotNull',
    NotEmpty: 'jakarta.validation.constraints.NotEmpty',
    NotBlank: 'jakarta.validation.constraints.NotBlank',
    Size: 'jakarta.validation.constraints.Size',
    Email: 'jakarta.validation.constraints.Email',
    Pattern: 'jakarta.validation.constraints.Pattern',
    Min: 'jakarta.validation.constraints.Min',
    Max: 'jakarta.validation.constraints.Max',
    Past: 'jakarta.validation.constraints.Past',
    Future: 'jakarta.validation.constraints.Future',

    // Web
    RestController: 'org.springframework.web.bind.annotation.RestController',
    RequestMapping: 'org.springframework.web.bind.annotation.RequestMapping',
    GetMapping: 'org.springframework.web.bind.annotation.GetMapping',
    PostMapping: 'org.springframework.web.bind.annotation.PostMapping',
    PutMapping: 'org.springframework.web.bind.annotation.PutMapping',
    DeleteMapping: 'org.springframework.web.bind.annotation.DeleteMapping',
    RequestParam: 'org.springframework.web.bind.annotation.RequestParam',
    PathVariable: 'org.springframework.web.bind.annotation.PathVariable',
    RequestBody: 'org.springframework.web.bind.annotation.RequestBody',
    ResponseBody: 'org.springframework.web.bind.annotation.ResponseBody',

    // Spring Data
    JpaRepository: 'org.springframework.data.jpa.repository.JpaRepository',
    CrudRepository: 'org.springframework.data.repository.CrudRepository',
    PagingAndSortingRepository: 'org.springframework.data.repository.PagingAndSortingRepository',
    Query: 'org.springframework.data.jpa.repository.Query',

    // Spring Security
    PreAuthorize: 'org.springframework.security.access.prepost.PreAuthorize',
    PostAuthorize: 'org.springframework.security.access.prepost.PostAuthorize',
    Secured: 'org.springframework.security.access.annotation.Secured',
    RolesAllowed: 'jakarta.annotation.security.RolesAllowed',
    Authentication: 'org.springframework.security.core.Authentication',
    SecurityContextHolder: 'org.springframework.security.core.context.SecurityContextHolder',

    // Spring Scheduling
    Scheduled: 'org.springframework.scheduling.annotation.Scheduled',
    EnableScheduling: 'org.springframework.scheduling.annotation.EnableScheduling',

    // Jackson
    JsonIgnore: 'com.fasterxml.jackson.annotation.JsonIgnore',
    JsonProperty: 'com.fasterxml.jackson.annotation.JsonProperty',
    JsonCreator: 'com.fasterxml.jackson.annotation.JsonCreator',
    JsonInclude: 'com.fasterxml.jackson.annotation.JsonInclude',

    // Lombok
    Getter: 'lombok.Getter',
    Setter: 'lombok.Setter',
    Builder: 'lombok.Builder',
    AllArgsConstructor: 'lombok.AllArgsConstructor',
    NoArgsConstructor: 'lombok.NoArgsConstructor',
    Data: 'lombok.Data',
    EqualsAndHashCode: 'lombok.EqualsAndHashCode',
    ToString: 'lombok.ToString',

    // Apache Commons
    StringUtils: 'org.apache.commons.lang3.StringUtils',
    CollectionUtils: 'org.apache.commons.collections4.CollectionUtils',

    // Hibernate
    Entity: 'jakarta.persistence.Entity',
    Id: 'jakarta.persistence.Id',
    Table: 'jakarta.persistence.Table',
    Column: 'jakarta.persistence.Column',
    GeneratedValue: 'jakarta.persistence.GeneratedValue',
    GenerationType: 'jakarta.persistence.GenerationType',

    // Validation
    ValidationException: 'jakarta.validation.ValidationException',
    Validator: 'jakarta.validation.Validator',

    // SLF4J
    Logger: 'org.slf4j.Logger',
    LoggerFactory: 'org.slf4j.LoggerFactory',

    // Mockito
    Mock: 'org.mockito.Mock',
    InjectMocks: 'org.mockito.InjectMocks',
    MockitoAnnotations: 'org.mockito.MockitoAnnotations',

};

const MEDIA_TYPE_MAP = {
  JSON: 'org.springframework.http.MediaType.APPLICATION_JSON_VALUE',
  XML: 'org.springframework.http.MediaType.APPLICATION_XML_VALUE',
  FORM_URLENCODED: 'org.springframework.http.MediaType.APPLICATION_FORM_URLENCODED_VALUE',
  MULTIPART: 'org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE',
  TEXT_HTML: 'org.springframework.http.MediaType.TEXT_HTML_VALUE',
  TEXT_PLAIN: 'org.springframework.http.MediaType.TEXT_PLAIN_VALUE',
  TEXT_XML: 'org.springframework.http.MediaType.TEXT_XML_VALUE',
  OCTET_STREAM: 'org.springframework.http.MediaType.APPLICATION_OCTET_STREAM_VALUE',
  ANY: 'org.springframework.http.MediaType.ALL_VALUE',
};

const ANNOTATION_MAP = {
  // REST Controller
  RestController: 'org.springframework.web.bind.annotation.RestController',
  RequestMapping: 'org.springframework.web.bind.annotation.RequestMapping',
  GetMapping: 'org.springframework.web.bind.annotation.GetMapping',
  PostMapping: 'org.springframework.web.bind.annotation.PostMapping',
  PutMapping: 'org.springframework.web.bind.annotation.PutMapping',
  DeleteMapping: 'org.springframework.web.bind.annotation.DeleteMapping',
  PatchMapping: 'org.springframework.web.bind.annotation.PatchMapping',

  // Request Handling
  RequestParam: 'org.springframework.web.bind.annotation.RequestParam',
  PathVariable: 'org.springframework.web.bind.annotation.PathVariable',
  RequestBody: 'org.springframework.web.bind.annotation.RequestBody',
  ResponseBody: 'org.springframework.web.bind.annotation.ResponseBody',

  // Exception Handling
  ExceptionHandler: 'org.springframework.web.bind.annotation.ExceptionHandler',
  ControllerAdvice: 'org.springframework.web.bind.annotation.ControllerAdvice',

  // Cross-Origin
  CrossOrigin: 'org.springframework.web.bind.annotation.CrossOrigin',

  // Validation
  Valid: 'jakarta.validation.Valid',

  // Response Status
  ResponseStatus: 'org.springframework.http.HttpStatus',
};

const HTTP_STATUS_MAP = {
  OK: 'org.springframework.http.HttpStatus.OK',
  CREATED: 'org.springframework.http.HttpStatus.CREATED',
  ACCEPTED: 'org.springframework.http.HttpStatus.ACCEPTED',
  NO_CONTENT: 'org.springframework.http.HttpStatus.NO_CONTENT',
  BAD_REQUEST: 'org.springframework.http.HttpStatus.BAD_REQUEST',
  UNAUTHORIZED: 'org.springframework.http.HttpStatus.UNAUTHORIZED',
  FORBIDDEN: 'org.springframework.http.HttpStatus.FORBIDDEN',
  NOT_FOUND: 'org.springframework.http.HttpStatus.NOT_FOUND',
  INTERNAL_SERVER_ERROR: 'org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR',
  NOT_IMPLEMENTED: 'org.springframework.http.HttpStatus.NOT_IMPLEMENTED',
  SERVICE_UNAVAILABLE: 'org.springframework.http.HttpStatus.SERVICE_UNAVAILABLE',
};

const REQUEST_RESPONSE_MAP = {
  HttpHeaders: 'org.springframework.http.HttpHeaders',
  HttpEntity: 'org.springframework.http.HttpEntity',
  ResponseEntity: 'org.springframework.http.ResponseEntity',
};

const SPRING_BOOT_COMMON_MAP = {
  Application: 'org.springframework.boot.SpringApplication',
  SpringBootApplication: 'org.springframework.boot.autoconfigure.SpringBootApplication',
};

const DEPENDENCY_INJECTION_MAP = {
  Autowired: 'org.springframework.beans.factory.annotation.Autowired',
  Component: 'org.springframework.stereotype.Component',
  Service: 'org.springframework.stereotype.Service',
  Repository: 'org.springframework.stereotype.Repository',
  Configuration: 'org.springframework.context.annotation.Configuration',
  Bean: 'org.springframework.context.annotation.Bean',
  Value: 'org.springframework.beans.factory.annotation.Value',
};

const VALIDATION_MAP = {
  NotNull: 'jakarta.validation.constraints.NotNull',
  NotEmpty: 'jakarta.validation.constraints.NotEmpty',
  NotBlank: 'jakarta.validation.constraints.NotBlank',
  Email: 'jakarta.validation.constraints.Email',
  Size: 'jakarta.validation.constraints.Size',
  Pattern: 'jakarta.validation.constraints.Pattern',
};

const IMPORTS_MAP = {
  mediaTypes: MEDIA_TYPE_MAP,
  annotations: ANNOTATION_MAP,
  httpStatuses: HTTP_STATUS_MAP,
  requestResponse: REQUEST_RESPONSE_MAP,
  springBoot: SPRING_BOOT_COMMON_MAP,
  dependencyInjection: DEPENDENCY_INJECTION_MAP,
  validation: VALIDATION_MAP,
};

export const JAVA_ATTRIBUTE_TYPES = [
  // Basic Types
  'String',
  'UUID',
  'Integer',
  'int',
  'Long',
  'long',
  'Boolean',
  'boolean',
  'Short',
  'short',
  'Byte',
  'byte',
  'Float',
  'float',
  'Double',
  'double',
  'Character',
  'char',

  // Date and Time
  'LocalTime',
  'LocalDate',
  'LocalDateTime',
  'ZonedDateTime',
  'OffsetDateTime',
  'Instant',
  'Date',
  'Calendar',
  'TimeZone',
  'Duration',
  'Period',

  // Number Types
  'BigInteger',
  'BigDecimal',

  // Streams and I/O
  'InputStream',
  'OutputStream',
  'BufferedInputStream',
  'BufferedOutputStream',
  'Reader',
  'Writer',
  'BufferedReader',
  'BufferedWriter',
  'File',
  'Path',
  'Files',
  'FileReader',
  'FileWriter',
  'PrintWriter',
  'PrintStream',

  // Miscellaneous
  'Optional',
  'Object',
  'Stream',
  'IntStream',
  'LongStream',
  'DoubleStream',

  // Arrays and Primitives
  'int[]',
  'long[]',
  'double[]',
  'float[]',
  'byte[]',
  'char[]',
  'boolean[]',
  'String[]',
  'Object[]',
] as const;

export const JAVA_8_TYPES = [
  // Java 8 and Above Functional Types
  'Function',
  'Consumer',
  'Collectors',
  'Supplier',
  'Predicate',
  'BiFunction',
  'BiConsumer',
  'UnaryOperator',
  'BinaryOperator',
]

export const JAVA_EXCEPTIONS = [
  'Throwable',
  'Exception',
  'RuntimeException',
  'IllegalArgumentException',
  'NullPointerException',
  'IllegalStateException',
  'IOException',
  'SQLException',
]

export const JAVA_COLLECTION_TYPES = [
  // Collections and Data Structures
  'List',
  'ArrayList',
  'LinkedList',
  'Set',
  'HashSet',
  'TreeSet',
  'Map',
  'HashMap',
  'TreeMap',
  'Queue',
  'Deque',
  'PriorityQueue',
  'Stack',
  'Vector',
  'Arrays',
]

export const JAVA_CONCURRENCY_TYPES = [
  // Concurrency
  'Thread',
  'Runnable',
  'Callable',
  'Executor',
  'ExecutorService',
  'ScheduledExecutorService',
  'Future',
  'CompletableFuture',
  'Semaphore',
  'Lock',
  'ReentrantLock',
  'CountDownLatch',
  'CyclicBarrier',
]

export const JAVA_NETWORK_TYPES = [
  // Networking
  'URL',
  'URLConnection',
  'HttpURLConnection',
  'InetAddress',
  'Socket',
  'ServerSocket'
]

export const VALID_PRIMARY_KEY = ['int','Integer', 'long', 'Long', 'UUID', 'String']

export const JAVA_TYPES: Map<string, TypeMetadata> = new Map(Object.entries({
  'boolean': { name: 'boolean', primitive: true },
  'short': { name: 'short', primitive: true },
  'int': { name: 'int', primitive: true },
  'long': { name: 'long', primitive: true },
  'float': { name: 'float', primitive: true },
  'double': { name: 'double', primitive: true },
  'Boolean': { name: 'Boolean', primitive: false },
  'Short': { name: 'Short', primitive: false },
  'Integer': { name: 'Integer', primitive: false },
  'Long': { name: 'Long', primitive: false },
  'Double': { name: 'Double', primitive: false },
  'String': { name: 'String', primitive: false },
  'BigDecimal': { name: 'BigDecimal', primitive: false, namespace: 'java.math', },
  'BigInteger': { name: 'BigInteger', primitive: false, namespace: 'java.math' },
  'LocalDate': { name: 'LocalDate', primitive: false, namespace: 'java.time' },
  'LocalDateTime': { name: 'LocalDateTime', primitive: false, namespace: 'java.time' },
  'LocalTime': { name: 'LocalTime', primitive: false, namespace: 'java.time' },
  'ZoneDateTime': { name: 'ZoneDateTime', primitive: false, namespace: 'java.time' },
  'OffsetDateTime': { name: 'OffsetDateTime', primitive: false, namespace: 'java.time' },
  'Instant': { name: 'Instant', primitive: false, namespace: 'java.time' },
  'List': { name: 'List', primitive: false, namespace: 'java.util', },
  'Object': { name: 'Object', primitive: false },
}));

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
  'byte',
  'character',
  'instant',
];

export const GENERIC_COLLECTION_TYPES = [
  'list',
  'map',
  'set'
];

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
      java: { name: 'long', primitive: true },
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
      java: { name: 'float', primitive: true },
      dotnet: { name: 'float', primitive: true },
      python: { name: 'float', primitive: true },
      kotlin: { name: 'Float', primitive: true },
    },
    double: {
      java: { name: 'double', primitive: true },
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
    // Collections
    list: {
      java: { name: 'List', primitive: false, namespace: 'java.util' },
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
  })
);

export const SIMPLE_RESPONSE_TYPES = ['String', 'Integer', 'Boolean', 'Object'] as const;
export const RESPONSE_TYPES = [...SIMPLE_RESPONSE_TYPES, ...SIMPLE_RESPONSE_TYPES.map(responseType => `List<${responseType}>`)]

export const REQUEST_BODY_NOT_IMPORT = ['String', 'Integer', 'Boolean', 'Object'];

export const DATABASE_TYPES = ['MySQL', 'Oracle', 'Postgresql'] as const;
export const STRUCT_TYPES = [PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN, PROJECT_STRUCTURE_STYLE.TECHNICAL] as const
export const OBJECT_TYPES = ['dto', 'command', 'query', 'event'] as const
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
  "",
  "font/woff2",
  "application/json",
  "multipart/form-data",
  "video/ogg",
  "application/ogg",
  "audio/3gpp",
  "audio/webm",
  "audio/wav",
  "image/svg+xml",
  "image/jpeg",
  "audio/aac",
  "audio/mpeg",
  "application/x-csh",
  "image/webp",
  "application/x-7z-compressed",
  "font/woff",
  "font/ttf",
  "video/mpeg",
  "application/gzip",
  "application/xml",
  "text/csv",
  "text/javascript",
  "application/pdf",
  "application/x-tar",
  "font/otf",
  "application/zip",
  "audio/midi",
  "video/3gpp",
  "audio/ogg",
  "image/apng",
  "image/png",
  "text/calendar",
  "text/css",
  "application/x-cdf",
  "application/x-bzip",
  "text/plain",
  "image/tiff",
  "video/webm",
  "audio/x-midi",
  "image/gif",
  "application/x-bzip2",
  "image/bmp",
  "text/html",
  "audio/3gpp2",
  "application/octet-stream",
  "video/mp4",
  "video/3gpp2",
  "application/epub+zip",
  "image/avif",
  "video/mp2t"
];

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

export const PARAMS_TYPES = ['Long', 'String', 'Integer', 'Boolean', 'Object'] as const

export const GENERATION_TYPES = ['', 'IDENTITY', 'SEQUENCE', 'TABLE', 'AUTO'] as const