import { ApiConfig, ExceptionConfig } from '../interfaces/types';
import { ajvInstance } from "../utils/ajv-instance";
import { JSONSchemaType, ValidateFunction } from "ajv";
import { DATABASE_TYPES, PATTERNS } from "../utils/constants";

const exceptionSchema: JSONSchemaType<ExceptionConfig> = {
  type: 'object',
  properties: {
    name: {
      type: "string",
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage: {
        pattern: "The 'name' attribute must not be empty and cannot contain spaces, hyphens, or special characters. Only alphanumeric characters are allowed."
      }
    },
    body: {
      type: "string",
      pattern: PATTERNS.NO_SPACE_AND_HYPHEN,
      errorMessage: 'The body name is required and cannot be empty.'
    },
    module: {
      type: "string",
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage: 'The module name must follow the naming convention (only alphabetic characters allowed) and cannot be empty.',
      nullable: true
    }
  },
  required: ["name", "body"],
  additionalProperties: false,
  errorMessage: {
    required: {
      name: "The 'name' attribute is required and cannot be left blank.",
      body: "The 'body' attribute is required and must be specified.",
    },
    additionalProperties: "Extra attributes are not allowed in the exception configuration."
  }
};

export const exceptionValidation: ValidateFunction<ExceptionConfig> = ajvInstance.compile<ExceptionConfig>(exceptionSchema);


