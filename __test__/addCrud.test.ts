import { ModelConfig, Crud,  } from '../src/interfaces/types';
import { addModel } from '../src/index';

const OUTPUT_DIR = 'generatedTest'

const model: ModelConfig = {
  type: 'model',
  name: 'Library',
  tableName: 'library',
  attributes: [
    {
      type: 'String',
      name: 'name',
      unique: false,
      nullable: true,
    },
    {
      type: 'String',
      name: 'address',
      unique: true,
      nullable: true,
    },
  ],
  primaryKey: [{
    name: 'libraryId',
    type: 'String'
  }]
};

const crud: Crud = {
  enabled: true,
  path: 'users',
  disabledMethods: ['delete', 'save'],
};

describe('Model generator', () => {

  it('should update adding the crud in the model configuration and the model in the api', async () => {
    const crudModel: ModelConfig = { ...model, crud: crud };
    await addModel(crudModel, OUTPUT_DIR);
  });
});
