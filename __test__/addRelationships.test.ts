import fs from 'fs-extra';
import path from 'path';
import { BaseApiConfig, ModelConfig } from '../src/interfaces/types';
import { DIRECTORIES, EXTENSIONS } from '../src/utils/constants';
import { readJsonFile } from '../src/utils/readJsonFiles';
import { addModel } from'../src/index';

const OUTPUT_DIR = 'C:\spring-engine\generatedTest'

const apiConfig: BaseApiConfig = {
  type: 'baseApi',
  apiName: 'api-rest',
  group: 'nosi',
  artifact: 'igrp',
  description: 'API-TEST',
  database: 'Postgresql',
  projectStructureStyle: 'technical',
  enableObservability: false
};

const model: ModelConfig = {
  type: 'model',
  name: 'SIPS_T_PESSOA',
  tableName: 'sips',
  attributes: [
    { type: 'Integer', name: 'idEstadoCivil', unique: false, nullable: true, },
    { type: 'String', name: 'nome', unique: false, nullable: true, },
    { type: 'String', name: 'sexo', unique: false, nullable: true, },
    { type: 'LocalDate', name: 'dtNascimento', unique: false, nullable: true, },
    { type: 'String', name: 'nomePai', unique: false, nullable: true, },
    { type: 'String', name: 'nomeMae', unique: false, nullable: true, },
    { type: 'LocalDateTime', name: 'dia', unique: false, nullable: true, },
    { type: 'LocalTime', name: 'hora', unique: false, nullable: true, },
    { type: 'BigInteger', name: 'millones', unique: false, nullable: true, },
    { type: 'BigDecimal', name: 'escudos', unique: false, nullable: true, },
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
  ],
  primaryKey: []
};

const model2: ModelConfig = {
  type: 'model',
  name: 'SIPS_T_UTENTE',
  tableName: 'sips_utent',
  attributes: [
    { type: 'Integer', name: 'idPessoa', unique: false, nullable: true, },
    { type: 'String', name: 'numero', unique: false, nullable: true, },
    { type: 'String', name: 'nib', unique: false, nullable: true, },
    { type: 'String', name: 'nrConvencao', unique: false, nullable: true, },
  ],
  relations: [
    {
      relationType: 'ManyToMany',
      entity: 'SIPS_T_PESSOA',
      mappedBy: 'library',
    }
  ],
  primaryKey: []
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