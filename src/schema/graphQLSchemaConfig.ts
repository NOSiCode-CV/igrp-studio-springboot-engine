import {ajvInstance} from '../utils/ajv-instance';
import {JSONSchemaType, ValidateFunction} from 'ajv';
import {GraphQLFieldDef, GraphQLMutation, GraphQLQuery, GraphQLSchemaConfig} from '../interfaces/types';
import {PATTERNS} from '../utils/constants';

const graphQLFieldDefSchema: JSONSchemaType<GraphQLFieldDef> = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage:
        'The field name must follow the naming convention (only alphabetic characters allowed) and cannot be empty.',
    },
    type: {
      type: 'string',
      errorMessage: "The 'type' field is required and must be a string.",
    },
    nullable: {
      type: 'boolean',
      nullable: true,
      errorMessage: "The 'nullable' field, if provided, must be a boolean.",
    },
    description: {
      type: 'string',
      nullable: true,
      errorMessage: "The 'description' field, if provided, must be a string.",
    },
  },
  required: ['name', 'type'],
  additionalProperties: false,
  errorMessage: {
    required: {
      name: 'The field name is required.',
      type: 'The field type is required.',
    },
    additionalProperties: 'No additional properties are allowed in a GraphQL field definition.',
  },
};

const graphQLQuerySchema: JSONSchemaType<GraphQLQuery> = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage:
        'The query name must follow the naming convention (only alphabetic characters allowed) and cannot be empty.',
    },
    args: {
      type: 'array',
      items: graphQLFieldDefSchema,
      nullable: true,
      errorMessage: "The 'args' field, if provided, must be an array of GraphQL field definitions.",
    },
    returnType: {
      type: 'string',
      nullable: true,
      errorMessage: "The 'returnType' field, if provided, must be a string.",
    },
    paginated: {
      type: 'boolean',
      nullable: true,
      errorMessage: "The 'paginated' field, if provided, must be a boolean.",
    },
  },
  required: ['name'],
  additionalProperties: false,
  errorMessage: {
    required: {
      name: 'The query name is required.',
    },
    additionalProperties: 'No additional properties are allowed in a GraphQL query definition.',
  },
};

const graphQLMutationSchema: JSONSchemaType<GraphQLMutation> = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage:
        'The mutation name must follow the naming convention (only alphabetic characters allowed) and cannot be empty.',
    },
    inputType: {
      type: 'string',
      nullable: true,
      errorMessage: "The 'inputType' field, if provided, must be a string.",
    },
    args: {
      type: 'array',
      items: graphQLFieldDefSchema,
      nullable: true,
      errorMessage: "The 'args' field, if provided, must be an array of GraphQL field definitions.",
    },
    returnType: {
      type: 'string',
      nullable: true,
      errorMessage: "The 'returnType' field, if provided, must be a string.",
    },
  },
  required: ['name'],
  additionalProperties: false,
  errorMessage: {
    required: {
      name: 'The mutation name is required.',
    },
    additionalProperties: 'No additional properties are allowed in a GraphQL mutation definition.',
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const graphQLSchemaConfigSchema: any = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      nullable: true,
      errorMessage: 'The id if provided must be a string.',
    },
    version: {
      type: 'string',
      nullable: true,
      errorMessage: 'The version if provided must be a string.',
    },
    type: {
      type: 'string',
      const: 'graphql',
      errorMessage: "The type must be 'graphql'.",
    },
    name: {
      type: 'string',
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage:
        'The name must follow the naming convention (only alphabetic characters allowed) and cannot be empty.',
    },
    module: {
      type: 'string',
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      nullable: true,
      errorMessage:
        'The module attribute must not be empty and can only contain alphanumeric characters without spaces or special characters.',
    },
    modelRef: {
      type: 'string',
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      nullable: true,
      errorMessage:
        "The 'modelRef' field, if provided, must follow the naming convention.",
    },
    fields: {
      type: 'array',
      items: graphQLFieldDefSchema,
      nullable: true,
      errorMessage: "The 'fields' field, if provided, must be an array of GraphQL field definitions.",
    },
    queries: {
      type: 'array',
      items: graphQLQuerySchema,
      nullable: true,
      errorMessage: "The 'queries' field, if provided, must be an array of GraphQL query definitions.",
    },
    mutations: {
      type: 'array',
      items: graphQLMutationSchema,
      nullable: true,
      errorMessage: "The 'mutations' field, if provided, must be an array of GraphQL mutation definitions.",
    },
    relations: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          entity: {
            type: 'string',
            errorMessage: "The 'entity' field is required.",
          },
          fieldName: {
            type: 'string',
            errorMessage: "The 'fieldName' field is required.",
          },
        },
        required: ['entity', 'fieldName'],
        additionalProperties: false,
      },
      nullable: true,
      errorMessage: "The 'relations' field, if provided, must be an array of relation definitions.",
    },
  },
  required: ['type', 'name'],
  additionalProperties: false,
  errorMessage: {
    required: {
      type: "The type attribute is required and must be 'graphql'.",
      name: 'The name attribute is required and must not be empty.',
    },
    additionalProperties: 'No additional properties are allowed in the GraphQL schema configuration.',
  },
};

export const validateGraphQLSchemaConfig: ValidateFunction<GraphQLSchemaConfig> =
  ajvInstance.compile<GraphQLSchemaConfig>(graphQLSchemaConfigSchema);
