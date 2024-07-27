import path from 'path';
import fs from 'fs-extra';
import { apiSetup, modelSetUp } from '../src/apiSetup';
import { saveModelFiles } from '../src/modules/saveModelFiles';
import { ApiConfig, ModelConfig } from '../src/interfaces/types';
import { COMMON_FILES, DIRECTORIES, EXTENSIONS, OUTPUT_DIR } from '../src/utils/constants';

const apiConfig: ApiConfig = {
  type: 'baseApi',
  apiName: 'api-rest',
  group: 'nosi',
  artifact: 'igrp',
  description: 'API-TEST',
};

const modelConfig: ModelConfig = {
  type: 'model',
  name: 'User',
  attributs: [
    { type: 'String', name: 'name', required: true },
    { type: 'String', name: 'lastname', required: true },
    { type: 'Integer', name: 'age', required: true },
  ],
};

let cleamDirectory = true;

beforeAll(async () => {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
});

afterAll(async () => {
  await fs.rm(OUTPUT_DIR, { recursive: true });
  
});

it('should create the project structure with all the directories and templates.', async () => {
  await apiSetup(apiConfig, OUTPUT_DIR);
  const mainDir = path.join(OUTPUT_DIR, DIRECTORIES.MAIN(apiConfig));

  const directories = [
    path.join(mainDir, DIRECTORIES.MODELS),
    path.join(mainDir, DIRECTORIES.SERVICES),
    path.join(mainDir, DIRECTORIES.CONTROLLERS),
    path.join(OUTPUT_DIR, DIRECTORIES.RESOURCES),
    path.join(OUTPUT_DIR, DIRECTORIES.IGRPSTUDIO, DIRECTORIES.MODELS),
    path.join(OUTPUT_DIR, DIRECTORIES.IGRPSTUDIO, DIRECTORIES.CONTROLLERS),
  ];

  const files = [
    path.join(OUTPUT_DIR, COMMON_FILES.MVNW),
    path.join(OUTPUT_DIR, DIRECTORIES.BASE_API),
    path.join(OUTPUT_DIR, COMMON_FILES.POM_XML),
    path.join(OUTPUT_DIR, COMMON_FILES.MVNW_CMD),
    path.join(OUTPUT_DIR, COMMON_FILES.GITIGNORE),
    path.join(OUTPUT_DIR, COMMON_FILES.DOCKERFILE),
    path.join(OUTPUT_DIR, COMMON_FILES.GITLAB_CI_YAML),
    path.join(OUTPUT_DIR, DIRECTORIES.RESOURCES, COMMON_FILES.APPLICATION_PROPERTIES),
  ];

  const directoryChecks = await Promise.all(directories.map((dir) => fs.pathExists(dir)));
  const fileChecks = await Promise.all(files.map((file) => fs.pathExists(file)));

  directoryChecks.forEach((exists, index) => {
    expect(exists).toBeTruthy();
  });

  fileChecks.forEach((exists, index) => {
    expect(exists).toBeTruthy();
  });

});

it(`should create a ${modelConfig.name}.json config file in .igrpstudio/model directory`, async () => {
  await saveModelFiles(modelConfig, OUTPUT_DIR);

  const modelFileConfig = `${modelConfig.name}${EXTENSIONS.JSON}`;
  const igrpstudioModelConfig = path.join(
    OUTPUT_DIR,
    DIRECTORIES.IGRPSTUDIO,
    DIRECTORIES.MODELS,
    modelFileConfig,
  );

  // check if the model configuration Json file was created in the .igrpstudio/model directory
  const modelConfigExists = await fs.pathExists(igrpstudioModelConfig);
  expect(modelConfigExists).toBeTruthy();

});

it(`should create the ${modelConfig.name} model from .igrpstudio/model/${modelConfig.name}.json directory`, async () => {
  const model = path.join(
    OUTPUT_DIR,
    DIRECTORIES.MAIN(apiConfig),
    DIRECTORIES.MODELS,
    modelConfig.name,
    `${modelConfig.name}${EXTENSIONS.JAVA}`,
  );

  await modelSetUp(OUTPUT_DIR);

  // check if the model was created in the correct API directory
  const modelExists = await fs.pathExists(model);
  expect(modelExists).toBeTruthy();
});
