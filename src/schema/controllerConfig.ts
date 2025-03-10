import {
  GENERATION_TYPES,
  HTTP_METHOD_TYPES,
  PARAMS_TYPES,
  PATTERNS,
  HTTP_HEADER_TYPES, SCHEMA_TYPES, RELATIONSHIP_TYPES,
} from '../utils/constants';
import { ajvInstance } from '../utils/ajv-instance';
import { JSONSchemaType, ValidateFunction } from 'ajv';
import {
  Attribute, BaseBody,
  Body,
  ControllerAction,
  ControllerConfig,
  HttpHeader, PropertySchemaField, Relation,
  RequestParams,
  SchemaContent, SchemaEnum,
  SchemaField,
} from '../interfaces/types';

const relationSchema: JSONSchemaType<Relation> = {
  type: "object",
  properties: {
    type: {
      type: "string",
      enum: RELATIONSHIP_TYPES,
      errorMessage: `The relationType must be one of ${RELATIONSHIP_TYPES} and cannot be empty.`
    },
    entity: {
      type: "string",
      pattern: PATTERNS.NO_SPACE_AND_HYPHEN,
      errorMessage: 'The entity name is required and cannot be empty.'
    },
    fieldName: {
      type: "string",
      nullable: true,
      pattern: PATTERNS.PARAMS_VALIDATION,
      errorMessage: 'The fieldName field, if provided, cannot contain spaces, hyphens, or special characters. Only alphanumeric characters are allowed.'
    },
    mappedBy: {
      type: "string",
      nullable: true,
      pattern: PATTERNS.RELATIONS_PATTERN,
      errorMessage: 'The mappedBy field, if provided, must be a valid string following the naming convention.'
    },
    referencedColumnName: {
      type: "string",
      nullable: true,
      pattern: PATTERNS.RELATIONS_PATTERN,
      errorMessage: 'The referencedColumnName field, if provided, must be a valid string following the naming convention.'
    },
    cardinality: {
      type: 'string',
      enum: ['oneWay', 'twoWay'],
      errorMessage: `The cardinality must be one of 'oneWay' or 'twoWay' and cannot be empty.`
    },
    joinTable: {
      type: "string",
      nullable: true,
      pattern: PATTERNS.RELATIONS_PATTERN,
      errorMessage: 'The joinTable field, if provided, must be a valid string following the naming convention.'
    },
    inverseJoinColumn: {
      type: "string",
      nullable: true,
      pattern: PATTERNS.RELATIONS_PATTERN,
      errorMessage: 'The inverseJoinColumn field, if provided, must be a valid string following the naming convention.'
    }
  },
  required: ["type", "entity"],
  additionalProperties: false,
  errorMessage: {
    required: {
      relationType: 'The relationType is required and cannot be empty.',
      entity: 'The entity is required and cannot be empty.'
    },
    additionalProperties: 'No additional properties are allowed in the relation schema.'
  }
};

/**
 * JSON schema for validating the SchemaField interface.
 */

const schemaField: JSONSchemaType<SchemaField> = {
  type: "object",
  properties: {
    type: {
      type: "string",
      nullable: false,
      errorMessage: "The 'type' field is required and must be a string.",
    },
    objectType: {
      type: "string",
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      nullable: true,
      errorMessage: "The attribute 'objectType' must contain only alphabetic characters and cannot contain spaces or special characters.",
    },
    required: {
      type: "boolean",
      nullable: true,
      errorMessage: "The 'required' field, if provided, must be a boolean.",
    },
    identifier: {
      type: "boolean",
      nullable: true,
      errorMessage: "The 'identifier' field, if provided, must be a boolean.",
    },
    description: {
      type: "string",
      nullable: true,
      errorMessage: "The 'description' field, if provided, must be a string.",
    },
    example: {
      type: "object",
      nullable: true,
      additionalProperties: true,
      errorMessage: "The 'example' field can be any type.",
    },
    deprecated: {
      type: "boolean",
      nullable: true,
      errorMessage: "The 'deprecated' field, if provided, must be a boolean.",
    },
    items: {
      type: "object",
      required: ["type"],
      nullable: true,
      anyOf: [
        { $ref: "#" }, // reference to the definition
        { type: "null" },
      ],
      errorMessage: "Invalid property items.",
    },
    properties: {
      type: "object",
      required: [],
      nullable: true,
      additionalProperties: {
        type: "object",
        required: [],
        nullable: true,
        anyOf: [
          { type: "object" }, // For dynamic content types
        ],
      },
      errorMessage: "The 'properties' field must be an object with PropertySchemaField values.",
    },
    collectionType: {
      type: "string",
      nullable: true,
      errorMessage: "The 'collectionType' field when provided must be one of [none, collection, map, pageable]",
    },
  },
  required: ["type"],
  additionalProperties: false,
};


/**
 * JSON schema for validating the SchemaEnum interface.
 */
const schemaEnum: JSONSchemaType<SchemaEnum> = {
  type: "object",
  properties: {
    name: {
      type: "string",
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      nullable: true,
      errorMessage: "The attribute $ref must contain only alphabetic characters and cannot contain spaces or special characters.",
    },
    values: {
      type: "array",
      items: { type: "string" },
      nullable: true,
      errorMessage: "The 'enum' field, if provided, must be an array of strings.",
    },
  },
  additionalProperties: false,
};

/**
 * JSON schema for validating the PropertySchemaField interface.
 */
const propertySchemaField: JSONSchemaType<PropertySchemaField> = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      nullable: false,
      errorMessage: "The 'type' field is required and must be a string.",
    },
    objectType: {
      type: 'string',
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      nullable: true,
      errorMessage:
        'The attribute $ref must contain only alphabetic characters and cannot contain spaces or special characters.',
    },
    required: {
      type: 'boolean',
      nullable: true,
      errorMessage: "The 'required' field, if provided, must be a boolean.",
    },
    identifier: {
      type: 'boolean',
      nullable: true,
      errorMessage: "The 'identifier' field, if provided, must be a boolean.",
    },
    description: {
      type: 'string',
      nullable: true,
      errorMessage: "The 'description' field, if provided, must be a string.",
    },
    example: {
      type: 'object',
      nullable: true,
      additionalProperties: true,
      errorMessage: "The 'example' field can be any type.",
    },
    deprecated: {
      type: 'boolean',
      nullable: true,
      errorMessage: "The 'deprecated' field, if provided, must be a boolean.",
    },
    minimum: {
      type: 'number',
      nullable: true,
      errorMessage: "The 'minimum' field, if provided, must be a number.",
    },
    maximum: {
      type: 'number',
      nullable: true,
      errorMessage: "The 'maximum' field, if provided, must be a number.",
    },
    pattern: {
      type: 'string',
      nullable: true,
      errorMessage: "The 'pattern' field, if provided, must be a string.",
    },
    format: {
      type: 'string',
      nullable: true,
      errorMessage: "The 'format' field, if provided, must be a string.",
    },
    enum: {
      oneOf: [ schemaEnum ],
      nullable: true,
      errorMessage: "The 'enum' field, if provided, must be an array of SchemaEnum.",
    },
    default: {
      type: 'object',
      nullable: true,
      additionalProperties: true,
      errorMessage: "The 'default' field can be any type.",
    },
    items: {
      type: 'object',
      required: ['type'],
      nullable: true,
      anyOf: [
        { $ref: '#' }, // reference to the definition
        { type: 'null' },
      ],
      errorMessage: "Invalid property's items."
    },
    properties: {
      type: 'object',
      required: [],
      nullable: true,
      additionalProperties: {
        type: 'object',
        required: [],
        nullable: true,
        anyOf: [
          { type: 'object' }, // For dynamic content types
        ],
      },
      errorMessage: "The 'properties' field must be an object with SchemaField values.",
    },
    collectionType: {
      type: "string",
      nullable: true,
      errorMessage: "The 'collectionType' field when provided must be one of [none, collection, map, pageable]",
    },
  },
  required: ['type'],
  additionalProperties: false,
};

/**
 * JSON schema for validating the ResponseSchemaContent interface.
 */
const responseSchemaContent: JSONSchemaType<SchemaContent> = {
  type: "object",
  properties: {
    schema: {
      anyOf: [
        schemaField
      ]
    },
  },
  required: ["schema"],
  additionalProperties: false,
};

/**
 * JSON schema for validating the Body interface.
 */
const bodySchema: JSONSchemaType<Body> = {
  type: "object",
  properties: {
    id: {
      type: "string",
      nullable: true,
      errorMessage: 'The id if provided must be a string.'
    },
    description: {
      type: "string",
      nullable: true,
      errorMessage: "The 'description' field, if provided, must be a string.",
    },
    name: {
      type: "string",
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      nullable: false,
      errorMessage: "The attribute name must contain only alphabetic characters and cannot contain spaces or special characters.",
    },
    module: {
      type: "string",
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      nullable: true,
      errorMessage: "The module name must follow the naming convention (only alphabetic characters allowed) and cannot be empty.",
    },
    content: {
      type: "object",
      required: [],
      nullable: false,
      additionalProperties: {
        type: "object",
        errorMessage: "Content fields are invalid",
        required: [],
        nullable: true,
        anyOf: [
          { type: "object" }, // For dynamic content types
        ],
      },
      errorMessage: "The 'content' field must be an object mapping content types to schemas.",
    },
  },
  required: ["content", "name"],
  additionalProperties: false
};

const baseBodySchema: JSONSchemaType<BaseBody> = {
  type: "object",
  properties: {
    id: {
      type: "string",
      nullable: true,
      errorMessage: 'The id if provided must be a string.'
    },
    content: {
      type: "object",
      required: [],
      nullable: false,
      additionalProperties: {
        type: "object",
        errorMessage: "Content fields are invalid",
        required: [],
        nullable: true,
        anyOf: [
          { type: "object" }, // For dynamic content types
        ],
      },
      errorMessage: "The 'content' field must be an object mapping content types to schemas.",
    },
  },
  required: ["content"],
  additionalProperties: false
};

const pathParamsSchema: JSONSchemaType<RequestParams> = {
  type: 'object',
  properties: {
    type: { 
      type: 'string', 
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      enum: PARAMS_TYPES,
      errorMessage: `Param type not valid. It must be one of ${PARAMS_TYPES}`
    },
    name: { 
      type: 'string', pattern: PATTERNS.PARAMS_VALIDATION,
      errorMessage: 'The param name attribute must not be empty and cannot contain spaces, hyphens, or special characters. Only alphanumeric characters are allowed'
    },
    value: {
      type: 'string', pattern: PATTERNS.PARAMS_VALIDATION,
      nullable: true,
      errorMessage: 'The param value attribute must not be empty and cannot contain spaces, hyphens, or special characters. Only alphanumeric characters are allowed'
    },
    isRequired: {
      type: 'boolean',
      errorMessage: 'The param isRequired must be present and holds values true|false only'
    },
  },
  required: ['type', 'name', 'isRequired'],
  additionalProperties: false,
  errorMessage: {
    required: {
      type: 'The param type is required and must not be empty.',
      name: 'The param name is required and must not be empty.',
      isRequired: 'The obligation of the param must be present.'
    }
  }
};

const headersSchema: JSONSchemaType<HttpHeader> = {
  type: 'object',
  properties: {
    type: {
      type: "string",
      enum: PARAMS_TYPES,
      errorMessage: `The type, if provided, must be one of ${PARAMS_TYPES}`
    },
    header: {
      type: "string",
      enum: HTTP_HEADER_TYPES,
      errorMessage: `The header, if provided, must be one of ${HTTP_HEADER_TYPES}`
    },
    value: {
      type: 'string', pattern: PATTERNS.NOT_EMPTY,
      errorMessage: 'The value attribute must not be empty.'
    },
    isRequired: {
      type: 'boolean',
      errorMessage: 'The param isRequired must be present and holds values true|false only'
    },
  },
  required: ['header', 'value', 'isRequired'],
  additionalProperties: false,
  errorMessage: {
    required: {
      header: 'The param header is required and must not be empty.',
      value: 'The param value is required and must not be empty.',
      isRequired: 'The obligation of the param must be present.'
    }
  }
};

const attributeSchema: JSONSchemaType<Attribute> = {
  type: "object",
  properties: {
    type: {
      type: "string",
      enum: SCHEMA_TYPES,
      errorMessage: `The attribute type must be one of ${SCHEMA_TYPES} and cannot be empty.`
    },
    name: {
      type: "string",
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage: 'The attribute name must contain only alphabetic characters and cannot contain spaces or special characters.'
    },
    length: {
      type: "number",
      nullable: true,
      errorMessage: 'The attribute length must contain only numeric characters and cannot contain spaces or special characters.'
    },
    unique: {
      type: "boolean",
      nullable: true,
      errorMessage: 'The unique attribute must be a boolean value if provided.'
    },
    skipFieldRevision: {
      type: "boolean",
      nullable: true,
      errorMessage: 'The skip field revision attribute must be a boolean value if provided.'
    },
    nullable: {
      type: "boolean",
      nullable: true,
      errorMessage: 'The notNull attribute must be a boolean value if provided.'
    },
    defaultValue: {
      type: "string",
      nullable: true,
      errorMessage: 'The defaultValue, if provided, must be a valid string.'
    },
    generationType: {
      type: "string",
      nullable: true,
      enum: GENERATION_TYPES,
      errorMessage: `The generation type, if provided, must be one of ${GENERATION_TYPES}`
    },
    primaryKey: {
      type: "boolean",
      nullable: true,
      errorMessage: 'The primary key, if provided, must be a valid boolean.'
    },
    objectType: {
      type: "string",
      nullable: true,
      errorMessage: 'The objectType, if provided, must be a valid string.'
    },
    relation: {
      type: "object",
      nullable: true,
      oneOf: [
        relationSchema
      ],
      errorMessage: 'The relation, if provided, must be a valid relationship definition.'
    },
    module: {
      type: "string",
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage: 'The module name must follow the naming convention (only alphabetic characters allowed) and cannot be empty.',
      nullable: true
    },
  },
  required: ["type", "name"],
  additionalProperties: false,
  errorMessage: {
    required: {
      type: 'The attribute type is required.',
      name: 'The attribute name is required.'
    },
    additionalProperties: 'No additional properties are allowed in the attribute schema.'
  }
};

const controllerActionSchema: JSONSchemaType<ControllerAction> = {
  type: 'object',
  properties: {
    path: {
      type: 'string',
      pattern: PATTERNS.PATH_PATTERN,
      nullable: true,
      errorMessage: 'The path attribute must only contain characters without spaces or special characters.',
    },
    actionName: {
      type: 'string',
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage: 'The actionName attribute can only contain characters without spaces or special characters.',
    },
    method: {
      type: 'string',
      enum: HTTP_METHOD_TYPES,
      errorMessage: `Method type can only be one of ${HTTP_METHOD_TYPES}.`,
    },
    modelAttribute: {
      type: 'string',
      pattern: PATTERNS.RELATIONS_PATTERN,
      nullable: true,
      errorMessage: 'The modelAttribute can only contain characters without spaces or special characters.',
    },
    requestParams: {
      type: 'array',
      items: pathParamsSchema,
      nullable: true,
      errorMessage: 'Request params can only contain characters without spaces or special characters.',
    },
    pathVariables: {
      type: 'array',
      items: pathParamsSchema,
      nullable: true,
      errorMessage: 'Path variables can only contain characters without spaces or special characters.',
    },
    headers: {
      type: 'array',
      items: headersSchema,
      nullable: true,
      errorMessage: 'Headers can only contain characters without spaces or special characters.',
    },
    multipartFiles: {
      type: 'array',
      items: pathParamsSchema,
      nullable: true,
      errorMessage: 'Multipart files can only contain characters without spaces or special characters.',
    },
    permissions: {
      type: 'array',
      items: { type: 'string' },
      nullable: true,
      errorMessage: "The 'permissions' field must be a string array if provided.",
    },
    requestBody: {
      type: "object",
      anyOf: [
        baseBodySchema
      ],
      nullable: true,
      errorMessage: "The 'requestBody' field must be a valid Body.",
    },
    responses: {
      type: 'object',
      nullable: true,
      patternProperties: {
        '^\\d{3}$': bodySchema, // Status codes (e.g., "200", "404", "500") as keys
      },
      required: [],
      errorMessage: "The 'responses' field must map string status codes to valid Body objects.",
    },
  },
  required: ['actionName', 'method'],
  additionalProperties: false,
  errorMessage: {
    required: {
      actionName: 'ActionName is required.',
      method: 'Method is required.',
    },
  },
};

const controllerSchema: JSONSchemaType<ControllerConfig> = {
  type: 'object',
  properties: {
    id: {
      type: "string",
      nullable: true,
      errorMessage: 'The id if provided must be a string.'
    },
    type: { 
      type: 'string', 
      const: 'controller',
      errorMessage: `The type must be 'controller'.`
    },
    name: { 
      type: 'string', 
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage: 'The name attribute must not be empty and can only contain alphanumeric characters without spaces or special characters.'
    },
    module: {
      type: 'string',
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      nullable: true,
      errorMessage: 'The module attribute must not be empty and can only contain alphanumeric characters without spaces or special characters.'
    },
    basePath: { 
      type: 'string',
      pattern: PATTERNS.PATH_SLASH_VALIDATION_PATTERN,
      errorMessage: 'The basePath attribute can only contain alphanumeric characters and slash, without spaces or other special characters.'
    },
    actions: { 
      type: 'array',
      items: controllerActionSchema,
      errorMessage: 'The actions array must contain valid controller actions.'
    },
    attributes: {
      type: "array",
      items: attributeSchema,
      errorMessage: 'The attributes must be an array of valid attribute definitions.',
      nullable: true
    }
  },
  required: ['type', 'name', 'basePath', 'actions'],
  additionalProperties: false,
  errorMessage: {
    required: {
      type: 'The type attribute is required and must not be empty.',
      name: 'The name attribute is required and must not be empty.',
      basePath: 'The basePath attribute is required and must not be empty.',
      actions: 'At least one action is required.'
    },
    additionalProperties: 'No additional properties are allowed in the controller schema.'
  }
};

export const debugSchema = (data: ControllerConfig) => {
  const valid = validateController(data);
  if (!valid) {
    validateController.errors!.forEach(error => {
      console.log(`Error at ${error.instancePath}: ${error.message}`);
      console.log(`Schema path: ${error.schemaPath}`);
    });
  } else {
    console.log("Valid schema");
  }

}

export const validateController: ValidateFunction<ControllerConfig> =
  ajvInstance.compile<ControllerConfig>(controllerSchema);