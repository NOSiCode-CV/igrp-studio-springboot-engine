import * as Handlebars from 'handlebars';

import {
  Attribute,
  ControllerAction,
  DTOConfig,
  JavaAttribute,
  JavaType,
  ModelConfig,
  Relation,
} from '../interfaces/types';
import { DIRECTORIES, GENERIC_TYPES, REQUEST_BODY_NOT_IMPORT } from './constants';
import { extractTypeFromList, validateAnnotations } from './helpers';

Handlebars.registerHelper('capitalize', (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
});

Handlebars.registerHelper('toCamelCase', (str: string) => {
  if (!str) return '';
  return str.charAt(0).toLowerCase() + str.slice(1);
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
  if (primaryKeyAttr.type === 'int') {
    return 'Integer';
  } else if (primaryKeyAttr.type === 'long') {
    return 'Long';
  } else {
    const result: JavaType | string = primaryKeyAttr.type;
    return result;
  }
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

    console.log('Module: ', module);

    const mod = module ? module.toLowerCase() : DIRECTORIES.SHARED;

    for (const action of actions) {
      if (action.requestBody)
        if (!REQUEST_BODY_NOT_IMPORT.includes(action.requestBody))
          if (domainDriven === true)
            imports.push(
              `import ${group}.${packageName}.${mod}.application.dto.${action.requestBody};`,
            );
          else imports.push(`import ${group}.${packageName}.${mod}.dto.${action.requestBody};`);
      if (action.response)
        if (extractTypeFromList(action.response)) {
          const type = extractTypeFromList(action.response);
          if (domainDriven === true)
            imports.push(`import ${group}.${packageName}.${mod}.application.dto.${type};`);
          else imports.push(`import ${group}.${packageName}.${mod}.dto.${type};`);
        }
      if (action.response.startsWith('List')) imports.push(`import java.util.List;`);
    }

    return [...new Set(imports)].join('\n');
  },
);

Handlebars.registerHelper('resolve-annotations', function (attribute) {
  const annotations = [];

  validateAnnotations(attribute);

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
    if (attribute.minLength !== undefined || attribute.maxLength !== undefined) {
      annotations.push(
        `@Size(${[
          attribute.minLength !== undefined
            ? `min = ${attribute.minLength}, message = "The field length <${attribute.name}> must be at least ${attribute.minLength} characteres."`
            : '',
          attribute.maxLength !== undefined
            ? `max = ${attribute.maxLength}, message = "The field length <${attribute.name}> cannot be more than ${attribute.maxLength} characteres."`
            : '',
        ]
          .filter(Boolean)
          .join(', ')})`,
      );
    }
    if (attribute.regex) {
      annotations.push(
        `@Pattern(message = "Invalid value format for field <${attribute.name}>.", regexp = "${attribute.regex}")`,
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

  // Custom pattern validation
  if (attribute.regex && !['String', 'Number', 'Date'].includes(attribute.type)) {
    annotations.push(
      `@Pattern(message = "Invalid format for field <${attribute.name}>.", regexp = "${attribute.regex}")`,
    );
  }

  // Return the generated annotations as a joined string
  return annotations.join('\n  ');
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

Handlebars.registerHelper('resolve-imports', function (config: any) {
  if (!config) return null;
  if (!config.type) return null;
  if (!config.attributes) return null;
  if (!Array.isArray(config.attributes)) return;

  const imports = new Set();
  config.attributes.forEach((attr: JavaAttribute) => {
    if (typeof attr.type === 'string') return;
    const type: JavaType = attr.type;
    if (type.namespace) {
      if (type.namespace.includes('models'))
        imports.add(`import ${type.namespace}.${type.name}.${type.name};`);
      else imports.add(`import ${type.namespace}.${type.name};`);
    }
    if (attr.isList) imports.add(`import java.util.List;`);
  });

  return Array.from(imports).sort().join('\n');
});

Handlebars.registerHelper('resolve-type', function (this: any, t1: any) {
  if (!t1.type) return t1.type;

  const attributeType = GENERIC_TYPES.get(t1.type)?.java.name
  let rtype = attributeType;
  if (t1.isList) {
    rtype = `List<${attributeType}>`;
  }
  return rtype;
});

Handlebars.registerHelper('model-imports', function (this: any, config: ModelConfig) {
  const imports = new Set();

  if (config.relations) {
    config.relations.forEach((relation: Relation) => {
      if (relation.relationType !== 'ManyToOne' && relation.relationType !== 'OneToOne')
        imports.add('import java.util.List;');
    });
  }

  config.attributes.forEach((attr: Attribute) => {
    if (attr.type === 'String' && attr.nullable === false)
      imports.add('import jakarta.validation.constraints.NotBlank;');

    if (attr.type === 'Integer' && attr.nullable === false)
      imports.add('import jakarta.validation.constraints.NotNull;');

    if (attr.type === 'UUID') imports.add('import java.util.UUID;');
  });

  return Array.from(imports).sort().join('\n');
});

Handlebars.registerHelper('import-uuid', function (this: any, config: ModelConfig) {
  const imports = new Set();
  const uuid = config.attributes.find((attr) => attr.type === 'UUID');
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

export { Handlebars };