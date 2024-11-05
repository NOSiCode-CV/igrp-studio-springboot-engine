import * as Handlebars from 'handlebars';

import { Attribute, ControllerAction, JavaAttribute, JavaType, ModelConfig, Relation } from '../interfaces/types';
import { REQUEST_BODY_NOT_IMPORT } from './constants';
import { extractTypeFromList } from './helpers';

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

Handlebars.registerHelper('importsTypes', function(actions: ControllerAction[], group: string, artifact: string) {
  let imports: string [] = []
  for (const action of actions) {
    if (action.requestBody)
      if (!REQUEST_BODY_NOT_IMPORT.includes(action.requestBody)) 
        imports.push(`import ${group}.${artifact}.dto.${action.requestBody};`)
      if (action.response)
        if (extractTypeFromList(action.response)){
          const type = extractTypeFromList(action.response)
          imports.push(`import ${group}.${artifact}.dto.${type};`)
        }
        if(action.response.startsWith('List'))
          imports.push(`import java.util.List;`)

  }
  
  return [...new Set(imports)].join(" ")
})


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

Handlebars.registerHelper('resolve-mapping', function(this: any, action: ControllerAction) {
 let pathVariable = ""
  if(action.path) {
    if (action.pathVariables){
      action.pathVariables.forEach(path =>{
        pathVariable = pathVariable.concat(`=/{${path.name}}`)
      })

      return pathVariable
    }
  }
  
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
      if (type.namespace.includes('models'))
        imports.add(`import ${type.namespace}.${type.name}.${type.name};`);
      else 
        imports.add(`import ${type.namespace}.${type.name};`);
    }
    if (attr.isList)
      imports.add(`import java.util.List;`);
  });

  return Array.from(imports).sort().join('\n');
});


Handlebars.registerHelper('resolve-type', function (this: any, t1: any) {
  if (!t1.type || typeof t1.type === 'string') return t1.type;

  let rtype = t1.type.name;
  if (t1.isList ) {
    rtype = `List<${t1.type.name}>`;
  }
  return rtype;
});

Handlebars.registerHelper('model-imports', function(this: any, config: ModelConfig) {
  const imports = new Set();
  
  if (config.relations) {
    config.relations.forEach((relation:Relation) => {
      if ( relation.relationType !== 'ManyToOne' && relation.relationType !== 'OneToOne') 
        imports.add('import java.util.List;')
    });
  }

  config.attributes.forEach((attr:Attribute) => {
    if ( attr.type === 'String' && attr.nullable === false) 
      imports.add('import jakarta.validation.constraints.NotBlank;')

    if (attr.type === 'Integer' && attr.nullable === false) 
      imports.add('import jakarta.validation.constraints.NotNull;')
  });

  return Array.from(imports).sort().join('\n');

})

Handlebars.registerHelper('isText-type', function (this: any, type: any) {
  const textTypes = [
    'String', 'Text', 'VARCHAR', 'CHAR', 'TEXT', 'CLOB', 'LONGTEXT', 'MEDIUMTEXT', 
    'TINYTEXT', 'NVARCHAR', 'NCHAR', 'NCLOB', 'Character'
  ];
  if (textTypes.includes(type))
    return true
  return false
});

Handlebars.registerHelper('breakEach', function (context, options) {
  let result = '';
  for (let i = 0; i < context.length; i++) {
    result += options.fn(context[i]);
    // Se a condição for atendida, interrompe o loop
    if (context[i].defaultValue) {
      break;
    }
  }
  return result;
});


export { Handlebars };