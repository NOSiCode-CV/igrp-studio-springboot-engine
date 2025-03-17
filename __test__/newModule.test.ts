import fs from 'fs-extra';
import { addModule } from '../src';
import { ModuleConfig } from '../src/interfaces/types';
// @ts-ignore
import { DOMAIN_OUTPUT_DIR } from './outputDirPath';

const moduleConfig: ModuleConfig = {
  type: 'module',
  name: 'external',
};

beforeEach(async () => {
  await fs.mkdir(DOMAIN_OUTPUT_DIR, { recursive: true });
});

afterEach(async () => {
  // await fs.rm(OUTPUT_DIR, { recursive: true });
});

describe('New Module', () => {

  it('should create the module structure with all the directories.', async () => {
    await addModule(moduleConfig, DOMAIN_OUTPUT_DIR);
  });
});