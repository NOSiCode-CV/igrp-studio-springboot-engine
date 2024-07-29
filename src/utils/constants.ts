import path from 'path';
import { ApiConfig } from "../interfaces/types";


export const TEMPLATE_DIR = path.join(__dirname, '../../src/templates');
export const OUTPUT_DIR = 'C:/Users/Eduardo Fernando/Documents/Wayvant/spring_projects_test';
// TODO: Move this out of constants and change it to helper functions.
export const PACKAGE_NAME = (group: string, artifact: string) => `${group}.${artifact}`.replace(/\./g, '/');

export const DIRECTORIES = { 
  BASE_API: '.igrpstudio/baseApi.json',
  CONTROLLERS: 'controller',
  IGRPSTUDIO: '.igrpstudio',
  MODELS: 'model',
  RESOURCES: 'src/main/resource',
  REPOSITORIES: 'repositories',
  SERVICES: 'services',
  
  TEST: (group: string, artifact: string) => `src/test/java/${PACKAGE_NAME(group, artifact)}`,
  MAIN: (group: string, artifact: string) => `src/main/java/${PACKAGE_NAME(group, artifact)}`,
}

export const SUCCESS_MESSAGE = {
  DIRECTORY_CREATED: 'Directories created',
  FILE_SAVED: 'The file has been saved successfully.',
}

export const ERROR_MESSAGE = {
  DIRECTORY_DOES_NOT_EXISTS: `The specified directory doesn't exists. Please select a different directory.`,
  DIRECTORY_ALREADY_IN_USE: 'The specified directory is already in use. Please select a different directory or remove the existing files.',
  ERROR_SAVING_FILE_CONFIG: 'An error ocurred while saving file. Please check the log for more details.',
  ERROR_CREATING_DIRECTORY: 'An error occurred while creating directories. Please check the log for more details.',
  FILE_CHECKING: 'Error chaecking if path is a file. Please verify your path and try again',
  INVALID_API_CONFIG: 'The provided API configuration is invalid. Please verify the API details and try again.',
  INVALID_OUTPUT_PATH: 'The provided output path is invalid or does not exist.',
};

export const TEMPLATES = {
  APPLICATION: 'domain/application.hbs',
  DOMAIN_MODEL: 'domain/model/model.hbs',
  DOMAIN_CONTROLLER: 'domain/controller/controller.hbs',
  DOMAIN_REPOSITORY: 'domain/repository/repository.hbs',
  DOMAIN_RESOURCES: 'domain/resource/application.properties.hbs',
  IGRP_BASE_API: 'igrpstudio/baseApi.hbs',
  IGRP_MODEL: 'igrpstudio/model.hbs',

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
  BASE_API: 'baseApi.json',
  DOCKERFILE: 'Dockerfile',
  GITIGNORE: '.gitignore',
  GITLAB_CI_YAML: 'gitlab-ci.yaml',
  MVNW: 'mvnw',
  MVNW_CMD: 'mvnw.cmd',
  POM_XML: 'pom.xml',
}

export const EXTENSIONS = {
  JAVA: '.java',
  JSON: '.json'
}




