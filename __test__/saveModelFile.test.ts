import path from 'path';
import fs from 'fs-extra';

import { DIRECTORIES, ERROR_MESSAGE, EXTENSIONS, OUTPUT_DIR } from '../src/utils/constants';
import { ModelConfig } from '../src/interfaces/types';
import { saveModelFiles } from '../src/modules/saveModelFiles';


const modelConfig: ModelConfig = {
  type: 'model',
  name: '',
  attributs: []
}

const igrpstudio = path.join(OUTPUT_DIR, DIRECTORIES.IGRPSTUDIO, DIRECTORIES.MODELS);
beforeAll(async() =>{
  await fs.mkdir(igrpstudio, {recursive: true})
})

afterAll(async () => {
  modelConfig.name = '';
  modelConfig.attributs = [];
  await fs.rm(OUTPUT_DIR, {recursive: true})
});

it('should fail because the model config has a null fields', async () => {
  try {
    await saveModelFiles(modelConfig, OUTPUT_DIR)
  } catch (error) {
    expect(error).toBe(ERROR_MESSAGE.INVALID_MODEL_CONFIG);
  }
});

it('should fail because the ouptut is invalid', async () => {
  modelConfig.name = 'User'
  try {
    await saveModelFiles(modelConfig, 'OUTPUT_DIR')
  } catch (error) {
    expect(error).toBe(ERROR_MESSAGE.INVALID_OUTPUT_PATH);
  }
});

it('should fail because the ouptut is null or invalid', async () => {
  modelConfig.name = 'User'
  try {
    await saveModelFiles(modelConfig, '')
  } catch (error) {
    expect(error).toBe(ERROR_MESSAGE.INVALID_OUTPUT_PATH);
  }
});

it('should fail because the attibutes array is empty', async () => {
  modelConfig.name = 'User'
  try {
    await saveModelFiles(modelConfig, OUTPUT_DIR)
  } catch (error) {
    expect(error).toBe(ERROR_MESSAGE.EMPTY_ATTRIBUTE);
  }
});

it('should save a model file configuration in .igrpstudio/model/ directory', async () => {
  modelConfig.name = 'User'
  modelConfig.attributs = [
    {
      type: 'String', name: 'name', required: true,
      unique: false,
      notNull: false
    },
    {
      type: 'String', name: 'lastname', required: true,
      unique: false,
      notNull: false
    },
    {
      type: 'Integer', name: 'age', required: true,
      unique: false,
      notNull: false
    },
  ]
  await saveModelFiles(modelConfig, OUTPUT_DIR);
  const model = path.join(igrpstudio, `${modelConfig.name}${EXTENSIONS.JSON}`)
  const existsFile = await fs.pathExists(model);

  expect(existsFile).toBeTruthy();
});

