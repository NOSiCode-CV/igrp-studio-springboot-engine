import { ModuleConfig } from '../interfaces/types';
import { ajvInstance } from "../utils/ajv-instance";
import { JSONSchemaType, ValidateFunction } from "ajv";
import { PATTERNS } from "../utils/constants";


const moduleSchema: JSONSchemaType<ModuleConfig> = {
  type: 'object',
  properties: {
    type: { 
      type: "string", 
      const: "module",
      errorMessage: "The 'type' attribute must have the value 'module'."
    },
    name: {
      type: "string",
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage: {
        pattern: "The 'name' attribute must not be empty and cannot contain spaces, hyphens, or special characters. Only alphanumeric characters are allowed."
      }
    },
  },
  required: ["type", "name"],
  additionalProperties: false,
  errorMessage: {
    required: {
      type: "The 'type' attribute is required and must be specified.",
      name: "The 'name' attribute is required and cannot be left blank.",
    },
    additionalProperties: "Extra attributes are not allowed in the API configuration."
  }
};


export const moduleValidation: ValidateFunction<ModuleConfig> = ajvInstance.compile<ModuleConfig>(moduleSchema);


