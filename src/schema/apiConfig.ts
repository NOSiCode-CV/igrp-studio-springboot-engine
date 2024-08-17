import { ApiConfig } from "../interfaces/types";
import { ajvInstance } from "../utils/ajv-instance";
import { JSONSchemaType, ValidateFunction } from "ajv";
import { PATTERNS } from "../utils/constants";


const apiSchema: JSONSchemaType<ApiConfig> = {
  type: 'object',
  properties: {
    type: { 
      type: "string", 
      const: "baseApi",
      errorMessage: "The 'type' attribute must be 'baseApi'."  // Error message for the constant
    },
    apiName: { 
      type: "string",
      pattern: PATTERNS.NO_SPACE_AND_HYPHEN,
      minLength: 1,
      errorMessage: {
        pattern: "The 'apiName' attribute cannot contain spaces or hyphens.",
        minLength: "The 'apiName' attribute cannot be empty."
      }
    },
    group: { 
      type: "string", 
      minLength: 1, 
      errorMessage: {
        minLength: "The 'group' attribute cannot be empty."
      }
    },
    artifact: { 
      type: "string", 
      minLength: 1, 
      errorMessage: {
        minLength: "The 'artifact' attribute cannot be empty."
      }
    },
    database: { 
      type: "string", 
      minLength: 1, 
      errorMessage: {
        minLength: "The 'database' attribute cannot be empty."
      }
    },
    description: { 
      type: "string", 
      nullable: true, 
      errorMessage: {
        type: "The 'description' attribute must be a string."
      }
    },
    package: { 
      type: "string", 
      nullable: true, 
      errorMessage: {
        type: "The 'package' attribute must be a string."
      }
    },
    name: { 
      type: "string", 
      nullable: true, 
      errorMessage: {
        type: "The 'name' attribute must be a string."
      }
    }
  },
  required: ["type", "apiName", "group", "artifact", "database"],
  additionalProperties: false,
  errorMessage: {
    required: {
      type: "The 'type' attribute is required.",
      apiName: "The 'apiName' attribute is required.",
      group: "The 'group' attribute is required.",
      artifact: "The 'artifact' attribute is required.",
      database: "The 'database' attribute is required."
    },
    additionalProperties: "No additional properties are allowed in the API configuration."
  }
};

export const apiValidation: ValidateFunction<ApiConfig> = ajvInstance.compile<ApiConfig>(apiSchema);