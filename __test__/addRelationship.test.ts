import fs from 'fs-extra';
import path from 'path';
import { ApiConfig, ModelConfig, Relation } from '../src/interfaces/types';
import { DIRECTORIES, EXTENSIONS } from '../src/utils/constants';
import { readJsonFile } from '../src/utils/readJsonFiles';
import { newApi } from '../src/index';
import { addModel } from'../src/index';

const OUTPUT_DIR = 'C:/Users/Eduardo Fernando/Downloads/api'

const apiConfig: ApiConfig = {
  type: 'baseApi',
  apiName: 'api-rest',
  group: 'nosi',
  artifact: 'igrp',
  description: 'API-TEST',
  database: 'PostgreSQL'
};

const model: ModelConfig = {
  type: 'model',
  name: 'SIPS_T_PESSOA',
  attributes: [
    { type: 'Integer', name: 'idEstadoCivil', unique: false, notNull: true, required: true },
    { type: 'String', name: 'nome', unique: false, notNull: true, required: true },
    { type: 'String', name: 'sexo', unique: false, notNull: true, required: true },
    { type: 'Date', name: 'dtNascimento', unique: false, notNull: true, required: true },
    { type: 'String', name: 'nomePai', unique: false, notNull: true, required: true },
    { type: 'String', name: 'nomeMae', unique: false, notNull: true, required: true },
    { type: 'Timestamp', name: 'dia', unique: false, notNull: true, required: true },
    { type: 'Time', name: 'hora', unique: false, notNull: true, required: true },
    { type: 'BigInteger', name: 'millones', unique: false, notNull: true, required: true },
    { type: 'BigDecimal', name: 'escudos', unique: false, notNull: true, required: true },
  ], 
  crud: {
    enabled: true,
    path: 'sips_pessoa',
    disabledMethods: ['delete'],
  },
  relations: [
    {
      relationType: 'ManyToMany',
      entity: 'SIPS_T_UTENTE',
      joinColumn: 'book_id',
      joinTable: 'book_library',
      inverseJoinColumn: 'library_id',
    },
  ]
};

const model2: ModelConfig = {
  type: 'model',
  name: 'SIPS_T_UTENTE',
  attributes: [
    { type: 'Integer', name: 'idPessoa', unique: false, notNull: true, required: true },
    { type: 'String', name: 'numero', unique: false, notNull: true, required: true },
    { type: 'String', name: 'nib', unique: false, notNull: true, required: true },
    { type: 'String', name: 'nrConvencao', unique: false, notNull: true, required: true },
  ], 
  relations:[
    {
      relationType: 'ManyToMany',
      entity: 'SIPS_T_PESSOA',
      mappedBy: 'library',
    }
  ]
};


beforeAll(async () => {
  await fs.mkdir(OUTPUT_DIR, {recursive: true});

});

afterAll(async () => {
  // await fs.rm(OUTPUT_DIR, {recursive: true});
});

describe('Model generator', () => {

  it('should update adding the relations in the model configuration and the model in the api', async () => {
    
    await addModel(model, OUTPUT_DIR);
    await addModel(model2, OUTPUT_DIR);

    const bookConfigPath = path.join(OUTPUT_DIR, DIRECTORIES.CONFIG_MODEL, `${model.name}${EXTENSIONS.JSON}`);
    const bookModelConfig: ModelConfig = await readJsonFile(bookConfigPath);
    expect(bookModelConfig.relations).toBeTruthy();
    
    const libraryConfigPath = path.join(OUTPUT_DIR, DIRECTORIES.CONFIG_MODEL, `${model2.name}${EXTENSIONS.JSON}`);
    const libraryModelConfig: ModelConfig = await readJsonFile(libraryConfigPath);
    expect(libraryModelConfig.relations).toBeTruthy();

  });
});


