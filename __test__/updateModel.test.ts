import fs, { outputFile } from 'fs-extra';
import { newApi } from '../src/newApi';
import { ERROR_MESSAGE, OUTPUT_DIR } from '../src/utils/constants';
import { saveModelFile } from '../src/modules/saveModelFile';
import { ModelConfig, ApiConfig } from '../src/interfaces/types';
import { updateModel } from '../src/modules/updateModelConfig';


const apiConfig: ApiConfig = {
  type: 'baseApi',
  apiName: 'api-rest',
  group: 'nosi',
  artifact: 'igrp',
  description: 'api-rest application',
};

const modelConfig: ModelConfig = {
  type: "model",
  name: "User",
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
  ],
  crud: {
    enabled: true,
    path: 'users',
    disabledMethods: ['delete', 'save']
  }
}

beforeAll(async () => {
  await fs.mkdir(OUTPUT_DIR, {recursive: true});
  await newApi(apiConfig, OUTPUT_DIR);

  await saveModelFile(modelConfig, OUTPUT_DIR);

});

afterAll(async () => {
  await fs.rm(OUTPUT_DIR, {recursive: true});
});

it('should fail because the model configuration is invalid', async () => {
  const invalidModelConfig = {...modelConfig, name:''}
  try {
    await updateModel(invalidModelConfig, OUTPUT_DIR);
  } catch (error) {
    expect(error).toBe(ERROR_MESSAGE.INVALID_MODEL_CONFIG);
  }
});

it('should replace the existing model configuration in the igrpstudio directory', async () => {
  await updateModel(modelConfig, OUTPUT_DIR);

});
