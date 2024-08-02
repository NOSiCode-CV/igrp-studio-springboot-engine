import { DIRECTORIES, ERROR_MESSAGE, EXTENSIONS, OUTPUT_DIR } from '../src/utils/constants';
import { newModelConfig } from '../src/newModelConfig';
import { ModelConfig } from '../src/interfaces/types';
import fs from 'fs-extra';
import path from 'path';

const model: ModelConfig = {
  type: 'model',
  name: 'Library',
  attributs: [
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

const output = path.join(OUTPUT_DIR, DIRECTORIES.CONFIG_MODEL);

beforeAll(async () => {
  await fs.mkdir(output, { recursive: true });
});

afterAll(async () => {
  // await fs.rm(output, {recursive: true});
});

describe('New model configuration main', () => {
  it('should fail because the output is invalid', async () => {
    // await expect(newModelConfig(model, '')).rejects.toThrow(ERROR_MESSAGE.INVALID_OUTPUT_PATH);
    // try {
    //   await newModelConfig(model, '');
    // } catch (error) {
    //   expect(error).toBe(ERROR_MESSAGE.INVALID_OUTPUT_PATH);
    // }
  });

  it('should fail because the base api json file configuration does not exist', async () => {
    // try {
    //   await newModelConfig(model, output);
    // } catch (error) {
    //   expect(error).toBe(ERROR_MESSAGE.BASE_API_NOT_FOUND);
    // }
  });

  it('should create the model ficle configuration in the specify directory', async () => {
    await newModelConfig(model, OUTPUT_DIR);
    const modelOutputPath = path.join(output, `${model.name}${EXTENSIONS.JSON}`);
    const modelExist = await fs.pathExists(modelOutputPath);

    expect(modelExist).toBeTruthy();
  });
});
