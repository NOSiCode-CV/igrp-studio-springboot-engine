import { BaseApiConfig } from "../interfaces/types";
import { ajvInstance } from "../utils/ajv-instance";
import { JSONSchemaType, ValidateFunction } from "ajv";
import { DATABASE_TYPES, PATTERNS } from "../utils/constants";
import { Dependency } from '../interfaces/springDependencyTypes';

export const dependencySchema: JSONSchemaType<Dependency> = {
  type: 'object',
  properties: {
    name: {
      type: "string",
      nullable: false,
      errorMessage: "The 'name' attribute must be a valid string."
    },
    groupId: {
      type: "string",
      pattern: "^[a-zA-Z0-9._]+$",
      errorMessage: {
        pattern: "The 'groupId' attribute  cannot be empty and must only contain alphanumeric characters without spaces or special symbols."
      }
    },
    artifactId: {
      type: "string",
      pattern: "^[a-zA-Z0-9._-]+$",
      errorMessage: {
        pattern: "The 'artifactId' attribute cannot be empty and must only contain alphanumeric characters without spaces or special characters."
      }
    },
    scope: {
      type: "string",
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage: {
        pattern: "The 'scope' attribute must not be empty and cannot contain spaces, hyphens, or special characters. Only alphanumeric characters are allowed."
      }
    },
    version: {
      type: "string",
      nullable: true,
      errorMessage: "The 'version' attribute must be a valid string."
    },
    bom: {
      type: "string",
      nullable: true,
      errorMessage: "The 'bom' attribute must be a valid string."
    },
  },
  required: ["name", "groupId", "artifactId", "scope"],
  additionalProperties: false,
  errorMessage: {
    required: {
      name: "The 'name' attribute is required and cannot be left blank.",
      groupId: "The 'groupId' attribute is required and must be provided.",
      artifactId: "The 'artifactId' attribute is required and cannot be empty.",
      scope: "The 'scope' attribute is required and cannot be empty.",
    },
    additionalProperties: "Extra attributes are not allowed in the dependency configuration."
  }
};

const apiSchema: JSONSchemaType<BaseApiConfig> = {
  type: 'object',
  properties: {
    type: {
      type: "string",
      const: "springboot",
      errorMessage: "The 'type' attribute must have the value 'springboot'."
    },
    apiName: {
      type: "string",
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage: {
        pattern: "The 'apiName' attribute must not be empty and cannot contain spaces, hyphens, or special characters. Only alphanumeric characters are allowed."
      }
    },
    group: {
      type: "string",
      pattern: "^[a-zA-Z0-9._]+$",
      errorMessage: {
        pattern: "The 'group' attribute  cannot be empty and must only contain alphanumeric characters without spaces or special symbols."
      }
    },
    artifact: {
      type: "string",
      pattern: "^[a-zA-Z0-9._-]+$",
      errorMessage: {
        pattern: "The 'artifact' attribute cannot be empty and must only contain alphanumeric characters whithout spaces or special characters."
      }
    },

    database: {
      type: "string",
      enum: DATABASE_TYPES,
      errorMessage: {
        enum: "The 'database' attribute cannot be empty and must be one of the following: 'Postgresql', 'MySQL', 'H2' or 'Oracle'."
      }
    },
    description: {
      type: "string",
      nullable: true,
      errorMessage: {
        type: "The 'description' attribute must be a valid string."
      }
    },
    package: {
      type: "string",
      nullable: true
    },
    name: {
      type: "string",
      nullable: true
    },
    projectStructureStyle: {
      type: "string",
      nullable: false
    },
    enableObservability: {
      type: "boolean",
      nullable: false
    },
    enableEntityRevision: {
      type: "boolean",
      nullable: false
    },
    igrpCoreVersion: {
      type: "string",
      nullable: false
    },
    springBootVersion: {
      type: "string",
      nullable: true
    },
    dependencies: {
      type: "array",
      nullable: true,
      items: dependencySchema,
      errorMessage: 'The dependencies must be an array of valid dependency definitions.'
    },
    enableGraalVm: {
      type: "boolean",
      nullable: false
    },
  },
  required: ["type", "apiName", "group", "artifact", "database", "projectStructureStyle", "enableObservability", "igrpCoreVersion", "enableEntityRevision", "enableGraalVm"],
  additionalProperties: false,
  errorMessage: {
    required: {
      type: "The 'type' attribute is required and must be specified.",
      apiName: "The 'apiName' attribute is required and cannot be left blank.",
      group: "The 'group' attribute is required and must be provided.",
      artifact: "The 'artifact' attribute is required and cannot be empty.",
      database: "The 'database' attribute is required and must specify a valid database type.",
      projectStructureStyle: "The 'projectStructureStyle' attribute is required and must specify a valid database type.",
      enableObservability: "The 'enableObservability' attribute is required and must specify a valid boolean type.",
      dependencies: "The 'dependencies' attribute is required and must specify an array of valid dependencies.",
      enableGraalVm: "The 'enableGraalVm' attribute is required and must specify a valid boolean type."
    },
    additionalProperties: "Extra attributes are not allowed in the API configuration."
  }
};


export const apiValidation: ValidateFunction<BaseApiConfig> = ajvInstance.compile<BaseApiConfig>(apiSchema);


