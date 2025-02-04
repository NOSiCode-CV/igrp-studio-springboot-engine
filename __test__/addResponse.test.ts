import fs from 'fs-extra';
import { addResponse, serializeElement } from '../src';
import { JsonConfig, ResponseConfig, SqlConfig, XmlConfig } from '../src/interfaces/types';

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

  it('should create a response based on JSON serialization', async() => {

    const sampleJson = {
      name: "John Doe",
      age: 34,
      birthDate: "1995-09-10"
    }

    const json = JSON.stringify(sampleJson)

    const config : JsonConfig = {
      name: "PersonCreatedResponse",
      module: "core",
      template: "record",
      type: "dto",
      json: json
    };

    await serializeElement(config, TECHNICAL_OUTPUT_DIR);

  })

  it('should create a response based on XML serialization', async() => {

    const sampleXml = `
      <name>John Doe</name>
      <age>34</age>
      <birthDate>1995-09-10</birthDate>
  `;

    const config: XmlConfig = {
      name: "PersonCreatedResponse",
      module: "core",
      template: "record",
      type: "dto",
      xml: sampleXml
    };

    await serializeElement(config, TECHNICAL_OUTPUT_DIR);

  });

  it('should create a response based on SQL SELECT command serialization', async() => {

    const sampleSql = "SELECT name, age, birth_date FROM persons";

    const config: SqlConfig = {
      name: "PersonCreatedResponse",
      module: "core",
      template: "record",
      type: "dto",
      sql: sampleSql
    };

    await serializeElement(config, TECHNICAL_OUTPUT_DIR);

  });
  
});

describe('Response Module in technical project style', () => {
  it('should create the response class', async () => {
    await addResponse(technicalResponseConfig, TECHNICAL_OUTPUT_DIR);
  });

  it('should create a response based on JSON serialization', async() => {

    const sampleJson = {
      name: "John Doe",
      age: 34,
      birthDate: "1995-09-10"
    }

    const json = JSON.stringify(sampleJson)

    const config : JsonConfig = {
      name: "PersonCreatedResponse",
      template: "record",
      type: "dto",
      json: json
    };

    await serializeElement(config, TECHNICAL_OUTPUT_DIR);

  })

  it('should create a response based on XML serialization', async() => {

    const sampleXml = `
      <name>John Doe</name>
      <age>34</age>
      <birthDate>1995-09-10</birthDate>
  `;

    const config: XmlConfig = {
      name: "PersonCreatedResponse",
      template: "record",
      type: "dto",
      xml: sampleXml
    };

    await serializeElement(config, TECHNICAL_OUTPUT_DIR);

  });

  it('should create a response based on SQL SELECT command serialization', async() => {

    const sampleSql = "SELECT name, age, birth_date FROM persons";

    const config: SqlConfig = {
      name: "PersonCreatedResponse",
      template: "record",
      type: "dto",
      sql: sampleSql
    };

    await serializeElement(config, TECHNICAL_OUTPUT_DIR);

  });
  
});