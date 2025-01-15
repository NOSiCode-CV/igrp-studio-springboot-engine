import path from 'path';
import fs from 'fs-extra';
import { ApiConfig, ModelConfig } from '../src/interfaces/types';
import { addModel } from '../src/index';
import { saveBaseApiFileConfig } from '../src/modules/baseApi/saveBaseApiConfig';

const OUTPUT_DIR = 'C:\\spring-engine\\generatedNewVersion'

const model: ModelConfig = {
  type: 'model',
  name: 'Team',
  tableName: 'tbl_team',
  module: 'club',
  attributes: [
    { type: 'Long', name: 'teamId', objectType: 'java', primaryKey: true },
    { type: 'String', name: 'number', unique: false, nullable: false, objectType: 'java' },
    { type: 'String', name: 'name', length: 30, objectType: 'java' },
    { type: 'Float', name: 'balance', length: 50, defaultValue: '12.233', objectType: 'java' },
    { type: 'Boolean', name: 'active', length: 30, objectType: 'java' },
    { type: 'String', name: 'description', length: 2000, objectType: 'java' },
  ],
  primaryKey: [
    {
      name: 'teamId',
      type: 'Long',
    },
  ]
};

const model2: ModelConfig = {
  type: "model",
  module: "shared",
  name: "BookGen",
  tableName: "book",
  audit: true,
  attributes: [    {
    name: "id",
    type: "Integer",
    nullable: false,
    unique: true,
    primaryKey: true,
    generationType: "IDENTITY"
  },
  {
    name: "title",
    type: "String",
    nullable: true,
    unique: false,
    primaryKey: false
  }
],
  crud: true,
  uniqueConstraints: []
};

const model3: ModelConfig = {
  type: 'model',
  name: 'Client',
  tableName: 'tbl_client',
  module: 'CarRental',
  attributes: [
    { type: 'Integer', name: 'clientId', unique: false, nullable: true, defaultValue: '20', objectType: 'java', primaryKey: true, generationType: 'IDENTITY' },
    { type: 'String', name: 'number', unique: false, nullable: true, defaultValue: 'X0PSKK012', objectType: 'java' },
    { type: 'String', name: 'nationalId', unique: false, nullable: true, objectType: 'java' },
    { type: 'String', name: 'licenceNo', unique: false, nullable: true, objectType: 'java' },
    { type: 'Long', name: 'cars', unique: false, nullable: true, defaultValue: '123456789012345', objectType: 'java' }, // Longo
    { type: 'BigDecimal', name: 'totalRental', unique: false, nullable: true, defaultValue: '1000.50', objectType: 'java' }, // Decimal
    { type: 'Double', name: 'usePercentage', unique: false, nullable: true, defaultValue: '12.5', objectType: 'java' }, // Flutuante
    { type: 'Boolean', name: 'active', unique: false, nullable: true, defaultValue: 'false', objectType: 'java' }, // Booleano
    { type: 'String', name: 'birthdate', unique: false, nullable: true, objectType: 'java'}, // Data
    { type: 'Short', name: 'position', unique: false, nullable: true, defaultValue: '10', objectType: 'java' }, // Short
    { type: 'String', name: 'photoUrl', unique: false, nullable: true, defaultValue: '', objectType: 'java' }, // Byte
  ],
  crud: true
};

const model4: ModelConfig = {
  "type": "model",
  "name": "sertyu",
  "tableName": "t_sertyu",
  "audit": true,
  "attributes": [
    {
      "name": "swertyu",
      "type": "long",
      "length": 255,
      "defaultValue": "",
      "nullable": false,
      "unique": false,
      "primaryKey": true,
      "generationType": "IDENTITY"
    },
    {
      "name": "wfegg",
      "type": "double",
      "length": 255,
      "defaultValue": "",
      "nullable": true,
      "unique": true,
      "primaryKey": false,
      "generationType": ""
    },
    {
      "name": "gegewgw",
      "type": "file",
      "defaultValue": "",
      "nullable": false,
      "unique": false,
      "primaryKey": false,
      "generationType": ""
    },
    {
      "name": "egewgewg",
      "type": "uuid",
      "length": 255,
      "defaultValue": "",
      "nullable": true,
      "unique": false,
      "primaryKey": false,
      "generationType": ""
    },
    {
      "name": "ewfweffwfe",
      "type": "string",
      "length": 300,
      "defaultValue": "",
      "nullable": true,
      "unique": false,
      "primaryKey": false,
      "generationType": ""
    },
    {
      "name": "efwefewf",
      "type": "string",
      "length": 255,
      "defaultValue": "rgregergerger",
      "nullable": true,
      "unique": false,
      "primaryKey": false,
      "generationType": ""
    }
  ],
  "relations": [],
  "uniqueConstraints": [],
  "primaryKey": []
}


beforeAll(async () =>{
  await fs.mkdir(OUTPUT_DIR, {recursive: true});
});

afterAll(async () => {
  // await fs.rm(OUTPUT_DIR, {recursive: true});
});

describe('Model generator', () => {
  const invalidModelConfig: ModelConfig = { ...model, name: '' };

  // it('should fail because the model config file has non-name', async () => {
  //   expect(
  //     async () => await addModel(invalidModelConfig, OUTPUT_DIR),
  //   ).rejects.toEqual(ERROR_MESSAGE.INVALID_MODEL_CONFIG);
  // });


  it('should create a model in th api', async () => {
    //await addModel(model, OUTPUT_DIR);
    await addModel(model4, OUTPUT_DIR);

  });
});