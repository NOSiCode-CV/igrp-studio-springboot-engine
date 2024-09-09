import * as Handlebars from 'handlebars';

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

Handlebars.registerHelper('contains', function(str, substring) {
  return str.includes(substring);
});

Handlebars.registerHelper('paramsFormat', function(str){
  return `{${str}}`
})

export { Handlebars };