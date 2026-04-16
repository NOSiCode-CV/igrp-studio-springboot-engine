import { MoveConfig } from '../interfaces/types';
import { ajvInstance } from '../utils/ajv-instance';
import { JSONSchemaType, ValidateFunction } from 'ajv';
import { CONFIG_TYPES, PATTERNS } from '../utils/constants';

const moveSchema: JSONSchemaType<MoveConfig> = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      enum: CONFIG_TYPES,
      errorMessage: {
        enum: `The 'type' attribute cannot be empty and must be one of the following: ${CONFIG_TYPES.join(', ')}.`,
      },
    },
    subType: {
      type: 'string',
      nullable: true,
      errorMessage: 'The subType must be a valid string.',
    },
    name: {
      type: 'string',
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage: {
        pattern:
          "The 'name' attribute must not be empty and cannot contain spaces, hyphens, or special characters. Only alphanumeric characters are allowed.",
      },
    },
    sourceModule: {
      type: 'string',
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage:
        'The source module name must follow the naming convention (only alphabetic characters allowed) and cannot be empty.',
    },
    destinationModule: {
      type: 'string',
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage:
        'The destination module name must follow the naming convention (only alphabetic characters allowed) and cannot be empty.',
    },
  },
  required: ['type', 'name'],
  additionalProperties: false,
  errorMessage: {
    required: {
      type: "The 'type' attribute is required and must be specified.",
      name: "The 'name' attribute is required and cannot be left blank.",
      basePath: "The 'basePath' attribute is required and cannot be left blank.",
    },
    additionalProperties: 'Extra attributes are not allowed in the API configuration.',
  },
};

export const moveValidation: ValidateFunction<MoveConfig> =
  ajvInstance.compile<MoveConfig>(moveSchema);
