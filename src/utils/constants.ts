const path = require('path');
import { apiconfig } from "../interfaces/types";


export const TEMPLATE_DIR = path.join(__dirname, '../templates');
export const OUTPUT_DIR = path.join(__dirname, '../../generated-apis');

export const TEMPLATE = {
  'application': 'domain/application.hbs',
  'application.properties': 'domain/resources/application.properties.hbs'
}

export const DIRECTORY = {

  IGRPSTUDIO_DIR: (apiName: string) => `${apiName}/.igrpstudio`,
  TEST_DIR: (config: apiconfig) => `${config.apiName}/src/test/java/${config.group}.${config.artifact}`,
  MAIN_DIR: (config: apiconfig) => `${config.apiName}/src/main/java/${config.group}.${config.artifact}`
}

export const SUCCESS_MESSAGE = {
  CREATED_DIRECTORY: 'Directories created or already exists'
}

export const ERROR_MESSAGE ={
  ERROR_CREATING_DIRECTORY: ''
}


