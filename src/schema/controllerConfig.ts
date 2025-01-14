import {
  GENERIC_ATTRIBUTE_TYPES, GENERATION_TYPES,
  HTTP_METHOD_TYPES,
  PARAMS_TYPES,
  PATTERNS,
  HTTP_HEADER_TYPES,
} from '../utils/constants';
import { ajvInstance } from '../utils/ajv-instance';
import { JSONSchemaType, ValidateFunction } from 'ajv';
import {
  Attribute, BaseBody,
  Body,
  ControllerAction,
  ControllerConfig,
  HttpHeader,
  RequestParams,
  SchemaContent,
  SchemaField,
} from '../interfaces/types';

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
    $ref: {
      type: "string",
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      nullable: true,
      errorMessage: "The attribute $ref must contain only alphabetic characters and cannot contain spaces or special characters.",
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
    minimum: {
      type: "number",
      nullable: true,
      errorMessage: "The 'minimum' field, if provided, must be a number.",
    },
    maximum: {
      type: "number",
      nullable: true,
      errorMessage: "The 'maximum' field, if provided, must be a number.",
    },
    pattern: {
      type: "string",
      nullable: true,
      errorMessage: "The 'pattern' field, if provided, must be a string.",
    },
    format: {
      type: "string",
      nullable: true,
      errorMessage: "The 'format' field, if provided, must be a string.",
    },
    enum: {
      type: "array",
      items: { type: "string" },
      nullable: true,
      errorMessage: "The 'enum' field, if provided, must be an array of strings.",
    },
    default: {
      type: "object",
      nullable: true,
      additionalProperties: true,
      errorMessage: "The 'default' field can be any type.",
    },
    items: {
      type: "object",
      required: ["type"],
      nullable: true,
      anyOf: [
        { $ref: "#" }, // reference to the definition
        { type: "null" },
      ],
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
      errorMessage: "The 'properties' field must be an object with SchemaField values.",
    },
  },
  required: ["type"],
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
    content: {
      type: "object",
      required: [],
      nullable: false,
      additionalProperties: {
        type: "object",
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
      enum: GENERIC_ATTRIBUTE_TYPES,
      errorMessage: `The attribute type must be one of ${GENERIC_ATTRIBUTE_TYPES} and cannot be empty.`
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
    ns: {
      type: "string",
      nullable: true,
      errorMessage: 'The primary key, if provided, must be a valid boolean.'
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
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage: 'The basePath attribute can only contain alphanumeric characters without spaces or special characters.'
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