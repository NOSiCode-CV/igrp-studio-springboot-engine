import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import addErrors from 'ajv-errors';

const ajvInstance = new Ajv({ allErrors: true });
addFormats(ajvInstance);
addErrors(ajvInstance);

export { ajvInstance };
