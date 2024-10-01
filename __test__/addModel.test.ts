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
  name: 'SIPS_T_PESSOA',
  tableName: 'sips_t_pessoa',
  attributes: [
    { type: 'Long', name: 'idPessoa', primarykey: true},
    { type: 'String', name: 'numero', unique: false, nullable: false, required: true },
    { type: 'String', name: 'nomeMae', length:30 },
    { type: 'Float', name: 'saldo', length:50},
    { type: 'Boolean', name: 'fumador', length:30 },
    { type: 'Text', name: 'nomePai', length:2000, required: true},
  ], 
  crud: {
    enabled: true,
    path: 'sips_pessoa',
    disabledMethods: ['save', 'saveAll', 'delete', 'deleteAll', 'deleteById', 'findAll', 'findById', 'findAllById'],
  }
};

// const model2: ModelConfig = {
//   type: 'model',
//   name: 'SIPS_T_UTENTE',
//   attributes: [
//     { type: 'Integer', name: 'idPessoa', unique: false, notNull: true, required: true, defaultValue: 'vinte' },
//     { type: 'String', name: 'numero', unique: false, notNull: true, required: true },
//     { type: 'String', name: 'nib', unique: false, notNull: true, required: true },
//     { type: 'String', name: 'nrConvencao', unique: false, notNull: true, required: true },
//   ]
// };

const model3: ModelConfig = {
  type: 'model',
  name: 'SIPS_T_SOCIO',
  tableName: 'sips_t_socio',
  attributes: [
    { type: 'Integer', name: 'idPessoa', unique: false, nullable: true, required: true, defaultValue: '20' },
    { type: 'String', name: 'numero', unique: false, nullable: true, required: true },
    { type: 'String', name: 'nib', unique: false, nullable: true, required: true },
    { type: 'String', name: 'nrConvencao', unique: false, nullable: true, required: true },
    { type: 'Long', name: 'documentoLongo', unique: false, nullable: true, required: true, defaultValue: '123456789012345' }, // Longo
    { type: 'BigDecimal', name: 'saldo', unique: false, nullable: true, required: true, defaultValue: '1000.50' }, // Decimal
    { type: 'Float', name: 'percentagem', unique: false, nullable: true, required: false, defaultValue: '12.5' }, // Flutuante
    { type: 'Double', name: 'distancia', unique: false, nullable: true, required: false, defaultValue: '12345.6789' }, // Double
    { type: 'Boolean', name: 'ativo', unique: false, nullable: true, required: true, defaultValue: 'true' }, // Booleano
    { type: 'Date', name: 'dataNascimento', unique: false, nullable: true, required: false, defaultValue: '2024-01-01' }, // Data
    { type: 'Short', name: 'codigoCurto', unique: false, nullable: true, required: true, defaultValue: '10' }, // Short
    { type: 'Byte', name: 'nivelAcesso', unique: false, nullable: true, required: true, defaultValue: '1' }, // Byte
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

  // it('should fail because the model config file has non-name', async () => {
  //   expect(
  //     async () => await addModel(invalidModelConfig, OUTPUT_DIR),
  //   ).rejects.toEqual(ERROR_MESSAGE.INVALID_MODEL_CONFIG);
  // });


  it('should create a model in th api', async () => {
    //await addModel(model, OUTPUT_DIR);
    await addModel(model3, OUTPUT_DIR);

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
