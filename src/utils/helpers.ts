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

Handlebars.registerHelper('json', function(context) {
  return JSON.stringify(context);
});


Handlebars.registerHelper('eq', function (this: any, arg1: any, arg2: any, options: Handlebars.HelperOptions) {
  if (arg1 === arg2) {
    return true;
  } else {
    return false;
  }
});



export { Handlebars };
