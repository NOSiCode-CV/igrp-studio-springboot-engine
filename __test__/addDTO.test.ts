import fs from 'fs-extra';
import { addDTO, serializeElement } from '../src';
import { DTOConfig, JsonConfig, SqlConfig, XmlConfig } from '../src/interfaces/types';
// @ts-ignore
import { DOMAIN_OUTPUT_DIR, TECHNICAL_OUTPUT_DIR, TECHNICAL_OUTPUT_DIR_OTHER, TEST_OUTPUT_DIR } from './outputDirPath';

beforeAll(async () => {
  await fs.mkdir(TECHNICAL_OUTPUT_DIR, { recursive: true });
  await fs.mkdir(DOMAIN_OUTPUT_DIR, { recursive: true });
});

describe('DTO generator', () => {

  it('should create DTO for domain driven design project style', async () => {

    const domainTestCases: DTOConfig[] = [
      {
        "type": "dto",
        "module": "shared",
        "name": "demo",
        "template": "classic",
        "enableCustonValidation": true,
        "attributes": [
          {
            "name": "uriType",
            "objectType": "java",
            "type": "uri",
            "required": false,
            "before": false,
            "after": false,
            "positive": false,
            "regex": "",
            "isEmail": false,
            "isUrl": false,
            "primaryKey": false,
            "collectionType": ""
          }
        ],
        "id": "xr5l53jn5e"
      },
      {
        "type": "dto",
        "module": "shared",
        "name": "outro",
        "template": "classic",
        "enableCustonValidation": true,
        "attributes": [
          {
            "name": "uriType",
            "objectType": "java",
            "type": "string",
            "required": false,
            "before": false,
            "after": false,
            "positive": false,
            "regex": "",
            "isEmail": false,
            "isUrl": false,
            "primaryKey": false,
            "collectionType": ""
          }
        ],
        "id": "xr5l53jn5e44"
      }


    ];

    for (const testCase of domainTestCases) {
      await addDTO(testCase, DOMAIN_OUTPUT_DIR);
    }
  })

  it('should create DTO for technical project style', async () => {

    const technicalTestCases: DTOConfig[] = [
      {
        "type": "dto",
        "module": "shared",
        "name": "demo",
        "template": "classic",
        "enableCustonValidation": true,
        "attributes": [
          {
            "name": "uriType",
            "objectType": "java",
            "type": "uri",
            "required": false,
            "before": false,
            "after": false,
            "positive": false,
            "regex": "",
            "isEmail": false,
            "isUrl": false,
            "primaryKey": false,
            "collectionType": ""
          }
        ],
        "id": "xr5l53jn5e"
      },
      {
        "type": "dto",
        "module": "shared",
        "name": "outro",
        "template": "classic",
        "enableCustonValidation": true,
        "attributes": [
          {
            "name": "uriType",
            "objectType": "java",
            "type": "string",
            "required": false,
            "before": false,
            "after": false,
            "positive": false,
            "regex": "",
            "isEmail": false,
            "isUrl": false,
            "primaryKey": false,
            "collectionType": ""
          }
        ],
        "id": "xr5l53jn5e44"
      }
    ];

    for (const testCase of technicalTestCases) {
      await addDTO(testCase, TECHNICAL_OUTPUT_DIR_OTHER);
    }
  })

  it('should create DTO for test ', async () => {

    const testCases: DTOConfig[] = [
      {"type":"dto","module":"shared","name":"User","template":"classic","attributes":[{"name":"igrpUsername","objectType":"java","type":"string","required":false,"before":false,"after":false,"positive":false,"isEmail":false,"isUrl":false,"primaryKey":false},{"name":"fullname","objectType":"java","type":"string","required":false,"before":false,"after":false,"positive":false,"isEmail":false,"isUrl":false,"primaryKey":false},{"name":"email","objectType":"java","type":"string","required":false,"before":false,"after":false,"positive":false,"isEmail":false,"isUrl":false,"primaryKey":false},{"name":"roles","objectType":"java","type":"string","required":false,"before":false,"after":false,"positive":false,"isEmail":false,"isUrl":false,"primaryKey":false,"collectionType":"collection"},{"name":"departments","objectType":"java","type":"string","required":false,"before":false,"after":false,"positive":false,"isEmail":false,"isUrl":false,"primaryKey":false,"collectionType":"collection"},{"name":"apps","objectType":"java","type":"string","required":false,"before":false,"after":false,"positive":false,"isEmail":false,"isUrl":false,"primaryKey":false,"collectionType":"collection"},{"name":"imageUrl","objectType":"java","type":"string","required":false,"before":false,"after":false,"positive":false,"isEmail":false,"isUrl":false,"primaryKey":false},{"name":"signatureUrl","objectType":"java","type":"string","required":false,"before":false,"after":false,"positive":false,"isEmail":false,"isUrl":false,"primaryKey":false},{"name":"status","objectType":"java","type":"string","required":false,"before":false,"after":false,"positive":false,"isEmail":false,"isUrl":false,"primaryKey":false}],"id":"plmvfsaeug"}
    ];

    for (const testCase of testCases) {
      await addDTO(testCase, TEST_OUTPUT_DIR);
    }
  })



  /*it('should create a DTO based on JSON serialization', async() => {
 
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
 
  });*/

});