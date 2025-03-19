import fs from 'fs-extra';
import { DdlConfig, JsonConfig, ModelConfig, SqlConfig, XmlConfig } from '../src/interfaces/types';
import { addModel, serializeElement } from '../src';
// @ts-ignore
import { DOMAIN_OUTPUT_DIR, TECHNICAL_OUTPUT_DIR } from './outputDirPath';

beforeAll(async () => {
  //await fs.mkdir(TECHNICAL_OUTPUT_DIR, { recursive: true });
  await fs.mkdir(DOMAIN_OUTPUT_DIR, { recursive: true });
});

describe('Model generator', () => {

  it('should create model for domain driven design project style', async() => {

    const domainTestCases: ModelConfig[] = [

      // Animal model

      {
        "id": "dspza5xl7e",
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
              "fetchType": "lazy",
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
        "id": "mgg6olyps8",
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
              "fetchType": "lazy",
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
      //await addModel(testCase, DOMAIN_OUTPUT_DIR);
    }
  })

  it('should create model for technical project style', async() => {

    const technicalTestCases: ModelConfig[] = [

      // User

      {
        "id": "sfk6hpjtcg",
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
            "type": "Level",
            "objectType": "enum",
            "name": "userLevelNew",
            "nullable": false,
            "unique": true,
            "skipFieldRevision": true
          },
          {
            "type": "Level",
            "objectType": "enum",
            "name": "userLevel",
            "length": 255,
            "nullable": false,
            "unique": true
          },
          {
            "type": "string",
            "name": "email",
            "length": 255,
            "nullable": false,
            "unique": true,
            "skipFieldRevision": true
          },
          {
            "type": "string",
            "name": "password",
            "length": 25,
            "nullable": false,
            "skipFieldRevision": true
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
        "audit": true,
        "revision": true
      },

      // Contact

      {
        "id": "ylmvzj5cuy",
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
              "fetchType": "lazy",
              "fieldName": "owner",
              "type": "OneToOne",
              "cardinality": "oneWay",
              "entity": "User"
            },
            "nullable": true
          }
        ],
        "crud": true,
        "audit": false,
        "revision": false
      },


    ];

    for (const testCase of technicalTestCases) {
      await addModel(testCase, TECHNICAL_OUTPUT_DIR);
    }
  })

  it('should create a model based on JSON serialization', async() => {

    const sampleJson = {
      id: 1,
      name: "XPTO LLC",
      foundingYear: 1996,
      foundingDate: "1996-04-01"
    }

    const json = JSON.stringify(sampleJson)

    const config : JsonConfig = {
      name: "Company",
      template: "classic",
      type: "model",
      json: json
    };

    await serializeElement(config, TECHNICAL_OUTPUT_DIR);

  })

  it('should create a model based on XML serialization', async() => {

    const sampleXml = `
      <id>1</id>
      <name>XPTO LLC</name>
      <foundingYear>1996</foundingYear>
      <foundingDate>1996-04-01</foundingDate>
  `;

    const config: XmlConfig = {
      name: "Company",
      template: "classic",
      type: "model",
      xml: sampleXml
    };

    await serializeElement(config, TECHNICAL_OUTPUT_DIR);

  });

  it('should create a model based on SQL SELECT command serialization', async() => {

    const sampleSql = "SELECT 1 as id, 'XPTO LLC' as name, 1996 as foundingYear, '1996-04-01' as foundingDate FROM companies";

    const config: SqlConfig = {
      name: "Company",
      template: "classic",
      type: "model",
      sql: sampleSql
    };

    await serializeElement(config, TECHNICAL_OUTPUT_DIR);

  });

  it('should create a model based on DDL create table script serialization', async() => {

    const sampleDdl = `
      CREATE TABLE companies (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) UNIQUE NOT NULL,
          foundingYear INT,
          foundingDate DATE );`;

    const config: DdlConfig = {
      name: "Company",
      template: "classic",
      type: "model",
      ddl: sampleDdl
    };

    await serializeElement(config, TECHNICAL_OUTPUT_DIR);

  });

});