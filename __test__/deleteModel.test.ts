import { deleteModel } from '../src/index';
import { ApiConfig, ModelConfig } from '../src/interfaces/types';
import { TEMPLATE_DIR } from '../src/utils/constants';

const basePath = ''

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
  tableName: 'library'
};

const apiConfig: ApiConfig = {
  type: 'baseApi',
  apiName: 'api_rest',
  group: 'nosi',
  artifact: 'igrp',
  description: 'API-TEST',
  database: 'MySQL'
}

beforeAll(async () =>{
  // await fs.mkdir(OUTPUT_DIR, {recursive: true});
  // await newApi(apiConfig, OUTPUT_DIR);
});

afterAll(async () => {
  // await fs.rm(OUTPUT_DIR, {recursive: true});
});

describe('Model generator', () => {
  it('should should delete a model', async () => {
    await deleteModel(model, basePath)
  });

});
