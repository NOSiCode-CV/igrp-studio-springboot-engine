import path from 'path';
import fs from 'fs-extra';
import { deleteModel } from '../src/index';
import { ApiConfig, ModelConfig } from '../src/interfaces/types';

const basePath = 'C:/Users/Eduardo Fernando/Downloads/api'

const model: ModelConfig = {
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
    },
  ],
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
