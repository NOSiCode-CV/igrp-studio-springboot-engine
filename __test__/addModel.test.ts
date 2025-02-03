import fs from 'fs-extra';
import { ModelConfig } from '../src/interfaces/types';
import { addModel } from '../src';

const TECHNICAL_OUTPUT_DIR = 'C:\\spring-engine\\demoTechnical'
const DOMAIN_OUTPUT_DIR = 'C:\\spring-engine\\demoDomain'

beforeAll(async () => {
  await fs.mkdir(TECHNICAL_OUTPUT_DIR, { recursive: true });
  await fs.mkdir(DOMAIN_OUTPUT_DIR, { recursive: true });
});

describe('Model generator', () => {

  it('should create model for domain driven design project style', async() => {

    const domainTestCases: ModelConfig[] = [

      // Animal model

      {
        "type": "model",
        "name": "Animal",
        "tableName": "animal",
        "module": "core",
        "uniqueConstraints": [
          {
            "name": "UniqueAnimalName",
            "columns": ["name"]
          }
        ],
        "attributes": [
          {
            "type": "integer",
            "name": "id",
            "primaryKey": true,
            "generationType": "IDENTITY",
            "nullable": false
          },
          {
            "type": "string",
            "name": "name",
            "length": 255,
            "nullable": false
          },
          {
            "type": "string",
            "name": "species",
            "length": 100,
            "nullable": false
          },
          {
            "type": "date",
            "name": "birthDate",
            "nullable": true
          },
          {
            "type": "relation",
            "name": "owner",
            "relation": {
              "type": "ManyToOne",
              "cardinality": "twoWay",
              "entity": "Owner",
              "mappedBy": "animals",
              "referencedColumnName": "id"
            },
            "nullable": false
          }
        ],
        "crud": false,
        "audit": false
      },

      // Owner model

      {
        "type": "model",
        "name": "owner",
        "tableName": "owner",
        "module": "core",
        "attributes": [
          {
            "type": "integer",
            "name": "id",
            "primaryKey": true,
            "generationType": "IDENTITY",
            "nullable": false
          },
          {
            "type": "string",
            "name": "name",
            "length": 255,
            "nullable": false
          },
          {
            "type": "string",
            "name": "contactNumber",
            "length": 20,
            "nullable": false
          },
          {
            "type": "relation",
            "name": "animals",
            "relation": {
              "type": "OneToMany",
              "cardinality": "twoWay",
              "entity": "Animal",
              "mappedBy": "Owner",
              "joinTable": "owner_animal"
            },
            "nullable": true
          }
        ],
        "crud": false,
        "audit": true
      }


    ];

    for (const testCase of domainTestCases) {
      await addModel(testCase, DOMAIN_OUTPUT_DIR);
    }
  })

  it('should create DTO for technical project style', async() => {

    const technicalTestCases: ModelConfig[] = [

      // User

      {
        "type": "model",
        "name": "User",
        "tableName": "user",
        "attributes": [
          {
            "type": "integer",
            "name": "id",
            "primaryKey": true,
            "generationType": "IDENTITY",
            "nullable": false
          },
          {
            "type": "string",
            "name": "username",
            "length": 255,
            "nullable": false,
            "unique": true
          },
          {
            "type": "string",
            "name": "email",
            "length": 255,
            "nullable": false,
            "unique": true
          },
          {
            "type": "string",
            "name": "password",
            "length": 255,
            "nullable": false
          },
          {
            "type": "file",
            "name": "document",
            "nullable": false
          },
          {
            "type": "boolean",
            "name": "active",
            "nullable": false,
            "defaultValue": "true"
          }
        ],
        "crud": false,
        "audit": true
      },

      // Contact

      {
        "type": "model",
        "name": "Contact",
        "tableName": "contact",
        "attributes": [
          {
            "type": "integer",
            "name": "id",
            "primaryKey": true,
            "generationType": "IDENTITY",
            "nullable": false
          },
          {
            "type": "string",
            "name": "email",
            "length": 255,
            "nullable": false,
            "unique": true
          },
          {
            "type": "integer",
            "name": "phoneNumber",
            "length": 7,
            "nullable": false,
            "unique": true
          },
          {
            "type": "boolean",
            "name": "active",
            "nullable": false,
            "defaultValue": "true"
          },
          {
            "type": "relation",
            "name": "user",
            "relation": {
              "fieldName": "owner",
              "type": "OneToOne",
              "cardinality": "oneWay",
              "entity": "User"
            },
            "nullable": true
          }
        ],
        "crud": true,
        "audit": false
      },


    ];

    for (const testCase of technicalTestCases) {
      await addModel(testCase, TECHNICAL_OUTPUT_DIR);
    }
  })

});