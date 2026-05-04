import {ajvInstance} from '../utils/ajv-instance';
import {ValidateFunction} from 'ajv';
import {GraphQLSchemaConfig} from '../interfaces/types';
import {PATTERNS} from '../utils/constants';

const permissionSchema = {
  type: 'object',
  nullable: true,
  properties: {
    items: {
      type: 'array',
      items: { type: 'string' },
      minItems: 1,
      errorMessage: "The 'permission.items' field must be a non-empty array of strings",
    },
    operator: {
      type: 'string',
      enum: ['AND', 'OR'],
      nullable: true,
      errorMessage: "The 'permission.operator' must be 'AND' or 'OR' if provided",
    },
  },
  required: ['items'],
  additionalProperties: false,
};

const rolesSchema = {
  type: 'array',
  nullable: true,
  items: { type: 'string' },
  errorMessage: "The 'roles' field must be an array of strings",
};

const graphQLParamSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage: 'The param name must follow the naming convention and cannot be empty.',
    },
    objectType: {
      type: 'string',
      enum: ['java', 'graphqlInput'],
      errorMessage: "The 'objectType' must be 'java' (scalar) or 'graphqlInput' (DTO).",
    },
    type: {
      type: 'string',
      errorMessage: "The 'type' field is required and must be a string.",
    },
    required: {
      type: 'boolean',
      nullable: true,
      errorMessage: "The 'required' field, if provided, must be a boolean.",
    },
    module: {
      type: 'string',
      nullable: true,
      errorMessage: "The 'module' field, if provided, must be a string.",
    },
  },
  required: ['name', 'objectType', 'type'],
  additionalProperties: false,
};

const graphQLReturnSchema = {
  type: 'object',
  nullable: true,
  properties: {
    objectType: {
      type: 'string',
      enum: ['java', 'graphqlType'],
      errorMessage: "The 'objectType' must be 'java' (scalar) or 'graphqlType' (manifest reference).",
    },
    type: {
      type: 'string',
      errorMessage: "The 'type' field is required and must be a string.",
    },
    module: {
      type: 'string',
      nullable: true,
      errorMessage: "The 'module' field, if provided, must be a string.",
    },
  },
  required: ['objectType', 'type'],
  additionalProperties: false,
};

const graphQLQuerySchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage: 'The query name must follow the naming convention and cannot be empty.',
    },
    params: {
      type: 'array',
      items: graphQLParamSchema,
      nullable: true,
      errorMessage: "The 'params' field, if provided, must be an array of param definitions.",
    },
    return: graphQLReturnSchema,
    collectionType: {
      type: 'string',
      enum: ['single', 'list', 'paginated'],
      nullable: true,
      errorMessage: "The 'collectionType' must be 'single', 'list', or 'paginated'.",
    },
    roles: rolesSchema,
    permission: permissionSchema,
  },
  required: ['name'],
  additionalProperties: false,
  errorMessage: {
    required: { name: 'The query name is required.' },
    additionalProperties: 'No additional properties are allowed in a query definition.',
  },
};

const graphQLMutationSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage: 'The mutation name must follow the naming convention and cannot be empty.',
    },
    params: {
      type: 'array',
      items: graphQLParamSchema,
      nullable: true,
      errorMessage: "The 'params' field, if provided, must be an array of param definitions.",
    },
    return: graphQLReturnSchema,
    roles: rolesSchema,
    permission: permissionSchema,
  },
  required: ['name'],
  additionalProperties: false,
  errorMessage: {
    required: { name: 'The mutation name is required.' },
    additionalProperties: 'No additional properties are allowed in a mutation definition.',
  },
};

const graphQLSubscriptionSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage: 'The subscription name must follow the naming convention and cannot be empty.',
    },
    params: {
      type: 'array',
      items: graphQLParamSchema,
      nullable: true,
      errorMessage: "The 'params' field, if provided, must be an array of param definitions.",
    },
    return: graphQLReturnSchema,
  },
  required: ['name'],
  additionalProperties: false,
  errorMessage: {
    required: { name: 'The subscription name is required.' },
    additionalProperties: 'No additional properties are allowed in a subscription definition.',
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
      errorMessage: 'The name must follow the naming convention and cannot be empty.',
    },
    module: {
      type: 'string',
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      nullable: true,
      errorMessage: 'The module must follow the naming convention.',
    },
    typeRef: {
      type: 'string',
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      nullable: true,
      errorMessage: "The 'typeRef' field, if provided, must follow the naming convention.",
    },
    queries: {
      type: 'array',
      items: graphQLQuerySchema,
      nullable: true,
      errorMessage: "The 'queries' field, if provided, must be an array of query definitions.",
    },
    mutations: {
      type: 'array',
      items: graphQLMutationSchema,
      nullable: true,
      errorMessage: "The 'mutations' field, if provided, must be an array of mutation definitions.",
    },
    subscriptions: {
      type: 'array',
      items: graphQLSubscriptionSchema,
      nullable: true,
      errorMessage: "The 'subscriptions' field, if provided, must be an array of subscription definitions.",
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
