import {DdlConfig, JsonConfig, ModelConfig, SqlConfig, XmlConfig} from '../src/interfaces/types';
import {addModel, setEngineConfiguration} from '../src';
// @ts-ignore
import {DOMAIN_OUTPUT_DIR, DOMAIN_OUTPUT_DIR2, TECHNICAL_OUTPUT_DIR} from './outputDirPath';

beforeAll(async () => {
  //await fs.mkdir(TECHNICAL_OUTPUT_DIR, { recursive: true });
  //await fs.mkdir(DOMAIN_OUTPUT_DIR, { recursive: true });
  setEngineConfiguration({ environment: 'development' });

});

describe('Model generator', () => {

  it('should create model for domain driven design project style', async () => {

    const domainTestCases: ModelConfig[] = [

      // Animal model

      {
        "id": "mgg6olyps8",
        "type": "model",
        "name": "owner",
        "tableName": "owner",
        "module": "shared",
        "attributes": [
          {
            "type": "uuid",
            "name": "id",
            "primaryKey": true,
            "generationType": "NONE",
            "nullable": false
          },
          {
            "type": "string",
            "name": "nome",
            "length": 255,
            "nullable": true
          },
          {
            "type": "text",
            "name": "json",
            "length": 20,
            "nullable": false
          }
        ],
        "crud": false,
        "audit": true
      },

      {
        "type": "model",
        "name": "owner1",
        "tableName": "owner",
        "module": "shared",
        "attributes": [
          {
            "type": "uuid",
            "name": "id",
            "primaryKey": true,
            "generationType": "NONE",
            "nullable": false
          },
          {
            "type": "string",
            "name": "nome1",
            "length": 255,
            "nullable": true
          },
          {
            "type": "text",
            "name": "json1",
            "length": 20,
            "nullable": false
          }
        ],
        "crud": false,
        "audit": true
      }


    ];

    for (const testCase of domainTestCases) {
      await addModel(testCase, TECHNICAL_OUTPUT_DIR);
    }
  })

  it('should create model for technical project style', async () => {

    const technicalTestCases: ModelConfig[] = [

      {
        "type": "model",
        "module": "shared",
        "name": "DemoEntity",
        "tableName": "t_demo",
        "audit": true,
        "crud": false,
        "revision": false,
        "attributes": [
          {
            "name": "id",
            "type": "integer",
            "length": 255,
            "nullable": true,
            "unique": false,
            "primaryKey": true,
            "generationType": "IDENTITY",
            "skipFieldRevision": false
          },
          {
            "name": "nome",
            "type": "string",
            "length": 255,
            "nullable": false,
            "unique": false,
            "primaryKey": false,
            "skipFieldRevision": false
          }
        ],
        "id": "14srrzv51e",
        "relationReference": [
          {
            "type": "OneToMany",
            "entity": "TesteEntity",
            "fetchType": "lazy",
            "fieldName": "teste",
            "mappedBy": "demos",
            "module": "shared"
          }
        ],
        "uniqueConstraints": [],
        "indexes": []
      },

      {
        "type": "model",
        "module": "shared",
        "name": "TesteEntity",
        "tableName": "t_teste",
        "audit": true,
        "crud": false,
        "revision": false,
        "attributes": [
          {
            "name": "id",
            "type": "integer",
            "length": 255,
            "nullable": true,
            "unique": false,
            "primaryKey": true,
            "generationType": "IDENTITY",
            "skipFieldRevision": false
          },
          {
            "name": "demos",
            "type": "relation",
            "length": 255,
            "nullable": true,
            "unique": false,
            "primaryKey": false,
            "skipFieldRevision": false,
            "relation": {
              "type": "OneToMany",
              "entity": "DemoEntity",
              "referencedColumnName": "id",
              "cardinality": "twoWay",
              "fetchType": "lazy",
              "mappedBy": "teste",
              "module": "shared",
              "orphanRemoval": false
            }
          }
        ],
        "id": "umaluzndao",
        "uniqueConstraints": [],
        "indexes": []
      }


    ];

    for (const testCase of technicalTestCases) {
      await addModel(testCase, TECHNICAL_OUTPUT_DIR);
    }
  })

  it('should create a model based on JSON serialization', async () => {

    const sampleJson = {
      id: 1,
      name: "XPTO LLC",
      foundingYear: 1996,
      foundingDate: "1996-04-01"
    }

    const json = JSON.stringify(sampleJson)

    const config: JsonConfig = {
      name: "Company",
      template: "classic",
      type: "model",
      json: json
    };

    // await serializeElement(config, TECHNICAL_OUTPUT_DIR);

  })

  it('should create a model based on XML serialization', async () => {

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

    //  await serializeElement(config, TECHNICAL_OUTPUT_DIR);

  });

  it('should create a model based on SQL SELECT command serialization', async () => {

    const sampleSql = "SELECT 1 as id, 'XPTO LLC' as name, 1996 as foundingYear, '1996-04-01' as foundingDate FROM companies";

    const config: SqlConfig = {
      name: "Company",
      template: "classic",
      type: "model",
      sql: sampleSql
    };

    // await serializeElement(config, TECHNICAL_OUTPUT_DIR);

  });

  it('should create model with custom columnName attribute', async () => {
    const config: ModelConfig = {
      id: 'col_name_test',
      type: 'model',
      name: 'Product',
      tableName: 'product',
      attributes: [
        {
          type: 'integer',
          name: 'id',
          primaryKey: true,
          generationType: 'IDENTITY',
          nullable: false,
        },
        {
          type: 'string',
          name: 'productName',
          columnName: 'product_name',  // custom column name
          length: 255,
          nullable: false,
        },
        {
          type: 'string',
          name: 'shortCode',
          // no columnName — fallback to toLowerCase('shortCode') = 'shortcode'
          length: 50,
          nullable: true,
        },
      ],
      uniqueConstraints: [
        {
          name: 'uq_product_name',
          columns: ['productName'],  // engine resolves to 'product_name'
        },
      ],
      indexes: [
        {
          name: 'idx_short_code',
          columns: ['shortCode'],  // engine resolves to 'shortcode'
          unique: false,
        },
      ],
      crud: false,
      audit: false,
    };

    await addModel(config, TECHNICAL_OUTPUT_DIR);
  });

  it('should create a model based on DDL create table script serialization', async () => {

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

    // await serializeElement(config, TECHNICAL_OUTPUT_DIR);

  });

});