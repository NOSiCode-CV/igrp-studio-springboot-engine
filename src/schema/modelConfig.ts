import { ajvInstance } from "../utils/ajv-instance";
import { JSONSchemaType, ValidateFunction } from "ajv";
import { ModelConfig, Crud, Attribute, Relation } from "../interfaces/types";
import { ATTRIBUTE_TYPES, CRUD_DISABLED_OPTIONS, PATTERNS, RELATIONSHIP_TYPES } from "../utils/constants";

// TODO Add errors
const attributeSchema: JSONSchemaType<Attribute> = {
  type: "object",
  properties: {
    type: { type: "string", enum: ATTRIBUTE_TYPES, minLength: 1 },
    // TODO: Check convention with pattern
    name: { type: "string", minLength: 1 },
    primary: { type: "boolean", nullable: true }, 
    required: { type: "boolean", nullable: true },  
    unique: { type: "boolean", nullable: true},
    notNull: { type: "boolean", nullable: true }
  },
  required: ["type", "name"],
  additionalProperties: false,
};

// TODO Add errors
const crudSchema: JSONSchemaType<Crud> = {
  type: "object",
  properties: {
    enabled: { type: "boolean" },
    // TODO Add pattern
    path: { type: "string", minLength: 1 },
    disabledMethods: { type: "array", items: { type: "string", enum: CRUD_DISABLED_OPTIONS } }
  },
  required: ["enabled", "path", "disabledMethods"],
  additionalProperties: false,
};

// TODO Add errors
const relationSchema: JSONSchemaType<Relation> = {
  type: "object",
  properties: {
    relationType: { type: "string", enum: RELATIONSHIP_TYPES, minLength: 1 },
    // TODO Add pattern with existing entities (it is a function and it will need to read the config files)
    entity: { type: "string", minLength: 1 },
    // TODO: Add pattern for convention. 
    mappedBy: { type: "string", nullable: true },
    // TODO: Add pattern based on the selected entity.  
    joinColumn: { type: "string", nullable: true }, 
    // TODO: Add pattern based on the selected entity. 
    joinTable: { type: "string", nullable: true },  
    // TODO: Add pattern based on the selected entity. 
    inverseJoinColumn: { type: "string", nullable: true }  
  },
  required: ["relationType", "entity"],
  additionalProperties: false,
};

// TODO Add errors
const modelConfigSchema: JSONSchemaType<ModelConfig> = {
  type: "object",
  properties: {
    type: { type: "string", const: "model" },
    name: { type: "string", minLength: 1, pattern: PATTERNS.NO_SPACE_AND_HYPHEN },
    attributes: { type: "array", items: attributeSchema },
    crud: { type: "object", nullable: true, properties: crudSchema.properties, required: crudSchema.required },
    relations: { type: "array", nullable: true, items: relationSchema }
  },
  required: ["type", "name", "attributes"],
  additionalProperties: false,
};

export const validateModelConfig: ValidateFunction<ModelConfig> = ajvInstance.compile<ModelConfig>(modelConfigSchema);
export const validateCrud: ValidateFunction<Crud> = ajvInstance.compile<Crud>(crudSchema)