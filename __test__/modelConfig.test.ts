import { DIRECTORIES, ERROR_MESSAGE, EXTENSIONS, OUTPUT_DIR } from '../src/utils/constants';
import { newModelConfig } from '../src/newModelConfig';
import { ApiConfig, ModelConfig } from '../src/interfaces/types';
import fs from 'fs-extra';
import path from 'path';
import { newApi } from '../src/newApi';

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
    }
  ],
};

const apiConfig: ApiConfig = {
  type: 'baseApi',
  apiName: 'api-rest',
  group: 'nosi',
  artifact: 'igrp',
  description: 'API-TEST',
}


beforeAll(async () => {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await newApi(apiConfig, OUTPUT_DIR)

});

afterAll(async () => {
  await fs.rm(OUTPUT_DIR, {recursive: true});
});

describe('New model configuration main', () => {
  it('should fail because the output is invalid', async () => {
    expect(async () => await newModelConfig(model, '')).rejects.toEqual(ERROR_MESSAGE.INVALID_OUTPUT_PATH);
  });

  it('should fail because the base api json file configuration does not exist', async () => {
    expect(async () => await newModelConfig(model, path.join(OUTPUT_DIR, DIRECTORIES.CONFIG_MODEL))).rejects.toEqual(ERROR_MESSAGE.BASE_API_NOT_FOUND);
  });

  it('should create the model file configuration in the specify directory', async () => {
    await newModelConfig(model, OUTPUT_DIR);
    const modelConfigPath = path.join(OUTPUT_DIR, DIRECTORIES.CONFIG_MODEL, `${model.name}${EXTENSIONS.JSON}`);
    const modelExist = await fs.pathExists(modelConfigPath);

    expect(modelExist).toBeTruthy();
  });
});
