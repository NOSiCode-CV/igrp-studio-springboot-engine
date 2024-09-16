import { ajvInstance } from "../utils/ajv-instance";
import { JSONSchemaType, ValidateFunction } from "ajv";
import { DTOConfig, JavaAttribute } from "../interfaces/types";
import { PATTERNS } from "../utils/constants";
const attributeSchema: JSONSchemaType<JavaAttribute> = {
  type: "object",
  properties: {
    type: { 
      type: "string",
      errorMessage: `The attribute type must be one of  and cannot be empty.`
    },
    name: { 
      type: "string",
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage: 'The attribute name must contain only alphabetic characters and cannot contain spaces or special characters.'
    },
  },
  required: ["type", "name"],
  additionalProperties: true,
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
      const: "dto",
      errorMessage: 'The type must be "dto".'
    },
    name: { 
      type: "string", 
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage: 'The name must follow the naming convention (only alphabetic characters allowed) and cannot be empty.'
    },
    template: { 
      type: "string", 
      pattern: ['record', 'classic'],
      errorMessage: 'The acceptable template are: record, classic.'
    },
    attributes: { 
      type: "array", 
      items: attributeSchema,
      errorMessage: 'The attributes must be an array of valid attribute definitions.'
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

export const validateDTOConfig: ValidateFunction<DTOConfig> = ajvInstance.compile<DTOConfig>(dtoConfigSchema);