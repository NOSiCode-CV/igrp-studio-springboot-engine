import {
  PATTERNS,
} from '../utils/constants';
import { ajvInstance } from '../utils/ajv-instance';
import { JSONSchemaType, ValidateFunction } from 'ajv';
import {
  ResponseConfig,
} from '../interfaces/types';

/**
 * JSON schema for validating the Body interface.
 */
const bodySchema: JSONSchemaType<ResponseConfig> = {
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
    collectionType: {
      type: "string",
      nullable: true,
      errorMessage: "The 'collectionType' field, if provided, must be a string.",
    },
    name: {
      type: "string",
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      nullable: true,
      errorMessage: "The attribute name must contain only alphabetic characters and cannot contain spaces or special characters.",
    },
    template: {
      type: "string",
      enum: ['record', 'classic'],
      errorMessage: 'The acceptable template are: record, classic.'
    },
    statusCode: {
      type: "string",
      pattern: PATTERNS.STATUS_CODE,
      nullable: false,
      errorMessage: "The attribute statusCode must contain only 3 numeric characters and cannot contain spaces or other characters.",
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
  required: ["content"],
  additionalProperties: false
};

export const validateResponse: ValidateFunction<ResponseConfig> =
  ajvInstance.compile<ResponseConfig>(bodySchema);