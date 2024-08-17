import { ajvInstance } from "../utils/ajv-instance";
import { JSONSchemaType, ValidateFunction } from "ajv";
import { ModelConfig, Crud, Attribut, Relation } from "../interfaces/types";
import { PATTERNS } from "../utils/constants";


const attributSchema: JSONSchemaType<Attribut> = {
  type: "object",
  properties: {
    type: { type: "string", minLength: 1 },
    name: { type: "string", minLength: 1 },
    primary: { type: "boolean", nullable: true }, 
    required: { type: "boolean", nullable: true },  
    unique: { type: "boolean" },
    notNull: { type: "boolean" }
  },
  required: ["type", "name", "unique", "notNull"],
  additionalProperties: false,
};

const crudSchema: JSONSchemaType<Crud> = {
  type: "object",
  properties: {
    enabled: { type: "boolean" },
    path: { type: "string", minLength: 1 },
    disabledMethods: { type: "array", items: { type: "string" } }
  },
  required: ["enabled", "path", "disabledMethods"],
  additionalProperties: false,
};

const relationSchema: JSONSchemaType<Relation> = {
  type: "object",
  properties: {
    relationType: { type: "string", minLength: 1 },
    entity: { type: "string", minLength: 1 },
    mappedBy: { type: "string", nullable: true },  
    joinColumn: { type: "string", nullable: true }, 
    joinTable: { type: "string", nullable: true },  
    inverseJoinColumn: { type: "string", nullable: true }  
  },
  required: ["relationType", "entity"],
  additionalProperties: false,
};

const modelConfigSchema: JSONSchemaType<ModelConfig> = {
  type: "object",
  properties: {
    type: { type: "string", const: "model" },
    name: { type: "string", minLength: 1, pattern: PATTERNS.NO_SPACE_AND_HYPHEN },
    attributes: { type: "array", items: attributSchema },
    crud: { type: "object", nullable: true, properties: crudSchema.properties, required: crudSchema.required },
    relations: { type: "array", nullable: true, items: relationSchema }
  },
  required: ["type", "name", "attributes"],
  additionalProperties: false,
};

export const validateModelConfig: ValidateFunction<ModelConfig> = ajvInstance.compile<ModelConfig>(modelConfigSchema);
export const validateCrud: ValidateFunction<Crud> = ajvInstance.compile<Crud>(crudSchema)