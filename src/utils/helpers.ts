import * as Handlebars from 'handlebars';
import { DIRECTORIES, EXTENSIONS } from './constants';
import path from 'path';

Handlebars.registerHelper('capitalize', (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
});

Handlebars.registerHelper('toLowerCase', (str: string) => {
  return str.toLowerCase();
});

Handlebars.registerHelper('lowercaseAndPluralize', (str: string) => {
  const lowerStr = str.toLowerCase();
  
  if (lowerStr.endsWith('y') && !/[aeiou]y$/.test(lowerStr)) {
    return lowerStr.replace(/y$/, 'ies');
  }

  if (/[sxz]$/.test(lowerStr) || /[ch]$/.test(lowerStr)) {
    return lowerStr + 'es';
  }

  return lowerStr + 's';
});

Handlebars.registerHelper('replace', (str: string) => {
  return str.replace('.', '/');

});

Handlebars.registerHelper('json', function(context) {
  return JSON.stringify(context);
});

Handlebars.registerHelper('ifNot', function(this: any, conditional: any, options: any) {
  if (!conditional) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

Handlebars.registerHelper('eq', function (this: any, arg1: any, arg2: any, options: Handlebars.HelperOptions) {
  if (arg1 === arg2) {
    return true;
  } else {
    return false;
  }
});

const formatPackageName = (group: string, artifact: string) => `${group}.${artifact}`.replace(/\./g, '/');

const getTestPath = (group: string, artifact: string) => `src/test/java/${formatPackageName(group, artifact)}`;

const getMainPath = (group: string, artifact: string) => `src/main/java/${formatPackageName(group, artifact)}`;

const getModelConfigPath = (model: string, output: string) => path.join(output, DIRECTORIES.CONFIG_MODEL, `${model}${EXTENSIONS.JSON}`);

const getControllerConfigPath = (controller: string, output: string) => path.join(output, DIRECTORIES.CONFIG_CONTROLLER, `${controller}${EXTENSIONS.JSON}`);

export { 
  Handlebars,
  getTestPath,
  getMainPath,
  formatPackageName,
  getModelConfigPath,
  getControllerConfigPath

};
