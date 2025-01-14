import fs from 'fs-extra';
import path from 'path';
import { BaseApiConfig, ModelConfig } from '../src/interfaces/types';
import { DIRECTORIES, EXTENSIONS } from '../src/utils/constants';
import { readJsonFile } from '../src/utils/readJsonFiles';
import { addModel } from'../src/index';

const OUTPUT_DIR = 'C:\\spring-engine\\generatedNewVersion'

const apiConfig: BaseApiConfig = {
  type: 'springboot',
  apiName: 'api-rest',
  group: 'nosi',
  artifact: 'igrp',
  description: 'API-TEST',
  database: 'Postgresql',
  projectStructureStyle: 'technical',
  enableObservability: false,
  igrpCoreVersion: ""
};

const model: ModelConfig = {
  type: 'model',
  name: 'SIPS_T_PESSOA',
  tableName: 'sips',
  attributes: [
    { type: 'integer', name: 'idEstadoCivil', unique: false, nullable: true, primaryKey: true, generationType: 'IDENTITY'},
    { type: 'string', name: 'nome', unique: false, nullable: true, },
    { type: 'string', name: 'sexo', unique: false, nullable: true, },
    { type: 'date', name: 'dtNascimento', unique: false, nullable: true, },
    { type: 'string', name: 'nomePai', unique: false, nullable: true, },
    { type: 'string', name: 'nomeMae', unique: false, nullable: true, },
    { type: 'datetime', name: 'dia', unique: false, nullable: true, },
    { type: 'time', name: 'hora', unique: false, nullable: true, },
    { type: 'biginteger', name: 'millones', unique: false, nullable: true, },
    { type: 'decimal', name: 'escudos', unique: false, nullable: true, },
    { type: 'relation', name: 'books', unique: false, nullable: true, relation: {
        relationType: 'ManyToMany',
        entity: 'SIPS_T_UTENTE',
        joinColumn: 'book_id',
        joinTable: 'book_library',
        inverseJoinColumn: 'library_id',
      },},
  ],
  crud: true,
  primaryKey: []
};

const model2: ModelConfig = {
  type: 'model',
  name: 'SIPS_T_UTENTE',
  tableName: 'sips_utent',
  attributes: [
    { type: 'integer', name: 'idPessoa', unique: false, nullable: true, primaryKey: true, generationType: 'IDENTITY'},
    { type: 'string', name: 'numero', unique: false, nullable: true, },
    { type: 'string', name: 'nib', unique: false, nullable: true, },
    { type: 'relation', name: 'nrConvencao', unique: false, nullable: true, relation: {
        relationType: 'ManyToMany',
        entity: 'SIPS_T_PESSOA',
        mappedBy: 'library',
      }},
  ],
  primaryKey: []
};


beforeAll(async () => {
  await fs.mkdir(OUTPUT_DIR, {recursive: true});

});

afterAll(async () => {
  // await fs.rm(OUTPUT_DIR, {recursive: true});
});

describe('Model Relationships generator', () => {

  it('should update adding the relations in the model configuration and the model in the api', async () => {

    await addModel(model, OUTPUT_DIR);
    await addModel(model2, OUTPUT_DIR);

  });
});