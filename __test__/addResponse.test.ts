import fs from 'fs-extra';
import { addResponse } from '../src';
import { ResponseConfig } from '../src/interfaces/types';

const TECHNICAL_OUTPUT_DIR = 'C:\\spring-engine\\demoTechnical'
const DOMAIN_OUTPUT_DIR = 'C:\\spring-engine\\demoDomain'

const domainResponseConfig: ResponseConfig = {
  template: "record",
  statusCode: "200",
  module: "core",
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

const technicalResponseConfig: ResponseConfig = {
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
  await fs.mkdir(TECHNICAL_OUTPUT_DIR, { recursive: true });
  await fs.mkdir(DOMAIN_OUTPUT_DIR, { recursive: true });
});

afterAll(async () => {
  // await fs.rm(OUTPUT_DIR, { recursive: true });
});

describe('Response Module in domain driven design project style', () => {
  it('should create the response class', async () => {
    await addResponse(domainResponseConfig, DOMAIN_OUTPUT_DIR);
  });
});

describe('Response Module in technical project style', () => {
  it('should create the response class', async () => {
    await addResponse(technicalResponseConfig, TECHNICAL_OUTPUT_DIR);
  });
});