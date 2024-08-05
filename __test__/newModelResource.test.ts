import fs from 'fs-extra'
import { DIRECTORIES, OUTPUT_DIR } from '../src/utils/constants';
import { modelResourceGenerator } from '../src/newModelResources';
import { ModelConfig } from '../src/interfaces/types';
import { getMainPath } from '../src/utils/helpers';
import path from 'path';

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


describe('Model generator', () => {
  it('return the file model path', async () => {
    await modelResourceGenerator(model, OUTPUT_DIR);
  });
});
