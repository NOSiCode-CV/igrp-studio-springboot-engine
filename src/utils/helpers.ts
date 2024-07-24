import * as Handlebars from 'handlebars';

Handlebars.registerHelper('capitalize', (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
});

Handlebars.registerHelper('toLowerCase', (str: string) => {
  return str.toLowerCase();
});

Handlebars.registerHelper('replace', (str: string) => {
  return str.replace('.', '/');

});

export { Handlebars };
