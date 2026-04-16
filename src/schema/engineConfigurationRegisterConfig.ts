import { JSONSchemaType, ValidateFunction } from 'ajv';
import {
    EngineConfigurationSettings
} from '../interfaces/types';
import { ajvInstance } from '../utils/ajv-instance';

const engineConfigurationRegistrationConfigSchema: JSONSchemaType<EngineConfigurationSettings> = {
    type: 'object',
    properties: {
        environment: {
            type: 'string',
            nullable: true,
            errorMessage:
                'The engine version attribute must be a valid string.',
        }
    },
    required: [],
    additionalProperties: false,
};

export const engineConfigurationRegistrationValidate: ValidateFunction<EngineConfigurationSettings> =
    ajvInstance.compile<EngineConfigurationSettings>(engineConfigurationRegistrationConfigSchema);
