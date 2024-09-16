import path from 'path';

export const TEMPLATE_DIR = path.join(__dirname, '../../public/templates');

export const DIRECTORIES = {
  BASE_API: '.igrpstudio/baseApi.json',
  CONFIG_CONTROLLER: '.igrpstudio/controllers',
  CONFIG_ICONTROLLER: '.igrpstudio/controllers',
  CONFIG_MODEL: '.igrpstudio/models',
  CONFIG_DTO: '.igrpstudio/dto',
  CONTROLLERS: 'controllers',
  IGRPSTUDIO: '.igrpstudio',
  MODELS: 'models',
  DTO: 'dto',
  RESOURCES: 'src/main/resources',
  REPOSITORIES: 'repositories',
  SERVICES: 'services',
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
  INVALID_OUTPUT_PATH: 'The provided output path is invalid or does not exist.',
  MODEL_REQUIRED:
    'The model is required. Please provide the model configuration to save your data.',
  MODEL_FILE_CONFIG_NOT_FOUNT: 'Model file configuration not found',
  DTO_FILE_CONFIG_NOT_FOUNT: 'DTO file configuration not found',
  TEMPLATE_NAME_REQUIRED: 'The name of the template must be provided.',
  TEMPLATE_NAME_NOT_REGISTERED: 'The name of the template must be registered.',
};

export const TEMPLATES = {
  APPLICATION: 'domain/application.hbs',
  DOMAIN_CONTROLLER: 'domain/controller/controller.hbs',
  DOMAIN_ICONTROLLER: 'domain/controller/controllerInterface.hbs',
  DOMAIN_MODEL: 'domain/model/model.hbs',
  DOMAIN_REPOSITORY: 'domain/repository/repository.hbs',
  DOMAIN_RESOURCES: 'domain/resource/application.properties.hbs',

  DOMAIN_DTO: {
    'classic': 'domain/dto/lombok.hbs',
    'record': 'domain/dto/record.hbs',
  },

  IGRP_BASE_API: 'igrpstudio/baseApi.hbs',
  IGRP_MODEL: 'igrpstudio/model.hbs',
  IGRP_CONTROLLER: 'igrpstudio/controller.hbs',

  CONFIG_MVNW: 'config/mvnw.hbs',
  CONFIG_POM_XML: 'config/pom.xml.hbs',
  CONFIG_MVNW_CMD: 'config/mvnw.cmd.hbs',
  CONFIG_GITIGNORE: 'config/gitignore.hbs',
  CONFIG_DOCKER_FILE: 'config/dockerfile.hbs',
  CONFIG_GITLABCIYAML: 'config/gitlabciyaml.hbs',
  CONFIG_DOCKERIGNORE: 'config/dockerignore.hbs',
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

export const COMMON_FILES = {
  APPLICATION_PROPERTIES: 'application.properties',
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
};

export const EXTENSIONS = {
  JAVA: '.java',
  JSON: '.json',
};

export const PATTERNS = {
  NOT_EMPTY: '^.+$',
  NO_SPACE_AND_HYPHEN: '^[^\\s-][a-zA-Z]*$',
  NAME_VALIDATION_PATTERN: '^[A-Za-z][A-Za-z0-9_]*$',
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
  'Text'
] as const;

export const RESPONSE_TYPES = ['String', 'Integer', 'Boolean', 'Object'] as const;

export const DATABASE_TYPES = ['MySQL', 'Oracle', 'Postgresql'] as const;
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