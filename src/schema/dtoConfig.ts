import { ajvInstance } from "../utils/ajv-instance";
import { JSONSchemaType, ValidateFunction } from "ajv";
import { DTOBaseConfig, DTOConfig, JavaAttribute, JavaType } from "../interfaces/types";
import { PATTERNS } from "../utils/constants";


type JavaTypeUnion = string | JavaType;

const javaTypeSchema: JSONSchemaType<JavaTypeUnion> = {
  anyOf: [
    {
      type: "object",
      properties: { 
        name: { 
          type: "string", pattern: PATTERNS.NAME_VALIDATION_PATTERN,
          errorMessage: 'The name must follow the naming convention (only alphabetic characters allowed) and cannot be empty.'
        },
        namespace: { 
          type: "string", pattern: PATTERNS.NAMESPACE_VALIDATION_PATTERN, nullable: true,
          errorMessage: 'The namespace must follow the package naming convention.'
        }
      },
      required: ["name"],
    },
    {
      type: "string",
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage: 'The name must follow the naming convention (only alphabetic characters allowed) and cannot be empty.'
    }
  ]
  
};

const attributeSchema: JSONSchemaType<JavaAttribute> = {
  type: "object",
  properties: {
    type: { 
      type: ["object", "string"],
      anyOf: javaTypeSchema.anyOf
    },
    name: { 
      type: "string",
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage: 'The attribute name must contain only alphabetic characters and cannot contain spaces or special characters.'
    },
    ns: { 
      type: "string", 
      enum: ['model', 'dto', 'java'],
      errorMessage: 'The abbreaviated namespace must model, dto, java.'
    },
    isList: { 
      type: "boolean", 
      nullable: true,
      errorMessage: 'The isList attribute must be a boolean value.'
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
  },
  required: ["type", "name", "ns"],
  additionalProperties: false,
  errorMessage: {
    required: {
      type: 'The attribute type is required.',
      name: 'The attribute name is required.'
    },
    additionalProperties: 'No additional properties are allowed in the attribute schema.'
  }
};

const dtoConfigSchema: JSONSchemaType<DTOConfig> = {
  type: "object",
  properties: {
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