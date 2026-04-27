import {ajvInstance} from '../utils/ajv-instance';
import {ValidateFunction} from 'ajv';
import {GraphQLSchemaConfig} from '../interfaces/types';
import {PATTERNS} from '../utils/constants';

const graphQLFieldDefSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage: 'The field name must follow the naming convention and cannot be empty.',
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
};

const graphQLQuerySchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage: 'The query name must follow the naming convention and cannot be empty.',
    },
    args: {
      type: 'array',
      items: graphQLFieldDefSchema,
      nullable: true,
      errorMessage: "The 'args' field, if provided, must be an array of field definitions.",
    },
    returnTypeRef: {
      type: 'string',
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      nullable: true,
      errorMessage: "The 'returnTypeRef' field, if provided, must follow the naming convention.",
    },
    returnType: {
      type: 'string',
      nullable: true,
      errorMessage: "The 'returnType' field, if provided, must be a string (primitive: Boolean, String, Int).",
    },
    collectionType: {
      type: 'string',
      enum: ['single', 'list', 'paginated'],
      nullable: true,
      errorMessage: "The 'collectionType' must be 'single', 'list', or 'paginated'.",
    },
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
    inputRef: {
      type: 'string',
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      nullable: true,
      errorMessage: "The 'inputRef' field, if provided, must follow the naming convention.",
    },
    args: {
      type: 'array',
      items: graphQLFieldDefSchema,
      nullable: true,
      errorMessage: "The 'args' field, if provided, must be an array of field definitions.",
    },
    returnTypeRef: {
      type: 'string',
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      nullable: true,
      errorMessage: "The 'returnTypeRef' field, if provided, must follow the naming convention.",
    },
    returnType: {
      type: 'string',
      nullable: true,
      errorMessage: "The 'returnType' field, if provided, must be a string (primitive: Boolean, String, Int).",
    },
    collectionType: {
      type: 'string',
      enum: ['single', 'list', 'paginated'],
      nullable: true,
      errorMessage: "The 'collectionType' must be 'single', 'list', or 'paginated'.",
    },
  },
  required: ['name'],
  additionalProperties: false,
  errorMessage: {
    required: { name: 'The mutation name is required.' },
    additionalProperties: 'No additional properties are allowed in a mutation definition.',
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
    inputRefs: {
      type: 'array',
      items: { type: 'string', pattern: PATTERNS.NAME_VALIDATION_PATTERN },
      nullable: true,
      errorMessage: "The 'inputRefs' field, if provided, must be an array of names.",
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
