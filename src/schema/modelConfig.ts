import { ajvInstance } from "../utils/ajv-instance";
import { JSONSchemaType, ValidateFunction } from "ajv";
import { ModelConfig, Crud, Attribute, Relation, PrimaryKey, UniqueConstraint, IModelPermission } from "../interfaces/types";
import { ATTRIBUTE_TYPES, CRUD_DISABLED_OPTIONS, PATTERNS, RELATIONSHIP_TYPES, GENERATION_TYPES, HTTP_METHOD_TYPES } from "../utils/constants";

const attributeSchema: JSONSchemaType<Attribute> = {
  type: "object",
  properties: {
    type: { 
      type: "string",
      enum: ATTRIBUTE_TYPES, 
      errorMessage: `The attribute type must be one of ${ATTRIBUTE_TYPES} and cannot be empty.`
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
    }
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
      enum: HTTP_METHOD_TYPES
    },
    permission: {
      type: 'string'
    }
  },
  required: ['method', 'permission'],
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

const primaryKeySchema: JSONSchemaType<PrimaryKey> = {
  type: "object",
  properties: {
    type: { 
      type: "string",
      enum: ATTRIBUTE_TYPES, 
      errorMessage: `The attribute type must be one of ${ATTRIBUTE_TYPES} and cannot be empty.`
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
  additionalProperties: false
};

const modelConfigSchema: JSONSchemaType<ModelConfig> = {
  type: "object",
  properties: {
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
      type: "object", 
      nullable: true, 
      properties: crudSchema.properties, 
      required: crudSchema.required,
      errorMessage: 'If provided, the CRUD configuration must be valid.'
    },
    uniqueConstraints: {
      type: "array",
      nullable: true,
      items: uniqueConstraintSchema,
      errorMessage: 'The uniqueConstraints must be an array of valid unique constraint definitions.'
    },
    relations: { 
      type: "array", 
      nullable: true, 
      items: relationSchema,
      errorMessage: 'The relations, if provided, must be an array of valid relationship definitions.'
    },
    audit: {  // Definition of the new audit field
      type: "boolean",
      nullable: true,
      errorMessage: 'The audit field, if provided, must be a boolean value.'
    }
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
export const validateCrud: ValidateFunction<Crud> = ajvInstance.compile<Crud>(crudSchema)