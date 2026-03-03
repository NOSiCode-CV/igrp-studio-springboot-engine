import {TECHNICAL_OUTPUT_DIR_OTHER} from './outputDirPath';
import {getModelConfigPath, loadModelConfig} from '../src/utils/helpers';
import fs from 'fs-extra';
import path from 'path';
import {ModelConfig} from '../src/interfaces/types';

describe('getting configuração of model', () => {
  it('should get a model config', async () => {
    const modelName = 'DocumentoIdentidade';
    const moduleName = 'core';
    const modelToRemoveRelation = 'Pessoa';

    const modelPath = getModelConfigPath(moduleName, modelName, TECHNICAL_OUTPUT_DIR_OTHER);
    const modelDirPath = path.dirname(modelPath);

    const config = await loadModelConfig<ModelConfig>(modelDirPath, modelName);

    // Remove relações com a entidade informada
    if (config.relationReference && Array.isArray(config.relationReference)) {
      config.relationReference = config.relationReference.filter((rel) => rel.entity !== modelToRemoveRelation);
    }

    // Persiste o novo conteúdo no arquivo original
    await fs.writeJSON(modelPath, config, { spaces: 2 });

    console.log(`Relações com a entidade '${modelToRemoveRelation}' removidas e arquivo salvo com sucesso.`);
  });
});
