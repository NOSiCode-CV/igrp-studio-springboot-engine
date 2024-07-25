const path = require('path');
import { ApiConfig } from "../interfaces/types";


export const TEMPLATE_DIR = path.join(__dirname, '../../src/templates');
export const OUTPUT_DIR = 'C:/Users/Eduardo Fernando/Documents/Wayvant/spring_projects_test';
export const PACKAGE_NAME = (config: ApiConfig) => `${config.group}.${config.artifact}`.replace(/\./g, '/');

export const DIRECTORIES = {
  CONTROLLERS: 'controller',
  IGRPSTUDIO: '.igrpstudio/',
  MODELS: 'model',
  RESOURCES: 'src/main/resource',
  REPOSITORIES: 'repositories',
  SERVICES: 'services',
  BASE_API: '.igrpstudio/baseApi.json',
  
  TEST: (config: ApiConfig) => `src/test/java/${PACKAGE_NAME(config)}`,
  MAIN: (config: ApiConfig) => `src/main/java/${PACKAGE_NAME(config)}`,
}

export const SUCCESS_MESSAGE = {
  FILE_SAVED: 'The file has been saved successfully.',
  DIRECTORY_CREATED: 'Directories created'
}

export const ERROR_MESSAGE = {
  ERROR_SAVING_FILE_CONFIG: 'An error ocurred while saving file. Please check the log for more details.',
  ERROR_CREATING_DIRECTORY: 'An error occurred while creating directories. Please check the log for more details.',
  FILE_CHECKING: 'Error chaecking if path is a file. Please verify your path and try again',
  INVALID_API_CONFIG: 'The provided API configuration is invalid. Please verify the API details and try again.',
  DIRECTORY_DOES_NOT_EXISTS: `The specified directory doesn't exists. Please select a different directory.`,
  DIRECTORY_ALREADY_IN_USE: 'The specified directory is already in use. Please select a different directory or remove the existing files.',
};

export const TEMPLATES = {
  APPLICATION: 'domain/application.hbs',
  DOMAIN_MODEL: 'domain/model/model.hbs',
  IGRP_BASE_API: 'igrpstudio/baseApi.hbs',
  IGRP_MODEL: 'igrpstudio/model.hbs',
  DOMAIN_CONTROLLER: 'domain/controller/controller.hbs',
  DOMAIN_RESOURCES: 'domain/resource/application.properties.hbs',

  CONFIG_MVNW: 'config/mvnw.hbs',
  CONFIG_POM_XML: 'config/pom.xml.hbs',
  CONFIG_MVNW_CMD: 'config/mvnw.cmd.hbs',
  CONFIG_GITIGNORE: 'config/gitignore.hbs',
  CONFIG_DOCKER_FILE: 'config/dockerfile.hbs',
  CONFIG_GITLABCIYAML: 'config/gitlabciyaml.hbs',
}

export const CONFIG_FILES = [
  {template: TEMPLATES.CONFIG_MVNW,          output: 'mvnw'},
  {template: TEMPLATES.CONFIG_POM_XML,       output: 'pom.xml'},
  {template: TEMPLATES.CONFIG_MVNW_CMD,      output: 'mvnw.cmd'},
  {template: TEMPLATES.CONFIG_DOCKER_FILE,   output: 'Dockerfile'},
  {template: TEMPLATES.CONFIG_GITIGNORE,     output: '.gitignore'},
  {template: TEMPLATES.CONFIG_GITLABCIYAML,  output: 'gitlab-ci.yaml'},
]


export const COMMON_FILES = {
  APPLICATION_PROPERTIES: 'application.properties',
  BASE_API: 'baseApi.json'
}

export const EXTENSIONS = {
  JAVA: '.java',
  JSON: '.json'
}




