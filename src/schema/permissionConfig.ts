import { JSONSchemaType, ValidateFunction } from "ajv";
import { IEndpoint, PermissionConfig } from "../interfaces/types";
import { CRUD_DISABLED_OPTIONS, HTTP_METHOD_TYPES, PATTERNS } from "../utils/constants";
import { ajvInstance } from "../utils/ajv-instance";

const permissionEndpointSchema: JSONSchemaType<IEndpoint> ={
  type: 'object',
  properties: {
    type: {
      type: "string",
      errorMessage: 'The type must be.'
    },
    resource: {
      type:"string",
    },
    method: { 
      type: 'string',
      errorMessage: `method type can only be one of ${HTTP_METHOD_TYPES} or ${CRUD_DISABLED_OPTIONS}`
    },
    path: {
      type: 'string'
    }
  },
  required: ["type", "resource", "method", "path"],
  additionalProperties: false,
}

const permissionSchema:JSONSchemaType<PermissionConfig> = {
  type: 'object',
  properties: {
    type: {
      type: "string",
      const:"permission",
      errorMessage: 'The type must be "permission".'
    },
    name: {
      type:"string",
      pattern: PATTERNS.NAME_VALIDATION_PATTERN,
      errorMessage: 'The permission name can not include space or hyphen'
    },
    description: {
      type: 'string'
    },
    endpoints: {
      type: 'array',
      items: permissionEndpointSchema
    }    
  },
  required: ['type',"description","endpoints","name"],
  additionalProperties: false,
  errorMessage: {
    required: {
      type: 'The type is required and must be "permission".',
      name: 'The permission name can not include space or hyphen',
      endpoints: 'The endpoints array is required and can be empty.'
    },
    additionalProperties: 'No additional properties are allowed in the permission configuration schema.'
  }
}

export const validatePermission: ValidateFunction<PermissionConfig> =
  ajvInstance.compile<PermissionConfig>(permissionSchema);