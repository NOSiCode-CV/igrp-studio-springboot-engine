import path from 'path';
import fs from 'fs-extra';
import { getMainPath } from '../src/utils/helpers';
import { readJsonFile } from '../src/utils/readJsonFiles';
import { ModelConfig, Crud, ApiConfig } from '../src/interfaces/types';
import {
  COMMON_FILES,
  DIRECTORIES,
  EXTENSIONS,
  OUTPUT_DIR,
} from '../src/utils/constants';
import { newApi } from '../src/newApi';
import { modelResourceGenerator } from '../src/newModel';

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
    },
  ],
};

const crud: Crud = {
  enabled: true,
  path: 'users',
  disabledMethods: ['delete', 'save'],
};

const apiConfig: ApiConfig = {
  type: 'baseApi',
  apiName: 'api-rest',
  group: 'nosi',
  artifact: 'igrp',
  description: 'API-TEST',
};

beforeAll(async () => {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await newApi(apiConfig, OUTPUT_DIR);
});

afterAll(async () => {
  await fs.rm(OUTPUT_DIR, { recursive: true });
});

describe('Model generator', () => {
  const repository = path.join(
    OUTPUT_DIR,
    getMainPath(apiConfig.group, apiConfig.artifact),
    DIRECTORIES.MODELS,
    model.name,
    `${model.name}${COMMON_FILES.REPOSITORY}`,
  );
 
  it('should update adding the crud in the model configuration and the model in the api', async () => {
    const crudModel: ModelConfig = { ...model, crud: crud };
    await modelResourceGenerator(crudModel, OUTPUT_DIR);

    const libraryConfigPath = path.join(
      OUTPUT_DIR,
      DIRECTORIES.CONFIG_MODEL,
      `${model.name}${EXTENSIONS.JSON}`,
    );

    const libraryModelConfig: ModelConfig = await readJsonFile(libraryConfigPath);
    expect(libraryModelConfig.crud).toBeTruthy();

    const fileExists = await fs.pathExists(repository);
    expect(fileExists).toBeTruthy();
  });
});
