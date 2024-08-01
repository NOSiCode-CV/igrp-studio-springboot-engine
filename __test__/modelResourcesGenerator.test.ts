import fs from 'fs-extra';
import { newApi } from '../src/newApi';
import { DIRECTORIES, ERROR_MESSAGE, EXTENSIONS, OUTPUT_DIR } from '../src/utils/constants';
import { saveModelFile } from '../src/modules/saveModelFile';
import { ApiConfig, ModelConfig } from '../src/interfaces/types';
import { modelGenerator } from '../src/modules/modelResourcesGenerator';
import path from 'path';
import { getMainPath } from '../src/utils/helpers';

const modelConfig: ModelConfig = {
  type: 'model',
  name: 'User',
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
    }
  ]
};

const apiConfig: ApiConfig = {
  type: 'baseApi',
  apiName: 'api-rest',
  group: 'nosi',
  artifact: 'igrp',
  description: 'api-rest application',
};

let output = path.join(
  OUTPUT_DIR,
  getMainPath(apiConfig.group, apiConfig.artifact),
  DIRECTORIES.MODELS, modelConfig.name, `${modelConfig.name}${EXTENSIONS.JAVA}`
);

beforeAll(async () => {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  await newApi(apiConfig, OUTPUT_DIR);
  await saveModelFile(modelConfig, OUTPUT_DIR);
});

afterAll(async () => {
  await fs.rm(OUTPUT_DIR, {recursive: true});
});

it('Should fail because the modelConfig is invalid', async () => {
  modelConfig.name = '';
  try {
    await modelGenerator(modelConfig, OUTPUT_DIR);
  } catch (error) {
    expect(error).toBe(ERROR_MESSAGE.INVALID_MODEL_CONFIG);
  }
});

it('should fail because the output is invalid', async () => {
  modelConfig.name = 'User';
  try {
    await modelGenerator(modelConfig, '');
  } catch (error) {
    expect(error).toBe(ERROR_MESSAGE.INVALID_OUTPUT_PATH);
  }
});

it(`should create a model in src/main/java/group/artifact/model/${modelConfig.name}`, async () => {
  await modelGenerator(modelConfig, OUTPUT_DIR);
  const existFile = await fs.pathExists(output);

  expect(existFile).toBeTruthy();
});
