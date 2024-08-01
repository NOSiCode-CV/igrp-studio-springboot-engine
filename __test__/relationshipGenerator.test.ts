import fs from 'fs-extra';
import { newApi } from '../src/newApi';
import { OUTPUT_DIR } from '../src/utils/constants';
import { ModelConfig, ApiConfig, Relation } from '../src/interfaces/types';
import { generateRelationship } from '../src/modules/relationshipGenerator';
import { after } from 'node:test';


const apiConfig: ApiConfig = {
  type: 'baseApi',
  apiName: 'api-rest',
  group: 'nosi',
  artifact: 'igrp',
  description: 'api-rest application',
}; 

const modelConfig: ModelConfig = {
  type: 'model',
  name: '',
  attributs: [
    {
      type: 'String',
      name: 'name',
      required: true,
      unique: false,
      notNull: false,
    },
    {
      type: 'String',
      name: 'lastname',
      required: true,
      unique: false,
      notNull: false,
    },
    {
      type: 'Integer',
      name: 'age',
      required: true,
      unique: false,
      notNull: false,
    },
  ]
};

const BookRelations: Relation [] = [
  {
    relationType: 'ManyToMany',
    entity: 'Library',
    joinColumn: 'book_id',
    joinTable: 'book_library',
    inverseJoinColumn: 'library_id'
  }
];

const LibraryRelations: Relation [] = [
  {
    relationType: 'ManyToMany',
    entity: 'Book',
    mappedBy: 'library'
  }
];

beforeAll(async () => {
  await fs.mkdir(OUTPUT_DIR, {recursive: true});
  await newApi(apiConfig, OUTPUT_DIR);
});

afterAll(async () => {
  await fs.rm(OUTPUT_DIR, {recursive: true});
});

it('should update the model config whit relationship', async () => {
  const bookModel = {...modelConfig, name:'Book'};
  const libraryModel = {...modelConfig, name:'Day'};

  bookModel.relations = BookRelations;
  libraryModel.relations = LibraryRelations;

  generateRelationship(bookModel, OUTPUT_DIR);
  generateRelationship(libraryModel, OUTPUT_DIR);

});
