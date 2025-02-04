import fs from 'fs-extra';
import { addDTO, serializeElement } from '../src';
import { DTOConfig, JsonConfig, SqlConfig, XmlConfig } from '../src/interfaces/types';

const TECHNICAL_OUTPUT_DIR = 'C:\\spring-engine\\demoTechnical'
const DOMAIN_OUTPUT_DIR = 'C:\\spring-engine\\demoDomain'

beforeAll(async () => {
  await fs.mkdir(TECHNICAL_OUTPUT_DIR, { recursive: true });
  await fs.mkdir(DOMAIN_OUTPUT_DIR, { recursive: true });
});

describe('DTO generator', () => {

  it('should create DTO for domain driven design project style', async() => {

    const domainTestCases: DTOConfig[] = [

      // Owner DTO

      {
        "type": "dto",
        "module": "core",
        "name": "Owner",
        "template": "record",
        "attributes": [
          {
            "type": "string",
            "objectType": "java",
            "name": "ownerName",
            "required": true
          },
          {
            "type": "string",
            "objectType": "java",
            "name": "contactNumber",
            "required": true,
            "regex": "^\\+?[0-9]{7,15}$"
          },
          {
            "type": "string",
            "objectType": "java",
            "name": "email",
            "required": false,
            "isEmail": true
          },
          {
            "type": "string",
            "objectType": "java",
            "name": "address",
            "required": false
          },
          {
            "type": "integer",
            "objectType": "java",
            "name": "animalsOwnedId",
            "required": false,
            "collectionType": "list"
          }
        ]
      },

      // Animal DTO

      {
        "type": "dto",
        "module": "core",
        "name": "Animal",
        "template": "record",
        "attributes": [
          {
            "type": "string",
            "objectType": "java",
            "name": "species",
            "required": true
          },
          {
            "type": "string",
            "objectType": "java",
            "name": "name",
            "required": true
          },
          {
            "type": "integer",
            "objectType": "java",
            "name": "age",
            "required": true,
            "positive": true
          },
          {
            "type": "boolean",
            "objectType": "java",
            "name": "vaccinated",
            "required": false
          },
          {
            "type": "OwnerDTO",
            "objectType": "dto",
            "name": "owner",
            "required": true
          }
        ]
      }

    ];

    for (const testCase of domainTestCases) {
      await addDTO(testCase, DOMAIN_OUTPUT_DIR);
    }
  })

  it('should create DTO for technical project style', async() => {

    const technicalTestCases: DTOConfig[] = [

      // User DTO

      {
        "type": "dto",
        "name": "User",
        "template": "classic",
        "attributes": [
          {
            "type": "string",
            "objectType": "java",
            "name": "username",
            "required": true
          },
          {
            "type": "string",
            "objectType": "java",
            "name": "email",
            "required": true,
            "isEmail": true
          },
          {
            "type": "string",
            "objectType": "java",
            "name": "password",
            "required": true,
            "regex": "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$"
          },
          {
            "type": "string",
            "objectType": "java",
            "name": "roles",
            "required": false,
            "collectionType": "list"
          },
          {
            "type": "date",
            "objectType": "java",
            "name": "lastLogin",
            "required": false
          }
        ]
      },

      {
        "type": "dto",
        "name": "Teste",
        "template": "classic",
        "attributes": [
          {
            "type": "string",
            "objectType": "java",
            "name": "field",
            "required": true
          },
        ]
      }

    ];

    for (const testCase of technicalTestCases) {
      await addDTO(testCase, TECHNICAL_OUTPUT_DIR);
    }
  })

  it('should create a DTO based on JSON serialization', async() => {

    const sampleJson = {
      name: "John Doe",
      age: 34,
      birthDate: "1995-09-10"
    }

    const json = JSON.stringify(sampleJson)

    const config : JsonConfig = {
      name: "Person",
      template: "classic",
      type: "dto",
      json: json
    };

    await serializeElement(config, TECHNICAL_OUTPUT_DIR);

  })

  it('should create a DTO based on XML serialization', async() => {

    const sampleXml: string = `
      <name>John Doe</name>
      <age>34</age>
      <birthDate>1995-09-10</birthDate>
  `;

    const config: XmlConfig = {
      name: "Person",
      template: "classic",
      type: "dto",
      xml: sampleXml
    };

    await serializeElement(config, TECHNICAL_OUTPUT_DIR);

  });

  it('should create a DTO based on SQL SELECT command serialization', async() => {

    const sampleSql = "SELECT name, age, birth_date FROM persons";

    const config: SqlConfig = {
      name: "Person",
      template: "classic",
      type: "dto",
      sql: sampleSql
    };

    await serializeElement(config, TECHNICAL_OUTPUT_DIR);

  });

});