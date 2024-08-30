import path from 'path';
import fs from 'fs-extra';
import { getMainPath } from '../src/utils/helpers';
import { readJsonFile } from '../src/utils/readJsonFiles';
import { ApiConfig, ModelConfig } from '../src/interfaces/types';
import { addModel } from '../src/index';
import { DIRECTORIES, ERROR_MESSAGE, EXTENSIONS } from '../src/utils/constants';

const OUTPUT_DIR = ''

const model: ModelConfig = {
  type: 'model',
  name: 'Library',
  attributes: [
    {
      type: 'String',
      name: 'name',
      unique: false,
      notNull: true,
      required: true
    },
    {
      type: 'String',
      name: 'address',
      unique: true,
      notNull: true,
    },
  ],
};



beforeAll(async () =>{
  await fs.mkdir(OUTPUT_DIR, {recursive: true});
});

afterAll(async () => {
  // await fs.rm(OUTPUT_DIR, {recursive: true});
});

describe('Model generator', () => {
  const invalidModelConfig: ModelConfig = { ...model, name: '' };

  it('should fail because the model config file has non-name', async () => {
    expect(
      async () => await addModel(invalidModelConfig, OUTPUT_DIR),
    ).rejects.toEqual(ERROR_MESSAGE.INVALID_MODEL_CONFIG);
  });


  it('should create a model in th api', async () => {
    await addModel(model, OUTPUT_DIR);

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
