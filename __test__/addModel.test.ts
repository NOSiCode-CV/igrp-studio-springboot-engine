import fs from 'fs-extra';
import { addModel } from '../src/index';
import { ModelConfig } from '../src/interfaces/types';

const OUTPUT_DIR = 'C:/Users/Eduardo\ Fernando/Downloads/apiTest'

const model: ModelConfig = {
  type: 'model',
  name: 'SIPS_T_PESSOA',
  tableName: 'sips_t_pessoa',
  attributes: [
    { type: 'Long', name: 'idPessoa', primaryKey: true, generationType:"AUTO"},
    { type: 'String', name: 'numero', unique: false, nullable: false, generationType:""},
    { type: 'String', name: 'nomeMae', length:30 },
    { type: 'Float', name: 'saldo', length:50},
    { type: 'Boolean', name: 'fumador', length:30 },
    { type: 'Text', name: 'nomePai', length:2000},
  ],
  uniqueConstraints: [
    {
      name: 'UK_SIPS_T_PESSOA_NUMERO_NOME_MAE',
      columns: ['numero', 'nomeMae'],
    },
    {
      name: 'UK_SIPS_T_PESSOA_NUMERO_NOME_PAI',
      columns: ['numero', 'nomePai'],
    },
    {
      name: 'UK_SIPS_T_PESSOA_ID_NUMERO',
      columns: ['id', 'numero'],
    },
  ], 
};


beforeAll(async () =>{
  await fs.mkdir(OUTPUT_DIR, {recursive: true});
});

describe('Model generator', () => {

  it('should create a model in th api', async () => {
    await addModel(model, OUTPUT_DIR);
  });
});
