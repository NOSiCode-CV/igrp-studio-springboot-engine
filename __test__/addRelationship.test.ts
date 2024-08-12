import fs from 'fs-extra';
import path from 'path';
import { ApiConfig, ModelConfig, Relation } from '../src/interfaces/types';
import { DIRECTORIES, EXTENSIONS, OUTPUT_DIR } from '../src/utils/constants';
import { readJsonFile } from '../src/utils/readJsonFiles';
import { newApi } from '../src/newApi';
import { modelResourceGenerator } from '../src/newModel';


const apiConfig: ApiConfig = {
  type: 'baseApi',
  apiName: 'api-rest',
  group: 'nosi',
  artifact: 'igrp',
  description: 'API-TEST',
};

const bookModel: ModelConfig = {
  type: 'model',
  name: 'Book',
  attributes: [
    {
      type: 'String',
      name: 'author',
      required: true,
      unique: false,
      notNull: false,
    },
    {
      type: 'String',
      name: 'title',
      required: true,
      unique: false,
      notNull: false,
    },
    {
      type: 'String',
      name: 'editor',
      required: true,
      unique: false,
      notNull: false,
    },
  ],
};

const librayModel: ModelConfig = {
  type: 'model',
  name: 'Library',
  attributes: [
    {
      type: 'String',
      name: 'name',
      unique: false,
      notNull: true,
    },
    {
      type: 'String',
      name: 'address',
      unique: true,
      notNull: true,
    }
  ],
};

const BookRelations: Relation[] = [
  {
    relationType: 'ManyToMany',
    entity: 'Library',
    joinColumn: 'book_id',
    joinTable: 'book_library',
    inverseJoinColumn: 'library_id',
  },
];

const LibraryRelations: Relation[] = [
  {
    relationType: 'ManyToMany',
    entity: 'Book',
    mappedBy: 'library',
  },
];

beforeAll(async () => {
  await fs.mkdir(OUTPUT_DIR, {recursive: true});
  await newApi(apiConfig, OUTPUT_DIR);

});

afterAll(async () => {
  await fs.rm(OUTPUT_DIR, {recursive: true});
});

describe('Model generator', () => {

  it('should update adding the relations in the model configuration and the model in the api', async () => {
    bookModel.relations = BookRelations;
    librayModel.relations = LibraryRelations;
    
    await modelResourceGenerator(bookModel, OUTPUT_DIR);
    await modelResourceGenerator(librayModel, OUTPUT_DIR);

    const bookConfigPath = path.join(OUTPUT_DIR, DIRECTORIES.CONFIG_MODEL, `${bookModel.name}${EXTENSIONS.JSON}`);
    const bookModelConfig: ModelConfig = await readJsonFile(bookConfigPath);
    expect(bookModelConfig.relations).toBeTruthy();
    
    const libraryConfigPath = path.join(OUTPUT_DIR, DIRECTORIES.CONFIG_MODEL, `${librayModel.name}${EXTENSIONS.JSON}`);
    const libraryModelConfig: ModelConfig = await readJsonFile(libraryConfigPath);
    expect(libraryModelConfig.relations).toBeTruthy();

  });
});


