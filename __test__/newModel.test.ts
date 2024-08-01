import { DIRECTORIES, ERROR_MESSAGE, EXTENSIONS, OUTPUT_DIR } from '../src/utils/constants';
import { ModelConfig, ApiConfig } from '../src/interfaces/types';
import fs from 'fs-extra';
import { newApi } from '../src/newApi';
import { newModel } from '../src/newModel';
import path from 'path';
import { getMainPath } from '../src/utils/helpers';

const validModelConfig: ModelConfig = {
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
    },
  ]
};
let mainPath = '';
beforeAll(async () => {
  const apiConfig: ApiConfig = {
    type: 'baseApi',
    apiName: 'api-rest',
    group: 'nosi',
    artifact: 'igrp',
    description: 'api-rest application',
  };

  mainPath = getMainPath(apiConfig.group, apiConfig.artifact);

  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await newApi(apiConfig, OUTPUT_DIR);
});

afterAll(async () => {
  // await fs.rm(OUTPUT_DIR, { recursive: true });
});

it('should fail because the model config is invalid', async () => {
  const invalidModelConfig = {...validModelConfig, name:''};

  try {
    await newModel(invalidModelConfig, OUTPUT_DIR);
  } catch (error) {
    expect(error).toBe(ERROR_MESSAGE.INVALID_MODEL_CONFIG);
  }
});

it('should fail because the output is invalid', async () => {

  try {
    await newModel(validModelConfig, '');
  } catch (error) {
    expect(error).toBe(ERROR_MESSAGE.INVALID_OUTPUT_PATH);
  }
});

it('should create a model cofiguration file and the model in the api model directory.', async () => {
  const modelName = validModelConfig.name
  const models = [
    path.join(OUTPUT_DIR, DIRECTORIES.IGRPSTUDIO, DIRECTORIES.MODELS, `${modelName}${EXTENSIONS.JSON}`),
    path.join(OUTPUT_DIR, mainPath, DIRECTORIES.MODELS, modelName, `${modelName}${EXTENSIONS.JAVA}`)
  ];

  await newModel(validModelConfig, OUTPUT_DIR);

  const exists = await Promise.all(models.map(model => fs.pathExists(model)));
  expect(exists).toBeTruthy();

});
