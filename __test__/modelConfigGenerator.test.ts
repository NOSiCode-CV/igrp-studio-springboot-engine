import { ModelConfig } from '../src/interfaces/types';
import { ERROR_MESSAGE } from '../src/utils/constants';
import { modelConfigGenerator } from '../src/modules/model/modelConfigGenerator';

const modelConfig: ModelConfig = {
  type: 'model',
  name: 'Studant',
  attributs: [
    {
      type: 'String',
      name: 'firstname',
      unique: false,
      notNull: true,
    },
  ],
};

beforeAll(() => {
  modelConfig.name = 'Studant';
});

describe('model ConfigGenrator module', () => {
  it('should fail because the model config is invalid', async () => {
    const invalidModelConfig = { ...modelConfig, name: '' };
  
    try {
      await modelConfigGenerator(invalidModelConfig);
    } catch (error) {
      expect(error).toBe(ERROR_MESSAGE.INVALID_MODEL_CONFIG);
    }
  });
  
  it('should fail because the model config has empty attributs', async () => {
    const invalidModelAttribusts = { ...modelConfig, attributs: [] };
  
    try {
      await modelConfigGenerator(invalidModelAttribusts);
    } catch (error) {
      expect(error).toBe(ERROR_MESSAGE.EMPTY_ATTRIBUTE);
    }
  });
  

  it('should generate the model configuration template', async () => {
    const template = await modelConfigGenerator(modelConfig);
    const jsonFile = JSON.parse(template);
    
    expect(jsonFile.name).toEqual(modelConfig.name)
    expect(jsonFile.attributs.length).toBeGreaterThan(0);

  });
})
