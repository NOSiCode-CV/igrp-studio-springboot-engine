import { ajvInstance } from "../utils/ajv-instance";
import { JSONSchemaType, ValidateFunction } from "ajv";
import { AttributeType, DTOBaseConfig, DTOConfig, JavaAttribute } from '../interfaces/types';
import { PATTERNS } from "../utils/constants";

const genericAttributeSchema: JSONSchemaType<AttributeType> = {
  type: "string",
  nullable: false,
  pattern: PATTERNS.NAME_VALIDATION_PATTERN,
  errorMessage: 'The attribute type must follow the naming convention (only alphabetic characters allowed) and cannot be empty.'
}

const attributeSchema: JSONSchemaType<JavaAttribute> = {
  type: "object",
  properties: {
    type: {
      type: "string",
      oneOf: genericAttributeSchema.oneOf
    },
    name: { 
      type: "string",
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage: 'The attribute name must contain only alphabetic characters and cannot contain spaces or special characters.'
    },
    objectType: {
      type: "string", 
      enum: ['model', 'dto', 'java', 'enum'],
      errorMessage: 'The abbreaviated namespace must model, dto, java.'
    },
    required: {
      type: "boolean",
      nullable: false,
      errorMessage: 'The required attribute must be a boolean value.'
    },
    before: {
      type: "boolean",
      nullable: true,
      errorMessage: 'The before attribute must be a boolean value.'
    },
    after: {
      type: "boolean",
      nullable: true,
      errorMessage: 'The after attribute must be a boolean value.'
    },
    positive: {
      type: "boolean",
      nullable: true,
      errorMessage: 'The positive attribute must be a boolean value.'
    },
    maxLength: {
      type: "number",
      nullable: true,
      errorMessage: 'The max length must be a number.'
    },
    minLength: {
      type: "number",
      nullable: true,
      errorMessage: 'The min length must be a number.'
    },
    regex: {
      type: "string",
      nullable: true,
      errorMessage: 'The regex must be a string.'
    },
    isEmail: {
      type: "boolean",
      nullable: true,
      errorMessage: 'The isEmail attribute must be a boolean value.'
    },
    isUrl: {
      type: "boolean",
      nullable: true,
      errorMessage: 'The isUrl attribute must be a boolean value.'
    },
    collectionType: {
      type: "string",
      nullable: true,
      errorMessage: 'The collectionType attribute must be a string value.'
    },
    primaryKey: {
      type: "boolean",
      nullable: true,
      errorMessage: 'The primary key, if provided, must be a valid boolean.'
    },
    response: {
      type: "string",
      nullable: true,
      errorMessage: 'The response, if provided, must be a valid string.'
    },
    module: {
      type: "string",
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage: 'The module name must follow the naming convention (only alphabetic characters allowed) and cannot be empty.',
      nullable: true
    },
    jsonAttributeName: {
      type: "string",
      pattern: PATTERNS.PARAMS_VALIDATION,
      errorMessage: 'The JSON attribute name must follow the naming convention (only alphabetic characters allowed) and cannot be empty.',
      nullable: true
    },
    xmlAttributeName: {
      type: "string",
      pattern: PATTERNS.PARAMS_VALIDATION,
      errorMessage: 'The JSON attribute name must follow the naming convention (only alphabetic characters allowed) and cannot be empty.',
      nullable: true
    },
  },
  required: ["type", "name", "objectType", "required"],
  additionalProperties: false,
  errorMessage: {
    required: {
      type: 'The attribute type is required.',
      name: 'The attribute name is required.',
      required: 'The attribute required is required.'
    },
    additionalProperties: 'No additional properties are allowed in the attribute schema.'
  }
};

const dtoConfigSchema: JSONSchemaType<DTOConfig> = {
  type: "object",
  properties: {
    id: {
      type: "string",
      nullable: true,
      errorMessage: 'The id if provided must be a string.'
    },
    type: { 
      type: "string",
      errorMessage: 'The type must be valid.'
    },
    name: { 
      type: "string", 
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage: 'The name must follow the naming convention (only alphabetic characters allowed) and cannot be empty.'
    },
    template: { 
      type: "string", 
      enum: ['record', 'classic'],
      errorMessage: 'The acceptable template are: record, classic.'
    },
    attributes: { 
      type: "array", 
      items: attributeSchema,
      errorMessage: 'The attributes must be an array of valid attribute definitions.'
    },
    module: {
      type: "string",
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage: 'The module name must follow the naming convention (only alphabetic characters allowed) and cannot be empty.',
      nullable: true
    },
    response: {
      type: "string",
      nullable: true,
      errorMessage: 'The response, if provided, must be a valid string.'
    },
  },
  required: ["type", "template", "name", "attributes"],
  additionalProperties: false,
  errorMessage: {
    required: {
      type: 'The type field is required and must be "model".',
      name: 'The name field is required and must follow the naming convention.',
      attributes: 'The attributes field is required and cannot be empty.'
    },
    additionalProperties: 'No additional properties are allowed in the model configuration schema.'
  }
};

const deletedDTOConfigSchema: JSONSchemaType<DTOBaseConfig> = {
  type: "object",
  properties: {
    id: {
      type: "string",
      nullable: true,
      errorMessage: 'The id if provided must be a string.'
    },
    type: { 
      type: "string", 
      const: "dto",
      errorMessage: 'The type must be "dto".'
    },
    name: { 
      type: "string", 
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage: 'The name must follow the naming convention (only alphabetic characters allowed) and cannot be empty.'
    },
    module: {
      type: "string",
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage: 'The aggregate name must follow the naming convention (only alphabetic characters allowed) and cannot be empty.',
      nullable: true
    }
  },
  required: ["type", "name"],
  additionalProperties: true,
  errorMessage: {
    required: {
      type: 'The type field is required and must be "model".',
      name: 'The name field is required and must follow the naming convention.',
    },
    additionalProperties: 'No additional properties are allowed in the model configuration schema.'
  }
};

export const validateDTOConfig: ValidateFunction<DTOConfig> = ajvInstance.compile<DTOConfig>(dtoConfigSchema);

export const validateDeleteDTOConfig: ValidateFunction<DTOBaseConfig> = ajvInstance.compile<DTOBaseConfig>(deletedDTOConfigSchema);