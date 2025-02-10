import { SerializationConfig } from '../interfaces/types';
import { ajvInstance } from "../utils/ajv-instance";
import { JSONSchemaType, ValidateFunction } from "ajv";
import { PATTERNS } from '../utils/constants';

const serializationSchema: JSONSchemaType<SerializationConfig> = {
  type: 'object',
  properties: {
    name: {
      type: "string",
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage: 'The name must follow the naming convention (only alphabetic characters allowed) and cannot be empty.'
    },
    module: {
      type: "string",
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage: 'The module name must follow the naming convention (only alphabetic characters allowed) and cannot be empty.',
      nullable: true
    },
    type: {
      type: "string",
      enum: ['model', 'dto', 'response'],
      errorMessage: 'The type must model, dto or response.'
    },
    template: {
      type: "string",
      enum: ['record', 'classic'],
      errorMessage: 'The acceptable template are: record, classic.'
    },
    json: {
      type: "string",
      nullable: true,
      pattern: PATTERNS.JSON_PATTERN,
      errorMessage: "Invalid JSON format."
    },
    xml: {
      type: "string",
      nullable: true,
      errorMessage: "Invalid XML format."
    },
    sql: {
      type: "string",
      nullable: true
    },
    ddl: {
      type: "string",
      nullable: true,
      errorMessage: "Invalid DDL create table script format. Valid format: CREATE TABLE table_name (...)"
    }
  },
  required: ["type", "template", "name"],
  additionalProperties: false,
  errorMessage: {
    required: {
      type: "The 'type' attribute is required and must be specified.",
      template: "The 'template' attribute is required and cannot be left blank.",
      name: "The 'name' attribute is required and cannot be left blank.",
    },
    additionalProperties: "Extra attributes are not allowed in the serialization configuration."
  }
};

export const serializationValidation: ValidateFunction<SerializationConfig> = ajvInstance.compile<SerializationConfig>(serializationSchema);