import * as Handlebars from 'handlebars';

import {
  Attribute, Body,
  ControllerAction,
  DTOConfig,
  HttpHeader,
  JavaAttribute,
  JavaType,
  ModelConfig,
  Relation, SchemaContent,
} from '../interfaces/types';
import {
  DIRECTORIES,
  GENERIC_TYPES, PACKAGES, PROJECT_STRUCTURE_STYLE,
  REQUEST_BODY_NOT_IMPORT,
  REQUEST_MAPPING_OPTIONS,
} from './constants';
import { extractTypeFromList, getPackageNameFromConfig, isResponseCollection, validateAnnotations } from './helpers';
import { capitalize, capitalizeResponse } from './capitalizeStrings';
import { normalizeName } from '../modules/dto/saveDTOConfig';

Handlebars.registerHelper('capitalize', (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
});

Handlebars.registerHelper('capitalizeEntity', (str: string) => {
  return capitalize(str);
});

Handlebars.registerHelper('toCamelCase', (str: string) => {
  if (!str) return '';
  return str.charAt(0).toLowerCase() + str.slice(1);
});

Handlebars.registerHelper('concat', (str1: string, str2: string) => {
  return str1 + str2;
});

Handlebars.registerHelper('toFullCamelCaseFromSnakeCase', (str: string) => {
  if (!str) return '';

  return str
    .toLowerCase()
    .split('_')
    .map((word, index) => (index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join('');
});

Handlebars.registerHelper('toTitleCase', (str: string) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
});

Handlebars.registerHelper('toLowerCase', (str: string) => {
  return (str || '').toLowerCase();
});

Handlebars.registerHelper('toUpperCase', (str: string) => {
  return (str || '').toUpperCase();
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

Handlebars.registerHelper('fullCamelCaseAndPluralize', (str: string) => {
  if(!str) return '';

  const lowerStr = str
    .toLowerCase()
    .split('_')
    .map((word, index) => (index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join('');

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

Handlebars.registerHelper('json', function (context) {
  return JSON.stringify(context);
});

Handlebars.registerHelper('ifNot', function (this: any, conditional: any, options: any) {
  if (!conditional) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

Handlebars.registerHelper('not', function (conditional: any) {
  return !conditional;
});

Handlebars.registerHelper('keyType', function (config: ModelConfig) {
  if (config.primaryKey) {
    return `${config.name}PrimaryKey`;
  }
  const primaryKeyAttr = config.attributes?.find((p) => p.primaryKey === true);
  if (!primaryKeyAttr) {
    return null;
  }

  return GENERIC_TYPES.get(primaryKeyAttr.type)?.java.name;
});

Handlebars.registerHelper('like', function (value, substring) {
  return value && value.includes(substring);
});

/*Handlebars.registerHelper('keyType', function(config: ControllerConfig) {
  const primaryKeyAttr = config.attributes?.find(p => p.primaryKey === true);
  if (!primaryKeyAttr) {
    return null;
  }
  if (primaryKeyAttr.type === 'int') {
    return 'Integer';
  } else if (primaryKeyAttr.type === 'long') {
    return 'Long';
  } else {
    return primaryKeyAttr.type;
  }
});*/

Handlebars.registerHelper('keyType', function (config: DTOConfig) {
  if (!config) {
    return null;
  }
  if (!config.attributes) {
    return null;
  }
  const primaryKeyAttr = config.attributes?.find((p) => p.primaryKey === true);
  if (!primaryKeyAttr) {
    return null;
  }

  const result: JavaType | string = {
    name: GENERIC_TYPES.get(primaryKeyAttr.type)?.java.name ?? '',
    namespace: GENERIC_TYPES.get(primaryKeyAttr.type)?.java.namespace,
  };
  return result.name;
});

Handlebars.registerHelper(
  'ifEquals',
  function (
    this: unknown, // Specify the `this` type
    arg1: any,
    arg2: any,
    options: Handlebars.HelperOptions,
  ): string {
    return arg1 === arg2 ? options.fn(this) : options.inverse(this);
  },
);

/*Handlebars.registerHelper('keyType', function (resourceConfig) {
    return resourceConfig.keyType || 'DefaultType';
});*/

Handlebars.registerHelper('resolveResponse', function (responses?: { [p: string]: Body }): string {
    return capitalizeResponse(responses);
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

    const mod = module ? module.toLowerCase() : DIRECTORIES.SHARED;

    for (const action of actions) {
      if (action.requestBody)
        if (!REQUEST_BODY_NOT_IMPORT.includes(capitalize(action.actionName) + "Request")) {
          const schema = (
            action.requestBody.content['application/json'] ??
            action.requestBody.content['multipart/form-data']
          ).schema;
          if (schema.objectType) {
            if (domainDriven === true)
              imports.push(
                `import ${group}.${packageName}.${mod}.application.dto.${capitalize(normalizeName(schema.type, 'dto')) + 'DTO'};`,
              );
            else
              imports.push(
                `import ${group}.${packageName}.dto.${capitalize(normalizeName(schema.type, 'dto')) + 'DTO'};`,
              );
          } else {
            if (domainDriven === true)
              imports.push(
                `import ${group}.${packageName}.${mod}.application.dto.${capitalize(normalizeName(action.actionName, 'dto')) + 'RequestDTO'};`,
              );
            else
              imports.push(
                `import ${group}.${packageName}.dto.${capitalize(normalizeName(action.actionName, 'dto')) + 'RequestDTO'};`,
              );
          }
        }
      if (action.responses)
        for (const singleBody of Object.values(action.responses)) {
          const type = ((singleBody?.content['application/json'] ?? singleBody?.content['multipart/form-data'])?.schema.objectType)? capitalize((singleBody?.content['application/json'] ?? singleBody?.content['multipart/form-data'])?.schema.type?.replace(/dto$/i, '') + "DTO")
            : (isResponseCollection((singleBody?.content['application/json'] ?? singleBody?.content['multipart/form-data'])?.schema.type))? capitalize((singleBody?.content['application/json'] ?? singleBody?.content['multipart/form-data'])?.schema.items?.type?.replace(/dto$/i, '') + "DTO")
              : capitalize(singleBody?.name.replace(/dto$/i, '') + "DTO")
              || undefined;
          if(!type) return;
          if (domainDriven === true)
              imports.push(`import ${group}.${packageName}.${mod}.application.dto.${type};`);
            else imports.push(`import ${group}.${packageName}.dto.${type};`);
        }
    }

    imports.push(`import java.util.List;`);

    return [...new Set(imports)].join('\n');
  },
);

Handlebars.registerHelper('resolve-annotations', function (attribute) {
  const annotations = [];

  validateAnnotations(attribute);

  // JSON / XML annotations
  if (attribute.jsonAttributeName) {
    annotations.push(`@JsonProperty("${attribute.jsonAttributeName}")`);
  }

  if (attribute.xmlAttributeName) {
    annotations.push(`@JacksonXmlProperty(localName = "${attribute.jsonAttributeName}")`);
  }

  // Required validation
  if (attribute.required) {
    if (attribute.type === 'string') {
      annotations.push(`@NotBlank(message = "The field <${attribute.name}> is required.")`);
    } else {
      annotations.push(`@NotNull(message = "The field <${attribute.name}> is required.")`);
    }
  }

  // String-specific validations
  if (attribute.type === 'string') {
    if(attribute.minLength !== undefined)
      annotations.push(
        `@Size(${[
          `min = ${attribute.minLength}, message = "The field length <${attribute.name}> must be at least ${attribute.minLength} characters."`
        ]
          .filter(Boolean)
          .join(', ')})`,
      );
    if(attribute.maxLength !== undefined)
      annotations.push(
        `@Size(${[
          `max = ${attribute.maxLength}, message = "The field length <${attribute.name}> cannot be more than ${attribute.maxLength} characters."`
        ]
          .filter(Boolean)
          .join(', ')})`,
      );
    if (attribute.regex) {
      annotations.push(
        `@Pattern(message = "Invalid value format for field <${attribute.name}>.", regexp = "${attribute.regex.replace(/\\/g, '\\\\')}")`,
      );
    }
  }

  // Number-specific validations
  if (['Integer', 'Long', 'Double', 'Float', 'BigDecimal', 'BigInteger'].includes(attribute.type)) {
    if (attribute.minLength !== undefined) {
      annotations.push(`@Min(${attribute.minLength})`);
    }
    if (attribute.maxLength !== undefined) {
      annotations.push(`@Max(${attribute.maxLength})`);
    }
    if (attribute.positive) {
      annotations.push(
        attribute.minLength === 0
          ? `@PositiveOrZero(message = "<${attribute.name}> must be greater than or equal to zero.")`
          : `@Positive(message = "<${attribute.name}> must be greater than zero.")`,
      );
    }
  }

  // Date-specific validations
  if (['Date', 'LocalDate', 'LocalDateTime', 'ZonedDateTime'].includes(attribute.type)) {
    if (attribute.before) {
      annotations.push(
        `@Past(message = "The date <${attribute.name}> must be before today's date.")`,
      );
    }
    if (attribute.after) {
      annotations.push(
        `@Future(message = "The date <${attribute.name}> must be after today's date.")`,
      );
    }
  }

  // Email validation
  if (attribute.isEmail) {
    annotations.push(`@Email(message = "Invalid email format for field <${attribute.name}>.")`);
  }

  // URL validation
  if (attribute.isUrl) {
    annotations.push(`@URL(message = "Invalid URL format for field <${attribute.name}>.")`);
  }

  // Return the generated annotations as a joined string
  return annotations.join('\n\t');
});

Handlebars.registerHelper('resolve-package', function (fullPath, basePath) {
  if (!fullPath || !basePath) {
    throw new Error('Both fullPath and basePath are required to resolve the package.');
  }

  // Normalize paths to handle both Unix and Windows formats
  const normalizedFullPath = fullPath.replace(/\\/g, '/');
  const normalizedBasePath = basePath.replace(/\\/g, '/');

  // Ensure the basePath ends with a trailing slash for accurate replacement
  const formattedBasePath = normalizedBasePath.endsWith('/')
    ? normalizedBasePath
    : normalizedBasePath + '/';

  // Remove the basePath portion from the full path
  let relativePath: string;
  if (normalizedFullPath.startsWith(formattedBasePath)) {
    relativePath = normalizedFullPath.slice(formattedBasePath.length);
  } else {
    return '';
  }

  // Extract only the meaningful parts of the path for the Java package
  const packagePath = relativePath
    .split('/')
    .filter((segment) => !['src', 'main', 'test', 'java'].includes(segment)) // Exclude common directory names
    .join('.');

  return packagePath;
});

Handlebars.registerHelper(
  'eq',
  function (this: any, arg1: any, arg2: any, options: Handlebars.HelperOptions) {
    return arg1 === arg2;
  },
);

Handlebars.registerHelper('contains', function (str, substring) {
  return str.includes(substring);
});

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

Handlebars.registerHelper('resolve-imports', function (config: any, baseConfig: any) {

  if (!config) return null;
  if (!baseConfig) return null;
  if (!config.type) return null;
  if (!config.attributes) return null;
  if (!Array.isArray(config.attributes)) return null;

  const api = baseConfig

  const imports = new Set();
  config.attributes.forEach((attr: JavaAttribute) => {

    if(attr.objectType === 'model') {
      if(api.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN)
        imports.add(`import ${getPackageNameFromConfig(api)}.${config.module ?? DIRECTORIES.SHARED}.domain.${PACKAGES.MODELS}.${attr.type};`);
      else
        imports.add(`import ${getPackageNameFromConfig(api)}.${PACKAGES.MODELS}.${attr.type};`);
      return;
    } else if (attr.objectType === 'dto') {
      if(api.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN)
        imports.add(`import ${getPackageNameFromConfig(api)}.${config.module ?? DIRECTORIES.SHARED}.application.${PACKAGES.DTO}.${attr.type};`);
      else
        imports.add(`import ${getPackageNameFromConfig(api)}.${PACKAGES.DTO}.${attr.type};`);
      return;
    } else if (attr.objectType === 'enum') {
      if(api.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN)
        imports.add(`import ${getPackageNameFromConfig(api)}.${DIRECTORIES.SHARED}.application.${PACKAGES.CONSTANTS}.${attr.type};`);
      else
        imports.add(`import ${getPackageNameFromConfig(api)}.${PACKAGES.CONSTANTS}.${attr.type};`);
      return;
    }

    const genType = GENERIC_TYPES.get(attr.type);
    if (genType?.java.primitive) return null;
    const type: JavaType = { name: genType?.java.name ?? '', namespace: genType?.java.namespace };
    if (type.name == '') return null;

    if(type.namespace) {
      imports.add(`import ${type.namespace}.${type.name};`);
    }

    if(attr.type == 'file' || attr.type == 'binary') {
      imports.add(`import org.hibernate.annotations.JdbcType;`);
      imports.add(`import org.hibernate.type.descriptor.jdbc.BinaryJdbcType;`);
    }
  });

  if (config.attributes.filter((it: JavaAttribute) => it.jsonAttributeName).length > 0) {
    imports.add('import com.fasterxml.jackson.annotation.JsonProperty;');
  }

  if (config.attributes.filter((it: JavaAttribute) => it.xmlAttributeName).length > 0) {
    imports.add('import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;');
  }

  config.attributes.filter((it: JavaAttribute) => it.collectionType).forEach((attr: JavaAttribute) => {
    switch (attr.collectionType) {
      case 'list':
        imports.add(`import java.util.List;`);
        break;
      case 'map':
        imports.add(`import java.util.Map;`);
        break;
      case 'set':
        imports.add(`import java.util.Set;`);
        break;
      default:
      // Optionally handle unknown collection types
    }
  })

  return Array.from(imports).sort().join('\n');
});

Handlebars.registerHelper('resolve-type', function (this: any, t1: any) {
  if (!t1.type) return t1.type;

  const attributeType = GENERIC_TYPES.get(t1.type)?.java.name ?? t1.type;

  let rtype: string;
  switch (t1.collectionType) {
    case 'list':
      rtype = `List<${capitalize(attributeType)}>`;
      break;
    case 'set':
      rtype = `Set<${capitalize(attributeType)}>`;
      break;
    case 'map':
      rtype = `Map<Object, ${capitalize(attributeType)}>`; // TODO: handle the key type
      break;
    default:
      rtype = attributeType; // Default type if no collection type matches
  }
  return rtype;
});

Handlebars.registerHelper('model-imports', function (this: any, config: ModelConfig) {
  const imports = new Set();

  config.attributes.filter(that => that.relation).map(it => it.relation!).forEach((relation: Relation) => {
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

Handlebars.registerHelper('cleanStr', function (str) {
  return new Handlebars.SafeString(str);
});

Handlebars.registerHelper('isText-type', function (this: any, type: any) {
  const textTypes = [
    'String',
    'Text',
    'VARCHAR',
    'CHAR',
    'TEXT',
    'CLOB',
    'LONGTEXT',
    'MEDIUMTEXT',
    'TINYTEXT',
    'NVARCHAR',
    'NCHAR',
    'NCLOB',
  ];
  return textTypes.includes(type);
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

Handlebars.registerHelper('or', function (a, b) {
  return a || b;
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
  args.pop(); // Remove the last element, which is the Handlebars options object
  return args.every(Boolean); // Check if all arguments are truthy
});


Handlebars.registerHelper('ne', function (a: any, b: any) {
  return a !== b;
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

Handlebars.registerHelper('sanitizeHeaderName', function (headerName: string) {
  return headerName
    .toLowerCase() // Step 1: Convert all to lowercase
    .replace(/-./g, (match) => match.charAt(1).toUpperCase()); // Step 2: Capitalize letters after hyphens
});

Handlebars.registerHelper('containsCustomHeader', function (headers: HttpHeader[], options) {
  // Check if the headers array contains any header that is not 'Accept' or 'Content-Type'
  return headers.some((header) => header.header !== 'Accept' && header.header !== 'Content-Type');
});

Handlebars.registerHelper('containsContentHeader', function (headers: HttpHeader[], options) {
  // Check if the headers array contains any header that is not 'Accept' or 'Content-Type'
  return headers.some((header) => header.header == 'Accept' || header.header == 'Content-Type');
});

Handlebars.registerHelper('normalizeDto', (str: string) => {
  if (!str) return '';
  if (str == '?') return '?';
  return capitalize(str).replace(/dto$/i, "") + "DTO";
});

Handlebars.registerHelper('containsFormData', (content:  { [p: string]: SchemaContent }): boolean => {
  if (!content) return false;
  return !!content["multipart/form-data"];
});

Handlebars.registerHelper('isRefSchema', (content:  { [p: string]: SchemaContent }): boolean => {
  if (!content) return false;
  const schema = content["application/json"] ?? content["multipart/form-data"];
  return !!schema.schema.objectType;
});

Handlebars.registerHelper('resolve-body', (content:  { [p: string]: SchemaContent }): string => {
  if (!content) return '';
  const schema = content["application/json"] ?? content["multipart/form-data"];
  return capitalize(schema.schema.type);
});

function extractClassNameFromStatusCode(statusCode: string, actionName: string): string {
  if(statusCode === "200")
    return actionName + "Response"
  if(statusCode === "201")
    return actionName + "CreatedResponse"
  if(statusCode === "400")
    return actionName + "BadResponse"
  if(statusCode === "500")
    return actionName + "ErrorResponse"
  if(statusCode === "401")
    return actionName + "UnauthorizedResponse"
  if(statusCode === "403")
    return actionName + "ForbiddenResponse"
  else
    return actionName + statusCode + "Response"
}

export { Handlebars };