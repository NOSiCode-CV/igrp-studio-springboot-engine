import { Attribute, EnumConfig, EnumValue, Relation } from '../interfaces/types';
import { ajvInstance } from "../utils/ajv-instance";
import { JSONSchemaType, ValidateFunction } from "ajv";
import { GENERATION_TYPES, GENERIC_ATTRIBUTE_TYPES, PATTERNS, RELATIONSHIP_TYPES } from '../utils/constants';

const relationSchema: JSONSchemaType<Relation> = {
  type: "object",
  properties: {
    relationType: {
      type: "string",
      enum: RELATIONSHIP_TYPES,
      errorMessage: `The relationType must be one of ${RELATIONSHIP_TYPES} and cannot be empty.`
    },

    entity: {
      type: "string",
      pattern: PATTERNS.NO_SPACE_AND_HYPHEN,
      errorMessage: 'The entity name is required and cannot be empty.'
    },
    mappedBy: {
      type: "string",
      nullable: true,
      pattern: PATTERNS.RELATIONS_PATTERN,
      errorMessage: 'The mappedBy field, if provided, must be a valid string following the naming convention.'
    },

    joinColumn: {
      type: "string",
      nullable: true,
      pattern: PATTERNS.RELATIONS_PATTERN,
      errorMessage: 'The joinColumn field, if provided, must be a valid string following the naming convention.'
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
  required: ["relationType", "entity"],
  additionalProperties: false,
  errorMessage: {
    required: {
      relationType: 'The relationType is required and cannot be empty.',
      entity: 'The entity is required and cannot be empty.'
    },
    additionalProperties: 'No additional properties are allowed in the relation schema.'
  }
};

const valueSchema: JSONSchemaType<EnumValue> = {
  type: "object",
  properties: {
    name: {
      type: "string",
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage:
        "The attribute name must contain only alphabetic characters and cannot contain spaces or special characters."
    },
    attributes: {
      type: "array",
      nullable: true,
      items: {
        type: "object",
        additionalProperties: true
      }
    }
  },
  required: ["name"],
  additionalProperties: false,
  errorMessage: {
    required: {
      name: "The attribute name is required."
    },
    additionalProperties: "No additional properties are allowed in the attribute schema."
  }
};

const enumAttributeSchema: JSONSchemaType<Attribute> = {
  type: "object",
  properties: {
    type: {
      type: "string",
      enum: GENERIC_ATTRIBUTE_TYPES,  // Ensure no duplicates in this enum list
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
    relation: {
      type: "object",
      nullable: true,
      oneOf: [
        relationSchema
      ],
      errorMessage: 'The relation, if provided, must be a valid relationship definition.'
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

const enumSchema: JSONSchemaType<EnumConfig> = {
  type: 'object',
  properties: {
    module: {
      type: "string",
      nullable: true,
      pattern: PATTERNS.PARAMS_VALIDATION,
      errorMessage: {
        pattern: "The 'module' attribute must not be empty and cannot contain spaces, hyphens, or special characters. Only alphanumeric characters are allowed."
      }
    },
    name: {
      type: "string",
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage: {
        pattern: "The 'name' attribute must not be empty and cannot contain spaces, hyphens, or special characters. Only alphanumeric characters are allowed."
      }
    },
    attributes: {
      type: "array",
      nullable: true,
      items: enumAttributeSchema,
      errorMessage: 'The attributes must be an array of valid attribute definitions.'
    },
    values: {
      type: "array",
      nullable: false,
      items: valueSchema,
      errorMessage: 'The values must be an array of valid enum values definitions.'
    },
  },
  required: ["values", "name"],
  additionalProperties: false,
  errorMessage: {
    required: {
      type: "The 'values' attribute is required and must be specified.",
      name: "The 'name' attribute is required and cannot be left blank.",
    },
    additionalProperties: "Extra attributes are not allowed in the enum configuration."
  }
};

export const enumValidation: ValidateFunction<EnumConfig> = ajvInstance.compile<EnumConfig>(enumSchema);


