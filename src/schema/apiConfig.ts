import { ApiConfig } from '../interfaces/types';
import { ajvInstance } from '../utils/ajv-instance';
import { JSONSchemaType, ValidateFunction } from 'ajv';
import { DATABASE_TYPES, PATTERNS } from '../utils/constants';
import { dependencySchema } from './baseApiConfig';

const apiSchema: JSONSchemaType<ApiConfig> = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      nullable: true,
      errorMessage: 'The project id if provided must be a string.',
    },
    version: {
      type: 'string',
      nullable: true,
      errorMessage: 'The version if provided must be a string.',
    },
    workspaceId: {
      type: 'string',
      nullable: true,
      errorMessage: 'The workspace id if provided must be a string.',
    },
    type: {
      type: 'string',
      const: 'springboot',
      errorMessage: "The 'type' attribute must have the value 'springboot'.",
    },
    name: {
      type: 'string',
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage: {
        pattern:
          "The 'name' attribute must not be empty and cannot contain spaces, hyphens, or special characters. Only alphanumeric characters are allowed.",
      },
    },
    group: {
      type: 'string',
      pattern: '^[a-zA-Z0-9._]+$',
      errorMessage: {
        pattern:
          "The 'group' attribute  cannot be empty and must only contain alphanumeric characters without spaces or special symbols.",
      },
    },
    artifact: {
      type: 'string',
      pattern: '^[a-zA-Z0-9._-]+$',
      errorMessage: {
        pattern:
          "The 'artifact' attribute cannot be empty and must only contain alphanumeric characters without spaces or special characters.",
      },
    },

    database: {
      type: 'string',
      enum: DATABASE_TYPES,
      errorMessage: {
        enum: "The 'database' attribute cannot be empty and must be one of the following: 'PostgreSQL', 'MySQL', or 'Oracle'.",
      },
    },
    description: {
      type: 'string',
      nullable: true,
      errorMessage: {
        type: "The 'description' attribute must be a valid string.",
      },
    },
    package: {
      type: 'string',
      nullable: true,
    },
    packageName: {
      type: 'string',
      nullable: false,
    },
    projectStructureStyle: {
      type: 'string',
      nullable: false,
    },
    enableObservability: {
      type: 'boolean',
      nullable: false,
    },
    enableEntityRevision: {
      type: 'boolean',
      nullable: false,
    },
    igrpCoreVersion: {
      type: 'string',
      nullable: false,
    },
    springBootVersion: {
      type: 'string',
      nullable: true,
    },
    dependencies: {
      type: 'array',
      nullable: true,
      items: dependencySchema,
      errorMessage: 'The dependencies must be an array of valid dependency definitions.',
    },
    enableGraalVm: {
      type: 'boolean',
      nullable: false,
    },
  },
  required: [
    'type',
    'name',
    'group',
    'artifact',
    'packageName',
    'database',
    'projectStructureStyle',
    'enableObservability',
    'igrpCoreVersion',
    'enableGraalVm',
  ],
  additionalProperties: false,
  errorMessage: {
    required: {
      type: "The 'type' attribute is required and must be specified.",
      name: "The 'name' attribute is required and cannot be left blank.",
      group: "The 'group' attribute is required and must be provided.",
      artifact: "The 'artifact' attribute is required and cannot be empty.",
      packageName: "The 'packageName' attribute is required and cannot be empty.",
      database: "The 'database' attribute is required and must specify a valid database type.",
      projectStructureStyle:
        "The 'projectStructureStyle' attribute is required and must specify a valid database type.",
      dependencies:
        "The 'dependencies' attribute is required and must specify an array of valid dependencies.",
      enableObservability:
        "The 'enableObservability' attribute is required and must specify a valid boolean type.",
      enableGraalVm:
        "The 'enableGraalVm' attribute is required and must specify a valid boolean type.",
    },
    additionalProperties: 'Extra attributes are not allowed in the API configuration.',
  },
};

export const apiValidation: ValidateFunction<ApiConfig> = ajvInstance.compile<ApiConfig>(apiSchema);
