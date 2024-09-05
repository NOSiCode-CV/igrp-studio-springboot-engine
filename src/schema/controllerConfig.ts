import { HTTP_METHOD_TYPES, PATTERNS, RESPONSE_TYPES } from "../utils/constants";
import { ajvInstance } from "../utils/ajv-instance";
import { JSONSchemaType, ValidateFunction } from "ajv";
import { ControllerAction, ControllerConfig, HttpMethod, PathParams } from "../interfaces/types"

// TODO: Error Messages
const pathParamsSchema: JSONSchemaType<PathParams> = {
  type: "object",
  properties: {
    // TODO Add validation
    type: { type: "string" },
    name: { type: "string", minLength: 2, pattern: PATTERNS.NO_SPACE_AND_HYPHEN },
  },
  required: ["type", "name"],
  additionalProperties: false,
};


// TODO Error Messages
const controllerActionSchema: JSONSchemaType<ControllerAction> = {
  type: "object",
  properties: {
    // TODO Better pattern
    path:   { type: "string", minLength: 2, pattern: PATTERNS.NO_SPACE_AND_HYPHEN},
    // TODO Better pattern
    name:   { type: "string", minLength: 2, pattern: PATTERNS.NO_SPACE_AND_HYPHEN},
    method: { type: "string", minLength: 3, enum: HTTP_METHOD_TYPES },
    pathParams: { type: "array", items: pathParamsSchema, nullable: true },
    response: { type: "string", minLength: 2, enum: RESPONSE_TYPES },
  },
  required: ["path", "name", "method", "response"],
  additionalProperties: false,
};

// TODO Error Messages
const controllerSchema: JSONSchemaType<ControllerConfig> = {
  type: "object",
  properties: {
    type: { type: "string", const: "controller" },
    name: { type: "string", minLength: 2, pattern: PATTERNS.NO_SPACE_AND_HYPHEN},
    basePath: { type: "string",  minLength: 2, pattern: PATTERNS.NO_SPACE_AND_HYPHEN},
    actions: { type: "array", items: controllerActionSchema },
  },
  required: ["type", "name", "basePath", "actions"],
  additionalProperties: false,
};

export const validateController: ValidateFunction<ControllerConfig> = ajvInstance.compile<ControllerConfig>(controllerSchema);


