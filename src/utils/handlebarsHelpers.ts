import * as Handlebars from 'handlebars';

import {
  Attribute,
  Body,
  ControllerAction,
  HttpHeader,
  JavaAttribute,
  ModelConfig,
  Relation,
  ResponseConfig,
  SchemaContent,
  SchemaField,
} from '../interfaces/types';
import {
  DIRECTORIES,
  GENERIC_IMPORTS,
  GENERIC_TYPES,
  PROJECT_STRUCTURE_STYLE,
  REQUEST_BODY_NOT_IMPORT,
  REQUEST_MAPPING_OPTIONS,
} from './constants';
import { getPackageNameFromConfig, isResponseCollection } from './helpers';
import { capitalizeResponse, wrapCollectionType } from './capitalizeStrings';
import { normalizeName } from '../modules/dto/saveDTOConfig';
import {
  capitalize, capitalizeJavaStyle,
  concat,
  fullCamelCaseAndPluralize,
  lowercaseAndPluralize, sanitizeHeaderName,
  toCamelCase,
  toFullCamelCaseFromSnakeCase,
  toLowerCase,
  toTitleCase,
  toUpperCase, wrapInCurlyBraces,
} from '../helper/stringHelper';
import { json } from '../helper/jsonHelper';
import { equals, ifEquals, ifNot, isPageable, isText, not, notEquals } from '../helper/logicalHelper';
import { keyTypeModel, modelImport } from '../helper/modelHelper';
import { keyTypeDTO } from '../helper/dtoHelper';
import { resolveAnnotations, resolvePackage } from '../helper/generalHelper';
import { resolvePathVariables } from '../helper/controllerHelper';
import { resolveImportReponse } from '../helper/responseHelper';
import { normalizeInterfaceValidatorName, normalizeImplValidatorName } from '../modules/dto/helpers';

// String
Handlebars.registerHelper('capitalize', capitalize);
Handlebars.registerHelper('capitalizeJavaStyle', capitalizeJavaStyle);
Handlebars.registerHelper('toCamelCase', toCamelCase);
Handlebars.registerHelper('concat', concat);
Handlebars.registerHelper('toFullCamelCaseFromSnakeCase', toFullCamelCaseFromSnakeCase);
Handlebars.registerHelper('toTitleCase', toTitleCase);
Handlebars.registerHelper('toLowerCase', toLowerCase);
Handlebars.registerHelper('toUpperCase', toUpperCase);
Handlebars.registerHelper('lowercaseAndPluralize', lowercaseAndPluralize);
Handlebars.registerHelper('fullCamelCaseAndPluralize', fullCamelCaseAndPluralize);
Handlebars.registerHelper('sanitizeHeaderName', sanitizeHeaderName);
Handlebars.registerHelper('wrapInCurlyBraces', wrapInCurlyBraces);
Handlebars.registerHelper('sanitizeHeaderName', sanitizeHeaderName);
Handlebars.registerHelper('cleanStr', function (str) {
  return new Handlebars.SafeString(str);
});




// JSON
Handlebars.registerHelper('json', json);

// LOGICAL
Handlebars.registerHelper('ifNot', ifNot);
Handlebars.registerHelper('not', not);
Handlebars.registerHelper('ifEquals', ifEquals);
Handlebars.registerHelper('ne', notEquals);
Handlebars.registerHelper('eq', equals);
Handlebars.registerHelper('isText-type', isText);
Handlebars.registerHelper('isPageable', isPageable);

// MODEL
Handlebars.registerHelper('keyType', keyTypeModel);
Handlebars.registerHelper('model-imports-helper', modelImport);

// DTO
Handlebars.registerHelper('keyType', keyTypeDTO);

// CONTROLLER
Handlebars.registerHelper('resolve-mapping', resolvePathVariables);

// GENERAL
Handlebars.registerHelper('resolve-package', resolvePackage);
Handlebars.registerHelper('resolve-annotations', resolveAnnotations);

Handlebars.registerHelper('resolveResponse', function (responses?: { [p: string]: Body }): string {
  return capitalizeResponse(responses);
});


//RESPONSE
Handlebars.registerHelper('resolve-imports-response', resolveImportReponse);

Handlebars.registerHelper('resolve-interface-custon-validator-name', function (name: string): string {
  return normalizeInterfaceValidatorName(name);
});

Handlebars.registerHelper('resolve-impl-custon-validator-name', function (name: string): string {
  return normalizeImplValidatorName(name);
});


Handlebars.registerHelper(
  'importsTypes',
  function (
    actions: ControllerAction[],
    group: string,
    packageName: string,
    module: string,
    domainDriven?: boolean,
  ) {
    let imports: string[] = [];

    const moduloAction = module ? module.toLowerCase() : DIRECTORIES.SHARED;

    for (const action of actions) {
      //processing request
      if (action.requestBody)
        if (!REQUEST_BODY_NOT_IMPORT.includes(capitalize(action.actionName) + 'Request')) {
          const schema = (
            action.requestBody.content['application/json'] ??
            action.requestBody.content['multipart/form-data']
          ).schema;


          processImportsTypes(schema, imports, group, packageName, domainDriven);

          if (action.modelAttribute) {
            if (domainDriven) {
              // TODO: Implementar lógica para imports dinamicos dependendo do module.
              /*imports.push(
                `import ${group}.${packageName}.${mod}.application.dto.${capitalize(normalizeName(schema.type, 'dto')) + 'DTO'};`,
              );*/
            } else {
              imports.push(
                `import ${group}.${packageName}.dto.${capitalize(normalizeName(action.modelAttribute.name, 'dto')) + 'DTO'};`,
              );
            }
          }

          //processing response
          if (action.responses)
            for (const response of Object.values(action.responses)) {
              // Get the content for either application/json or multipart/form-data
              const content =
                response?.content['application/json'] || response?.content['multipart/form-data'];
              if (!content) continue;

              // Extract the schema and its properties
              const { schema } = content;

              processImportsTypes(schema, imports, group, packageName, domainDriven, response.name);


            }
        }
    }

    return [...new Set(imports)].join('\n');

  }
);

function processImportsTypes(schema: SchemaField, imports: string[], group: string,
  packageName: string, domainDriven?: boolean, name?: string): string[] {

  const schemaType = schema?.type;
  const objectType = schema?.objectType; // New: to check for type: dto, enum, schema...
  const objModulo = schema?.module || DIRECTORIES.SHARED;
  const collectionType = schema?.collectionType

  const packageSourceName = `${group}.${packageName}`;

  if (collectionType) {
    if (collectionType === 'pageable') {
      imports.push(`import org.springdoc.core.annotations.ParameterObject;`);
      imports.push(`import org.springframework.data.domain.Pageable;`);
    }

    const genericImports = GENERIC_IMPORTS(packageSourceName, schemaType);
    const collectionTypeImport = genericImports.get(collectionType);

    const importValue = collectionTypeImport?.java?.technical;

    if (importValue) {
      imports.push(importValue);
    }
  }

  if (schemaType != 'object' && objectType) {

    const genericImports = GENERIC_IMPORTS(packageSourceName, schemaType, objModulo);
    const importD = genericImports.get(objectType);

    const importValue = domainDriven
      ? importD?.java?.domain
      : importD?.java?.technical;

    if (importValue) {
      imports.push(importValue);
    }
  }

  //type object its only implemented in response
  if (schemaType === 'object' && name) {

    const responseName = capitalize(name || '');

    const genericImports = GENERIC_IMPORTS(packageSourceName, responseName, objModulo);
    const importD = genericImports.get('dto');

    const importValue = domainDriven
      ? importD?.java?.domain
      : importD?.java?.technical;

    if (importValue) {
      imports.push(importValue);
    }
  }

  return imports;
}

Handlebars.registerHelper(
  'eq',
  function (this: any, arg1: any, arg2: any, options: Handlebars.HelperOptions) {
    return arg1 === arg2;
  },
);

Handlebars.registerHelper('paramsFormat', function (str) {
  return `{${str}}`;
});

Handlebars.registerHelper('resolve-mapping', function (this: any, action: ControllerAction) {
  let pathVariable = '';
  if (action.path) {
    if (action.pathVariables) {
      action.pathVariables.forEach((path) => {
        pathVariable = pathVariable.concat(`=/{${path.name}}`);
      });

      return pathVariable;
    }
  }
});

Handlebars.registerHelper('resolve-imports-handlers-ddd', function (response: { [p: string]: Body }, baseConfig: any) {

  if (!response) {
    return null;
  }
  if (!baseConfig) return null;
  //console.log('responses: ', response)
  const singleBody = response[Object.keys(response)[0]];
  const content = singleBody?.content['application/json'] ?? singleBody?.content['multipart/form-data'];

  if (!content) {
    return null;
  }

  const schema = content?.schema;

  let imports: string[] = [];

  let name;

  if (schema.type === 'object') {
    name = singleBody.name;
  }

  processImportsTypes(schema, imports, baseConfig.group, baseConfig.packageName, true, name)

  return [...new Set(imports)].join('\n');

});




//
Handlebars.registerHelper('resolve-imports', function (config: any, baseConfig: any) {
  if (!config) return null;
  if (!baseConfig) return null;
  if (!config.type) return null;
  if (!config.attributes) return null;
  if (!Array.isArray(config.attributes)) return null;

  //console.log('resourceConfig:: ', config)

  const isDDDStyle =
    baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN;

  const imports = new Set();

  const packageNameFromConfig = getPackageNameFromConfig(baseConfig);

  for (const attr of config.attributes) {
    const objectImports = GENERIC_IMPORTS(packageNameFromConfig, attr.type, attr.module).get(
      attr.objectType,
    );

    if (objectImports) {
      imports.add(isDDDStyle ? objectImports.java.domain : objectImports.java.technical);
      continue;
    }

    const genType = GENERIC_TYPES.get(attr.type);

    if (genType?.java.namespace) {
      imports.add(`import ${genType?.java.namespace}.${genType?.java.name};`);
    }

    const specialAttributeImports = GENERIC_IMPORTS(packageNameFromConfig, attr.type).get(
      attr.type,
    );

    if (specialAttributeImports) imports.add(specialAttributeImports.java.technical);
  }

  if (config.attributes.find((it: JavaAttribute) => it.jsonAttributeName))
    imports.add(
      GENERIC_IMPORTS(packageNameFromConfig, 'jsonProperty').get('jsonProperty')?.java.technical,
    );

  if (config.attributes.find((it: JavaAttribute) => it.xmlAttributeName))
    imports.add(
      GENERIC_IMPORTS(packageNameFromConfig, 'xmlProperty').get('xmlProperty')?.java.technical,
    );

  // Import Collection Types
  config.attributes
    .filter((it: JavaAttribute) => it.collectionType)
    .forEach(
      (attr: JavaAttribute) =>
        imports.add(GENERIC_IMPORTS(packageNameFromConfig, attr.collectionType!).get(attr.collectionType!)?.java.technical));


  return Array.from(imports)
    .filter((e) => e)
    .sort()
    .join('\n');
});

Handlebars.registerHelper('resolve-type', function (this: any, t1: any) {
  if (!t1.type) return t1.type;

  const attributeType =
    GENERIC_TYPES.get(t1.type)?.java.name ??
    (t1.objectType === 'dto' ? normalizeName(t1.type, 'dto') + 'DTO' : t1.type);

  let rtype: string;

  rtype = wrapCollectionType(attributeType, t1.collectionType);
  /*switch (t1.collectionType) {
    case 'collection':
      return `Collection<${attributeType}>`
    case 'map':
      return `Map<?, ${attributeType}>`
    case 'pageable':
      return `Page<${attributeType}>`
    default:
      rtype = attributeType;
  }*/

  return rtype;
});

Handlebars.registerHelper('model-imports', function (this: any, config: ModelConfig) {
  const imports = new Set();

  config.attributes
    .filter((that) => that.relation)
    .map((it) => it.relation!)
    .forEach((relation: Relation) => {
      if (relation.type !== 'ManyToOne' && relation.type !== 'OneToOne')
        imports.add('import java.util.List;');
    });

  config.attributes.forEach((attr: Attribute) => {
    if (attr.type === 'String' && attr.nullable === false)
      imports.add('import jakarta.validation.constraints.NotBlank;');

    if (attr.type === 'Integer' && attr.nullable === false)
      imports.add('import jakarta.validation.constraints.NotNull;');

    if (attr.type === 'UUID') imports.add('import java.util.UUID;');

    if (attr.skipFieldRevision) imports.add('import org.hibernate.envers.NotAudited;');
  });

  return Array.from(imports).sort().join('\n');
});

Handlebars.registerHelper('import-uuid', function (this: any, config: ModelConfig) {
  const imports = new Set();
  const uuid = config.attributes.find((attr) => attr.type.toLowerCase() === 'uuid');
  if (uuid) imports.add('import java.util.UUID;');
  return Array.from(imports).sort().join('\n');
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

/*.registerHelper('or', function (a, b) {
  return a || b;
});*/

Handlebars.registerHelper('or', function (...args) {
  const options = args.pop(); // Remove o último argumento (objeto de opções do Handlebars)

  // Verifica se algum dos argumentos é verdadeiro
  return args.some(Boolean);
});

Handlebars.registerHelper('filterCommandActions', function (array: ControllerAction[], options) {
  if (!array || !Array.isArray(array)) {
    throw new Error('Expected an array for filtering');
  }
  const filteredArray = array.filter((item) => item.method !== 'GET');
  return filteredArray
    .map((item, index) => {
      const context = {
        ...item,
        '@index': index,
        '@last': index === filteredArray.length - 1,
      };

      const rendered = options.fn(context);
      // Append a comma if it's not the last element
      return rendered + (index === filteredArray.length - 1 ? '' : ',\n\t\t');
    })
    .join('');
});

Handlebars.registerHelper('filterQueryActions', function (array: ControllerAction[], options) {
  if (!array || !Array.isArray(array)) {
    throw new Error('Expected an array for filtering');
  }
  const filteredArray = array.filter((item) => item.method === 'GET');
  return filteredArray
    .map((item, index) => {
      const context = {
        ...item,
        '@index': index,
        '@last': index === filteredArray.length - 1,
      };
      const rendered = options.fn(context);
      // Append a comma if it's not the last element
      return rendered + (index === filteredArray.length - 1 ? '' : ',\n\t\t');
    })
    .join('');
});

Handlebars.registerHelper('and', function (...args) {
  args.pop();
  return args.every(Boolean);
});

Handlebars.registerHelper('formatAttribute', function (value) {
  // TODO : 09-12-2024 - 16:55 - handle non-string values

  if (typeof value === 'string') {
    return `"${value}"`; // If it's a string, wrap it in quotes
  } else if (typeof value === 'number') {
    return value.toString(); // If it's a number, return it without quotes
  } else if (Array.isArray(value)) {
    // If it's an array, join all its elements into a string
    return `"${value.join('')}"`; // Join array elements into a string and wrap in quotes
  } else if (value && typeof value === 'object') {
    // If it's an object, check if it's a "character map" (e.g., { "0": "H", "1": "i", "2": "g" })
    if (Object.values(value).every((val) => typeof val === 'string')) {
      return `"${Object.values(value).join('')}"`; // Join characters and return as a single string
    }
    return JSON.stringify(value); // Otherwise, return the object as a string
  } else {
    return value.toString(); // Return the value as-is if it doesn't match the above types
  }
});

Handlebars.registerHelper('mapHeaderToOption', function (config: HttpHeader): string {
  // Check if the header exists in the map and return the corresponding option
  return REQUEST_MAPPING_OPTIONS[config.header] || null;
});

Handlebars.registerHelper('containsCustomHeader', function (headers: HttpHeader[]) {
  // Check if the headers array contains any header that is not 'Accept' or 'Content-Type'
  return headers.some((header) => header.header !== 'Accept' && header.header !== 'Content-Type');
});

Handlebars.registerHelper('containsContentHeader', function (headers: HttpHeader[]) {
  // Check if the headers array contains any header that is not 'Accept' or 'Content-Type'
  return headers.some((header) => header.header == 'Accept' || header.header == 'Content-Type');
});

Handlebars.registerHelper('normalizeDto', (str: string) => {
  if (!str) return '';
  if (str == '?') return '?';
  return capitalize(str).replace(/dto$/i, '') + 'DTO';
});

Handlebars.registerHelper('processImplementation', (type: string) => {
  let primitiveTypes: string[] = ['integer', 'boolean', 'string'];

  if (primitiveTypes.includes(type)) {
    return capitalize(type);
  } else if (type == 'object') return 'object';
  else {
    return normalizeName(type, 'dto') + 'DTO';
  }
});

Handlebars.registerHelper('processDocumentationType', (type: string, objType?: string) => {
  let primitiveTypes: string[] = ['integer', 'boolean', 'string'];

  if (objType === 'dto') return 'object';

  if (primitiveTypes.includes(type)) {
    return capitalize(type);
  } else if (type === 'object' && (!objType || objType.trim() === '')) return 'object';
  else {
    return normalizeName(type, 'dto') + 'DTO';
  }
});

Handlebars.registerHelper(
  'containsFormData',
  (content: { [p: string]: SchemaContent }): boolean => {
    if (!content) return false;
    return !!content['multipart/form-data'];
  },
);

Handlebars.registerHelper('isRefSchema', (content: { [p: string]: SchemaContent }): boolean => {
  if (!content) return false;
  const schema = content['application/json'] ?? content['multipart/form-data'];
  return !!schema.schema.objectType;
});

Handlebars.registerHelper('resolve-body', (content: { [p: string]: SchemaContent }): string => {
  if (!content) return '';
  const schema = content['application/json'] ?? content['multipart/form-data'];
  return normalizeName(capitalize(schema.schema.type), 'dto') + 'DTO';
});

Handlebars.registerHelper('addPropPageable', function (context): boolean {
  let isPageable = false;

  const response = context?.response;
  const type = context?.type;

  const isPageType = (str: string): boolean => {
    const regex = /^Page<.*>$/;
    return regex.test(str);
  };

  if (isPageType(response) && type === 'query') {
    isPageable = true;
  }

  return isPageable;
});

export { Handlebars };
