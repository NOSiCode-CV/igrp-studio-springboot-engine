import path from 'path';
import fs from 'fs-extra';
import { getMainPath } from '../src/utils/helpers';
import { readJsonFile } from '../src/utils/readJsonFiles';
import { ApiConfig, ModelConfig } from '../src/interfaces/types';
import { addModel } from '../src/index';
import { DIRECTORIES, ERROR_MESSAGE, EXTENSIONS } from '../src/utils/constants';

const OUTPUT_DIR = 'C:/Users/Eduardo Fernando/Downloads/api'

const model: ModelConfig = {
  type: 'model',
  name: 'SIPS_T_PESSOA',
  attributes: [
    { type: 'Integer', name: 'idEstadoCivil', unique: false, notNull: true, required: true },
    { type: 'String', name: 'nome', unique: false, notNull: true, required: true },
    { type: 'String', name: 'sexo', unique: false, notNull: true, required: true },
    { type: 'Date', name: 'dtNascimento', unique: false, notNull: true, required: true },
    { type: 'String', name: 'nomePai', unique: false, notNull: true, required: true },
    { type: 'String', name: 'nomeMae', unique: false, notNull: true, required: true },
    { type: 'Timestamp', name: 'dia', unique: false, notNull: true, required: true },
    { type: 'Time', name: 'hora', unique: false, notNull: true, required: true },
    { type: 'BigInteger', name: 'millones', unique: false, notNull: true, required: true },
    { type: 'BigDecimal', name: 'escudos', unique: false, notNull: true, required: true },
  ], 
  crud: {
    enabled: true,
    path: 'sips_pessoa',
    disabledMethods: ['delete'],
  }
};

const model2: ModelConfig = {
  type: 'model',
  name: 'SIPS_T_UTENTE',
  attributes: [
    { type: 'Integer', name: 'idPessoa', unique: false, notNull: true, required: true },
    { type: 'String', name: 'numero', unique: false, notNull: true, required: true },
    { type: 'String', name: 'nib', unique: false, notNull: true, required: true },
    { type: 'String', name: 'nrConvencao', unique: false, notNull: true, required: true },
  ]
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
    await addModel(model2, OUTPUT_DIR);

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
