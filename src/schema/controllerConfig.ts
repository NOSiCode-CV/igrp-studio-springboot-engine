import { HTTP_METHOD_TYPES, MIME_TYPES, PARAMS_TYPES, PATTERNS, RESPONSE_TYPES } from '../utils/constants';
import { ajvInstance } from '../utils/ajv-instance';
import { JSONSchemaType, ValidateFunction } from 'ajv';
import { ControllerAction, ControllerConfig, RequestParams, } from '../interfaces/types';

const pathParamsSchema: JSONSchemaType<RequestParams> = {
  type: 'object',
  properties: {
    type: { 
      type: 'string', 
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      enum: PARAMS_TYPES,
      errorMessage: `Param type not valid. It must be one of ${PARAMS_TYPES}`
    },
    name: { 
      type: 'string', pattern: PATTERNS.PARAMS_VALIDATION,
      errorMessage: 'The param name attribute must not be empty and cannot contain spaces, hyphens, or special characters. Only alphanumeric characters are allowed'
    },
  },
  required: ['type', 'name'],
  additionalProperties: false,
  errorMessage: {
    required: {
      type: 'The param type is required and must not be empty.',
      name: 'The param name is required and must not be empty.'
    }
  }
};

const controllerActionSchema: JSONSchemaType<ControllerAction> = {
  type: 'object',
  properties: {
    path: { 
      type: 'string', 
      pattern: PATTERNS.RELATIONS_PATTERN,
      nullable: true,
      errorMessage:'The path attribute must only contain characters whithout spaces or special characters.'
    },
    actionName: { 
      type: 'string', 
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage: 'the ActionName attribute can only contain characters whithout spaces or special characters.'
    },
    method: { 
      type: 'string', 
      enum: HTTP_METHOD_TYPES,
      errorMessage: `method type can only be one of ${HTTP_METHOD_TYPES}`
    },
    requestBody: { 
      type: 'string', 
      pattern: PATTERNS.RELATIONS_PATTERN,
      nullable: true,
      errorMessage: `the requestBody attribute can only contain characters whithout spaces or special characters`
    },
    requestParams: { 
      type: 'array', 
      items: pathParamsSchema, 
      nullable: true,
      errorMessage: 'Request params can only contain a characters without spaces or special characters.'
    },
    pathVariables: { 
      type: 'array', 
      items: pathParamsSchema, 
      nullable: true,
      errorMessage: 'Path params can only contain a characters without spaces or special characters.'
    },
    permission: {
      type: 'string',
      nullable: true
    },
    response: { 
      type: 'string',
      errorMessage: `Response type can only be one of [${RESPONSE_TYPES}]`
    },
    accepts: {
      type: "string",
      enum: MIME_TYPES,
      nullable: true,
      errorMessage: `Accepts type can only be one of ${MIME_TYPES}`
    },
    contentType: {
      type: "string",
      enum: MIME_TYPES,
      nullable: true,
      errorMessage: `ContentType type can only be one of ${MIME_TYPES}`
    }
  },
  required: ['actionName', 'method', 'response'],
  additionalProperties: false,
  errorMessage: {
    required: {
      path:'Path is required',
      name:'name is required',
      method:'method is required',
      response:'response type is required',
    }
  }
};

const controllerSchema: JSONSchemaType<ControllerConfig> = {
  type: 'object',
  properties: {
    type: { 
      type: 'string', 
      const: 'controller',
      errorMessage: `The type must be 'controller'.`
    },
    name: { 
      type: 'string', 
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage: 'The name attribute must not be empty and can only contain alphanumeric characters without spaces or special characters.'
    },
    basePath: { 
      type: 'string',
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage: 'The basePath attribute can only contain alphanumeric characters without spaces or special characters.'
    },
    actions: { 
      type: 'array', 
      items: controllerActionSchema,
      errorMessage: 'The actions array must contain valid controller actions.'
    },
  },
  required: ['type', 'name', 'basePath', 'actions'],
  additionalProperties: false,
  errorMessage: {
    required: {
      type: 'The type attribute is required and must not be empty.',
      name: 'The name attribute is required and must not be empty.',
      basePath: 'The basePath attribute is required and must not be empty.',
      actions: 'At least one action is required.'
    },
    additionalProperties: 'No additional properties are allowed in the controller schema.'
  }
};


export const validateController: ValidateFunction<ControllerConfig> =
  ajvInstance.compile<ControllerConfig>(controllerSchema);
