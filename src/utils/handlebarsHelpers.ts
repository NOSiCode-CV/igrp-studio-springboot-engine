import * as Handlebars from 'handlebars';
import { GenericType, JavaAttribute, JavaType } from '../interfaces/types';

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

Handlebars.registerHelper('resolve-imports', function (this: any, config: any) {
  if (!config) return null;
  if (!config.type || config.type !== 'dto') return null;
  if (!config.attributes) return null;
  if (!Array.isArray(config.attributes)) return;

  const imports = new Set();
  config.attributes.forEach((attr: JavaAttribute) => {
    if (typeof attr.type === 'string') return;
    const type: JavaType = attr.type;
    if (type.namespace) {
      imports.add(`import ${type.namespace}.${type.name};`);
    }
    
    if (type.generics) {
      type.generics.forEach(grc => {
        if (grc.namespace) imports.add(`import ${grc.namespace}.${grc.name};`)
      });
    }
  });

  //TODO handle annotarions import

  return Array.from(imports).sort().join('\n');
});


Handlebars.registerHelper('resolve-type', function (this: any, t1: any) {
  if (!t1 || typeof t1 === 'string') return t1;

  let rtype = t1.name;
  if (t1.generics && Array.isArray(t1.generics) && t1.generics.length > 0) {
    const gnrs = t1.generics.map((e1: GenericType) => e1.name).join(", ");
    rtype = `${rtype}<${gnrs}>`;
  }

  return rtype;
});

export { Handlebars };