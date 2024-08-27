import { PATTERNS } from "../utils/constants";
import { ajvInstance } from "../utils/ajv-instance";
import { JSONSchemaType, ValidateFunction } from "ajv";
import { ControllerAction, ControllerConfig, HttpMethod, PathParams } from "../interfaces/types"


const pathParamsSchema: JSONSchemaType<PathParams> = {
  type: "object",
  properties: {
    type: { type: "string" },
    name: { type: "string", minLength: 2, pattern: PATTERNS.NO_SPACE_AND_HYPHEN },
  },
  required: ["type", "name"],
  additionalProperties: false,
};

const controllerActionSchema: JSONSchemaType<ControllerAction> = {
  type: "object",
  properties: {
    path:   { type: "string", minLength: 2, pattern: PATTERNS.NO_SPACE_AND_HYPHEN},
    name:   { type: "string", minLength: 2, pattern: PATTERNS.NO_SPACE_AND_HYPHEN},
    method: { type: "string", minLength: 3, pattern: PATTERNS.NO_SPACE_AND_HYPHEN },
    pathParams: { type: "array", items: pathParamsSchema, nullable: true },
    response: { type: "string", minLength: 2, pattern: PATTERNS.NO_SPACE_AND_HYPHEN },
  },
  required: ["path", "name", "method", "response"],
  additionalProperties: false,
};


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


