import { deleteModel } from '../src/index';
import { BaseApiConfig, ModelConfig } from '../src/interfaces/types';

const basePath = 'generatedTest'

const model: ModelConfig = {
  type: 'model',
  name: 'Library',
  attributes: [
    {
      type: 'String',
      name: 'name',
      unique: false,
      nullable: true,
    },
    {
      type: 'String',
      name: 'address',
      unique: true,
      nullable: true,
    },
  ],
  tableName: 'library',
  primaryKey: []
};

const apiConfig: BaseApiConfig = {
  type: 'baseApi',
  apiName: 'api_rest',
  group: 'nosi',
  artifact: 'igrp',
  description: 'API-TEST',
  database: 'MySQL',
  projectStructureStyle: 'domain',
  enableObservability: true
}

beforeAll(async () =>{
  // await fs.mkdir(OUTPUT_DIR, {recursive: true});
  // await newApi(apiConfig, OUTPUT_DIR);
});

afterAll(async () => {
  // await fs.rm(OUTPUT_DIR, {recursive: true});
});

describe('Model deletion', () => {
  it('should should delete a model', async () => {
    await deleteModel(model, basePath)
  });

});
