import path from 'path';
import { TypeMetadata } from '../interfaces/types';

// export const TEMPLATE_DIR = path.join(__dirname, '../../public/templates');
export const TEMPLATE_DIR = path.join(__dirname, './templates');

export const DIRECTORIES = {
  BASE_API: '.igrpstudio/baseApi.json',
  CONFIG_CONTROLLER: '.igrpstudio/controllers',
  CONFIG_ICONTROLLER: '.igrpstudio/controllers',
  CONFIG_MODEL: '.igrpstudio/models',
  CONFIG_PERMISSION: '.igrpstudio/permissions',
  CONFIG_DTO: '.igrpstudio/dto',
  CONTROLLERS: 'controllers',
  CONTROLLER: 'controller',
  IGRPSTUDIO: '.igrpstudio',
  MONITORING: 'monitoring',
  MODELS: 'models',
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
  QUERY: 'query',
  ASSEMBLER: 'assembler',
  AGGREGATE: 'aggregate',
  EVENT: 'event',
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
  TEMPO: 'tempo'
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

export const SUCCESS_MESSAGE = {
  DIRECTORY_CREATED: 'Directories created',
  FILE_SAVED: 'The file has been saved successfully.',
};

export const ERROR_MESSAGE = {
  BASE_API_NOT_FOUND: 'The base api json file configuration was not found.',
  CONTROLLER_FILE_CONFIG_NOT_FOUND: 'Controller file configuration not found',
  CONTROLLER_FILE_NOT_FOUND: 'Controller class not found',
  DIRECTORY_DOES_NOT_EXIST:
    'The specified directory does not exist. Please select a different directory.',
  DIRECTORY_ALREADY_IN_USE:
    'The specified directory is already in use. Please select a different directory or remove the existing files.',
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
  APPLICATION: 'domain/application.hbs',

  DOMAIN_CONTROLLER: 'domain/controller/controller.hbs',
  DOMAIN_ICONTROLLER: 'domain/controller/controllerInterface.hbs',
  DOMAIN_SERVICE: 'domain/service/serviceImpl.hbs',
  DOMAIN_MODEL: 'domain/model/model.hbs',
  DOMAIN_REPOSITORY: 'domain/repository/repository.hbs',
  DOMAIN_RESOURCES: 'domain/resource/application.properties.hbs',
  DDD_DOMAIN_RESOURCES: 'struct/domain/java/resources/application.properties.hbs',
  DDD_DOMAIN_RESOURCES_LOCAL: 'struct/domain/java/resources/application-local.properties.hbs',
  DDD_DOMAIN_RESOURCES_DOCKER: 'struct/domain/java/resources/application-docker.properties.hbs',
  DOMAIN_MODEL_PRIMARY_KEY: 'domain/model/primarykey.hbs',
  DOMAIN_MODEL_AUDIT: 'domain/model/audit.hbs',
  APPLICATION_AUDIT_AWARE: 'domain/model/applicationAditorAware.hbs',

  DOMAIN_DTO: {
    'classic': 'domain/dto/lombok.hbs',
    'record': 'domain/dto/record.hbs',
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

  CONFIG_MVNW: 'config/mvnw.hbs',
  CONFIG_POM_XML: 'config/pom.xml.hbs',
  CONFIG_POM_XML_OBSERVABILITY: 'config/pom.xml-observability.hbs',
  CONFIG_MVNW_CMD: 'config/mvnw.cmd.hbs',
  CONFIG_GITIGNORE: 'config/gitignore.hbs',
  CONFIG_DOCKER_FILE: 'config/dockerfile.hbs',
  CONFIG_DOCKER_FILE_OBSERVABILITY: 'config/dockerfile-observability.hbs',
  CONFIG_DOCKER_COMPOSE_OBSERVABILITY: 'config/dockercompose-observability.hbs',
  CONFIG_OTEL_AGENT: 'config/opentelemetry-javaagent.jar',
  CONFIG_GITLABCIYAML: 'config/gitlabciyaml.hbs',
  CONFIG_DOCKERIGNORE: 'config/dockerignore.hbs',
  CONFIG_SECURITY: 'config/security.hbs',

  // DOMAIN DRIVEN DESIGN
  DDD_COMMAND: 'struct/domain/java/application/command/command.hbs',
  DDD_COMMAND_BUS: 'struct/domain/java/application/command/commandbus.hbs',
  DDD_COMMAND_HANDLER: 'struct/domain/java/application/command/commandhandler.hbs',
  DDD_COMMAND_LISTENER: 'struct/domain/java/application/command/commandlistener.hbs',
  DDD_ASSEMBLER: 'struct/domain/java/application/query/assembler/assembler.hbs',
  DDD_ASSEMBLER_DATA_IMPL: 'struct/domain/java/application/query/assembler/assemblerdataimpl.hbs',
  DDD_ASSEMBLER_AGGREGATE_IMPL: 'struct/domain/java/application/query/assembler/assembleraggimpl.hbs',
  DDD_DATA_TRANSFER_OBJECT: 'struct/domain/java/application/query/dto/datatransferobject.hbs',
  DDD_AGGREGATE: 'struct/domain/java/application/domain/aggregate/aggregate.hbs',
  DDD_AGGREGATE_IDENTIFIER: 'struct/domain/java/application/domain/aggregate/aggregateidentifier.hbs',
  DDD_AGGREGATE_ROOT: 'struct/domain/java/application/domain/aggregate/aggregateroot.hbs',
  DDD_AGGREGATE_ROOT_IMPL: 'struct/domain/java/domain/aggregate/aggregaterootimpl.hbs',
  DDD_VALUE_OBJECT: 'struct/domain/java/application/domain/aggregate/valueobject.hbs',
  DDD_EVENT: 'struct/domain/java/application/domain/event/event.hbs',
  DDD_EVENT_BUS: 'struct/domain/java/application/domain/event/eventbus.hbs',
  DDD_EVENT_LISTENER: 'struct/domain/java/application/domain/event/eventlistener.hbs',
  DDD_AGGREGATE_SERVICE: 'struct/domain/java/application/domain/service/aggregateservice.hbs',
  DDD_CMD_SERVICE: 'struct/domain/java/application/domain/service/cmdservice.hbs',
  DDD_CMD_SERVICE_IMPL: 'struct/domain/java/application/domain/impl/cmdserviceimpl.hbs',
  DDD_QUERY_SERVICE: 'struct/domain/java/application/domain/service/queryservice.hbs',
  DDD_QUERY_SERVICE_IMPL: 'struct/domain/java/application/domain/impl/queryserviceimpl.hbs',
  DDD_DOMAIN_ENTITY: 'struct/domain/java/application/domain/domainentity.hbs',
  DDD_CACHE_SERVICE: 'struct/domain/java/application/infrastructure/cache/cacheservice.hbs',
  DDD_CONVERTER: 'struct/domain/java/application/infrastructure/db/converter/converter.hbs',
  DDD_CONVERTER_IMPL: 'struct/domain/java/application/infrastructure/db/converter/converterimpl.hbs',
  DDD_DATA_OBJECT: 'struct/domain/java/application/infrastructure/db/dataobject/dataobject.hbs',
  DDD_ENTITY_BASE: 'struct/domain/java/application/infrastructure/db/entity/entitybase.hbs',
  DDD_ENTITY_BASE_IMPL: 'struct/domain/java/application/infrastructure/db/entity/entitybaseimpl.hbs',
  DDD_BASE_REPOSITORY: 'struct/domain/java/application/infrastructure/db/repository/baserepository.hbs',
  DDD_BASE_REPOSITORY_IMPL: 'struct/domain/java/application/infrastructure/db/repository/baserepositoryimpl.hbs',
  DDD_AGGREGATE_REPOSITORY: 'struct/domain/java/application/domain/repository/domainrepository.hbs',
  DDD_AGGREGATE_REPOSITORY_IMPL: 'struct/domain/java/application/infrastructure/db/impl/domainrepositoryimpl.hbs',
  DDD_SPRING_COMMAND_BUS: 'struct/domain/java/application/infrastructure/spring/springcommandbus.hbs',
  DDD_SPRING_EVENT_BUS: 'struct/domain/java/application/infrastructure/spring/springeventbus.hbs',

};

export const CONFIG_FILES = [
  { template: TEMPLATES.CONFIG_MVNW, output: 'mvnw' },
  { template: TEMPLATES.CONFIG_POM_XML, output: 'pom.xml' },
  { template: TEMPLATES.CONFIG_MVNW_CMD, output: 'mvnw.cmd' },
  { template: TEMPLATES.CONFIG_DOCKER_FILE, output: 'Dockerfile' },
  { template: TEMPLATES.CONFIG_GITIGNORE, output: '.gitignore' },
  { template: TEMPLATES.CONFIG_GITLABCIYAML, output: 'gitlab-ci.yaml' },
  { template: TEMPLATES.CONFIG_DOCKERIGNORE, output: '.dockerignore' },
];

export const OBSERVABILITY_CONFIG_FILES = [
  { template: TEMPLATES.CONFIG_MVNW, output: 'mvnw' },
  { template: TEMPLATES.CONFIG_POM_XML_OBSERVABILITY, output: 'pom.xml' },
  { template: TEMPLATES.CONFIG_MVNW_CMD, output: 'mvnw.cmd' },
  { template: TEMPLATES.CONFIG_DOCKER_FILE_OBSERVABILITY, output: 'Dockerfile' },
  { template: TEMPLATES.CONFIG_DOCKER_COMPOSE_OBSERVABILITY, output: 'docker-compose.yml' },
  { template: TEMPLATES.CONFIG_GITIGNORE, output: '.gitignore' },
  { template: TEMPLATES.CONFIG_GITLABCIYAML, output: 'gitlab-ci.yaml' },
  { template: TEMPLATES.CONFIG_DOCKERIGNORE, output: '.dockerignore' },
];

export const OBSERVABILITY_BINARY_FILES = [
  { inputPath: TEMPLATES.CONFIG_OTEL_AGENT, output: 'opentelemetry-javaagent.jar' }
]

export const COMMON_FILES = {
  APPLICATION_PROPERTIES: 'application.yml',
  APPLICATION_PROPERTIES_FILE: 'application.properties',
  APPLICATION_PROPERTIES_FILE_LOCAL: 'application-local.properties',
  APPLICATION_PROPERTIES_FILE_DOCKER: 'application-docker.properties',
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

export const METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'] as const;

export const ATTRIBUTE_TYPES = [
  'Boolean',
  'Byte',
  'Short',
  'Character',
  'Integer',
  'Long',
  'Float',
  'Double',
  'String',
  'Date',
  'BigInteger',
  'BigDecimal',
  'Time',
  'Timestamp',
  'Text',
  'boolean',
  'char',
  'short',
  'int',
  'long',
  'float',
  'double',
  'UUID'
] as const;

export const VALID_PRIMARY_KEY = ['int', 'long', 'Long', 'Integer', 'UUID']

export const JAVA_TYPES: Map<string, TypeMetadata> = new Map(Object.entries({
  'boolean': { name: 'boolean', primitive: true },
  'char': { name: 'char', primitive: true },
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
  'Character': { name: 'Character', primitive: false },
  'BigDecimal': { name: 'BigDecimal', primitive: false, namespace: 'java.math', },
  'BigInteger': { name: 'BigInteger', primitive: false, namespace: 'java.math' },
  'LocalDate': { name: 'LocalDate', primitive: false, namespace: 'java.time' },
  'LocalDateTime': { name: 'LocalDateTime', primitive: false, namespace: 'java.time' },
  'LocalTime': { name: 'LocalDateTime', primitive: false, namespace: 'java.time' },

  'List': { name: 'List', primitive: false, namespace: 'java.util', },
}));


export const SIMPLE_RESPONSE_TYPES = ['String', 'Integer', 'Boolean', 'Object'] as const;
export const RESPONSE_TYPES = [...SIMPLE_RESPONSE_TYPES, ...SIMPLE_RESPONSE_TYPES.map(responseType => `List<${responseType}>`)]

export const REQUEST_BODY_NOT_IMPORT = ['String', 'Integer', 'Boolean', 'Object'];

export const DATABASE_TYPES = ['MySQL', 'Oracle', 'Postgresql'] as const;
export const STRUCT_TYPES = ['domain', 'technical'] as const
export const OBJECT_TYPES = ['dto', 'dataobject', 'command', 'query', 'event', 'valueobject', 'domainentity', 'datatransferobject'] as const
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

export const PARAMS_TYPES = ['Long', 'String', 'Integer', 'Character', 'Boolean', 'Object'] as const

export const GENERATION_TYPES = ['', 'IDENTITY', 'SEQUENCE', 'TABLE', 'AUTO'] as const