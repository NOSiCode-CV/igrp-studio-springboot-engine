import fs from 'fs-extra';
import { DIRECTORIES, ERROR_MESSAGE, EXTENSIONS, OUTPUT_DIR } from '../src/utils/constants';
import { modelResourceGenerator } from '../src/newModelResources';
import { ApiConfig, ModelConfig } from '../src/interfaces/types';
import { getMainPath } from '../src/utils/helpers';
import path from 'path';
import { readJsonFile } from '../src/utils/readJsonFiles';
import { newApi } from '../src/newApi';
import { newModelConfig } from '../src/newModelConfig';

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
  apiName: 'api-rest',
  group: 'nosi',
  artifact: 'igrp',
  description: 'API-TEST',
}

beforeAll(async () =>{
  await fs.mkdir(OUTPUT_DIR, {recursive: true});
  await newApi(apiConfig, OUTPUT_DIR);
  await newModelConfig(model, OUTPUT_DIR);
});

afterAll(async () => {
  await fs.rm(OUTPUT_DIR, {recursive: true});
});

describe('Model generator', () => {
  const invalidModelConfig: ModelConfig = { ...model, name: '' };

  it('should fail because the model config file has non-name', async () => {
    expect(
      async () => await modelResourceGenerator(invalidModelConfig, OUTPUT_DIR),
    ).rejects.toEqual(ERROR_MESSAGE.INVALID_MODEL_CONFIG);
  });

  it(`should fail because the model file config doesn't exist in .igrpstudio/models directory`, async () => {
    const modelNotExist: ModelConfig = { ...model, name: 'NoLibraries' };
    expect(async () => await modelResourceGenerator(modelNotExist, OUTPUT_DIR)).rejects.toEqual(
      ERROR_MESSAGE.MODEL_FILE_CONFIG_NOT_FOUNT,
    );
  });

  it('should create a model in th api', async () => {
    await modelResourceGenerator(model, OUTPUT_DIR);

    const configPath = path.join(OUTPUT_DIR, DIRECTORIES.BASE_API);
    const config: ApiConfig = await readJsonFile(configPath);
    const modelPath = path.join(
      OUTPUT_DIR,
      getMainPath(config.group, config.artifact),
      DIRECTORIES.MODELS,
      model.name,
      `${model.name}${EXTENSIONS.JAVA}`
    );
    
    const pathExists = await fs.pathExists(modelPath);

    expect(pathExists).toBeTruthy();

  });
});
