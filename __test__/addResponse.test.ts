import fs from 'fs-extra';
import { addController, addResponse } from '../src';
import { ControllerConfig, ResponseConfig } from '../src/interfaces/types';
import { debugSchema } from '../src/schema/controllerConfig';

const OUTPUT_DIR = 'C:\\spring-engine\\generatedNewVersion'
const responseConfig: ResponseConfig = {
  template: "record",
  statusCode: "200",
  name: "TestResponseIsolated",
  description: "OK",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          newField1: {
            type: "string",
            description: "New field 1",
            example: "newValue1",
            default: "newValue"
          }
        }
      }
    }
  }
}

beforeAll(async () => {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
});

afterAll(async () => {
  // await fs.rm(OUTPUT_DIR, { recursive: true });
});

describe('Response Module', () => {
  it('should create the response class', async () => {
    await addResponse(responseConfig, OUTPUT_DIR);
  });
});
