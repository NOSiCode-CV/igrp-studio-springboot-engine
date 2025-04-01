import { ajvInstance } from "../utils/ajv-instance";
import { JSONSchemaType, ValidateFunction } from "ajv";
import {
  ModelConfig,
  Crud,
  Attribute,
  Relation,
  PrimaryKey,
  UniqueConstraint,
  IModelPermission,
  EntityIndex, AttributeType, RelationReference,
} from '../interfaces/types';
import {
  CRUD_DISABLED_OPTIONS,
  PATTERNS,
  RELATIONSHIP_TYPES,
  GENERATION_TYPES,
  GENERIC_ATTRIBUTE_TYPES, FETCH_TYPE, CASCADE_TYPE,
} from '../utils/constants';

const genericAttributeSchema: JSONSchemaType<AttributeType> = {
  type: "string",
  nullable: false,
  pattern: PATTERNS.NAME_VALIDATION_PATTERN,
  errorMessage: 'The attribute type must follow the naming convention (only alphabetic characters allowed) and cannot be empty.'
}

export const relationSchema: JSONSchemaType<Relation> = {
  type: "object",
  properties: {
    type: {
      type: "string",
      enum: RELATIONSHIP_TYPES,
      errorMessage: `The relationType must be one of ${RELATIONSHIP_TYPES} and cannot be empty.`
    },
    fetchType: {
      type: "string",
      enum: FETCH_TYPE,
      errorMessage: `The fetchType must be one of ${FETCH_TYPE} and cannot be empty.`
    },
    cascadeType: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: {
            type: "string",
            enum: [...CASCADE_TYPE],
            errorMessage: {
              type: 'Cascade type must be a string',
              enum: `Each cascade type must be one of: ${CASCADE_TYPE.join(', ')}.`
            }
          },
        },
        errorMessage: `The cascade type, if provided, must be a valid cascade type configuration.`,
        required: ["type"],
        additionalProperties: false
      },
      nullable: true,
      errorMessage: {
        type: `The cascade types, if provided, must be an array of a valid cascade type configuration.`
      }
    },
    orphanRemoval: {
      type: 'boolean',
      nullable: true,
      errorMessage: 'The orphan removal attribute, if provided, must be a boolean'
    },
    entity: {
      type: "string",
      pattern: PATTERNS.NO_SPACE_AND_HYPHEN,
      errorMessage: 'The entity name is required and cannot be empty.'
    },
    fieldName: {
      type: "string",
      nullable: true,
      pattern: PATTERNS.PARAMS_VALIDATION,
      errorMessage: 'The fieldName field, if provided, cannot contain spaces, hyphens, or special characters. Only alphanumeric characters are allowed.'
    },
    mappedBy: {
      type: "string",
      nullable: true,
      pattern: PATTERNS.RELATIONS_PATTERN,
      errorMessage: 'The mappedBy field, if provided, must be a valid string following the naming convention.'
    },
    referencedColumnName: {
      type: "string",
      nullable: true,
      pattern: PATTERNS.RELATIONS_PATTERN,
      errorMessage: 'The referencedColumnName field, if provided, must be a valid string following the naming convention.'
    },
    cardinality: {
      type: 'string',
      enum: ['oneWay', 'twoWay'],
      errorMessage: `The cardinality must be one of 'oneWay' or 'twoWay' and cannot be empty.`
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
    },
    module: {
      type: "string",
      nullable: true,
      errorMessage: "The 'module' field if provided must be a valid string",
    },
  },
  required: ["type", "entity"],
  additionalProperties: false,
  errorMessage: {
    required: {
      relationType: 'The relationType is required and cannot be empty.',
      entity: 'The entity is required and cannot be empty.'
    },
    additionalProperties: 'No additional properties are allowed in the relation schema.'
  }
};

const relationReferenceSchema: JSONSchemaType<RelationReference> = {
  type: "object",
  properties: {
    type: {
      type: "string",
      enum: RELATIONSHIP_TYPES,
      errorMessage: `The relationType must be one of ${RELATIONSHIP_TYPES} and cannot be empty.`
    },
    fetchType: {
      type: "string",
      enum: FETCH_TYPE,
      nullable: false,
      errorMessage: `The fetchType must be one of ${FETCH_TYPE} and cannot be empty.`
    },
    module: {
      type: "string",
      nullable: true,
      errorMessage: `The module must be a valid string.`
    },
    entity: {
      type: "string",
      pattern: PATTERNS.NO_SPACE_AND_HYPHEN,
      errorMessage: 'The entity name is required and cannot be empty.'
    },
    fieldName: {
      type: "string",
      nullable: true,
      pattern: PATTERNS.PARAMS_VALIDATION,
      errorMessage: 'The fieldName field, cannot contain spaces, hyphens, or special characters. Only alphanumeric characters are allowed.'
    },
    mappedBy: {
      type: "string",
      nullable: true
    },
  },
  required: ["type", "entity"],
  additionalProperties: false,
  errorMessage: {
    required: {
      type: 'The attribute type is required.'
    },
    additionalProperties: 'No additional properties are allowed in the reference relation schema.'
  }
};

const attributeSchema: JSONSchemaType<Attribute> = {
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
    skipFieldRevision: {
      type: "boolean",
      nullable: true,
      errorMessage: 'The skip field revision attribute must be a boolean value if provided.'
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
    objectType: {
      type: "string",
      nullable: true,
      errorMessage: 'The primary key, if provided, must be a valid boolean.'
    },
    relation: {
      type: "object",
      nullable: true,
      oneOf: [
        relationSchema
      ],
      errorMessage: 'The relation, if provided, must be a valid relationship definition.'
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

const permissionSchema: JSONSchemaType<IModelPermission> = {
  type: "object",
  properties: {
    method: {
      type: 'string',
      enum: CRUD_DISABLED_OPTIONS
    },
    permissions: {
      type: 'array',
      items: {type: 'string'}
    }
  },
  required: ['method', 'permissions'],
  additionalProperties: false,
}

const crudSchema: JSONSchemaType<Crud> = {
  type: "object",
  properties: {
    enabled: { 
      type: "boolean",
      errorMessage: 'The enabled property must be a boolean value.'
    },
    path: { 
      type: "string", 
      pattern: PATTERNS.PATH_VALIDATION,
      errorMessage: 'The path must contain only alphabetic characters and cannot contain spaces or special characters.'
    },
    permissions: {
      type: "array",
      items: permissionSchema,
      nullable: true
    },
    
    disabledMethods: { 
      type: "array", 
      items: { 
        type: "string", 
        enum: CRUD_DISABLED_OPTIONS,
        errorMessage: `Each disabled method must be one of the following: ${CRUD_DISABLED_OPTIONS}.`
      },
      errorMessage: 'The disabledMethods must be an array of valid method names.'
    }
  },
  required: ["enabled", "path", "disabledMethods"],
  additionalProperties: false,
  errorMessage: {
    required: {
      enabled: 'The enabled field is required.',
      path: 'The path field is required and cannot be empty.',
      disabledMethods: 'The disabledMethods field is required and cannot be empty.'
    },
    additionalProperties: 'No additional properties are allowed in the CRUD schema.'
  }
};

const primaryKeySchema: JSONSchemaType<PrimaryKey> = {
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
    defaultValue: {
      type: 'string',
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
}
const uniqueConstraintSchema: JSONSchemaType<UniqueConstraint> = {
  type: "object",
  properties: {
    name: {
      type: "string",
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage: "The unique constraint name must follow the naming convention."
    },
    columns: {
      type: "array",
      items: {
        type: "string",
        pattern: PATTERNS.NAME_VALIDATION_PATTERN,
        errorMessage: "Each column name in the unique constraint must follow the naming convention."
      },
      errorMessage: "The columns field must be an array of valid column names."
    }
  },
  required: ["name", "columns"],
  additionalProperties: false,
  errorMessage: {
    additionalProperties: 'No additional properties are allowed in the unique constraint configuration schema.'
  }
};

const entityIndexSchema: JSONSchemaType<EntityIndex> = {
  type: "object",
  properties: {
    name: {
      type: "string",
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage: "The index name must follow the naming convention."
    },
    columns: {
      type: "array",
      items: {
        type: "string",
        pattern: PATTERNS.NAME_VALIDATION_PATTERN,
        errorMessage: "Each column name in the index must follow the naming convention."
      },
      errorMessage: "The columns field must be an array of valid column names."
    },
    unique: {
      type: "boolean",
      errorMessage: "The unique property of index must be specified"
    },
  },
  required: ["name", "columns", "unique"],
  additionalProperties: false,
  errorMessage: {
    additionalProperties: 'No additional properties are allowed in the entity index configuration schema.'
  }
};

const modelConfigSchema: JSONSchemaType<ModelConfig> = {
  type: "object",
  properties: {
    id: {
      type: "string",
      nullable: true,
      errorMessage: 'The id if provided must be a string.'
    },
    type: {
      type: "string",
      const: "model",
      errorMessage: 'The type must be "model".'
    },
    name: { 
      type: "string", 
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage: 'The name must follow the naming convention (only alphabetic characters allowed) and cannot be empty.'
    },
    tableName: {
      type: "string",
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage: 'The table name must follow the naming convention (only alphabetic characters allowed) and cannot be empty.'
    }, 
    primaryKey: {
      type: 'array',
      nullable: true,
      items: primaryKeySchema,
      errorMessage: 'The primary key attribute must be provided.'
    },
    attributes: { 
      type: "array", 
      items: attributeSchema,
      errorMessage: 'The attributes must be an array of valid attribute definitions.'
    },
    crud: { 
      type: "boolean",
      nullable: true,
      errorMessage: 'If provided, the CRUD configuration must be a boolean.'
    },
    uniqueConstraints: {
      type: "array",
      nullable: true,
      items: uniqueConstraintSchema,
      errorMessage: 'The uniqueConstraints must be an array of valid unique constraint definitions.'
    },
    relationReference: {
      type: "array",
      nullable: true,
      items: relationReferenceSchema,
      errorMessage: 'The relation Reference must be an array of valid relation Reference definitions.'
    },
    indexes: {
      type: "array",
      nullable: true,
      items: entityIndexSchema,
      errorMessage: 'The indexes must be an array of valid unique constraint definitions.'
    },
    audit: {  // Definition of the new audit field
      type: "boolean",
      nullable: true,
      errorMessage: 'The audit field, if provided, must be a boolean value.'
    },
    revision: {
      type: "boolean",
      nullable: true,
      errorMessage: 'The revision definition, if provided, must be a boolean value.'
    },
    module: {
      type: "string",
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage: 'The aggregate name must follow the naming convention (only alphabetic characters allowed) and cannot be empty.',
      nullable: true
    },
  },
  required: ["type", "name", "attributes", "tableName"],
  additionalProperties: false,
  errorMessage: {
    required: {
      type: 'The type field is required and must be "model".',
      name: 'The name field is required and must follow the naming convention.',
      tableName: "table name is required",
      attributes: 'The attributes field is required and cannot be empty.'
    },
    additionalProperties: 'No additional properties are allowed in the model configuration schema.'
  }
};

export const validateModelConfig: ValidateFunction<ModelConfig> = ajvInstance.compile<ModelConfig>(modelConfigSchema);