import fs from 'fs-extra';
import { addModule, newApi } from '../src/index';
import { ModuleConfig } from '../src/interfaces/types';

const OUTPUT_DIR = 'C:\spring-engine\generatedTest'

const moduleConfig: ModuleConfig = {
  type: 'module',
  name: 'CarRental',
};

beforeEach(async () => {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
});

afterEach(async () => {
  // await fs.rm(OUTPUT_DIR, { recursive: true });
});

describe('New Module', () => {

  it('should create the module structure with all the directories.', async () => {
    await addModule(moduleConfig, OUTPUT_DIR);
  });
});
