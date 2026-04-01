import {addModule, setEngineConfiguration} from '../src';
import {ModuleConfig} from '../src/interfaces/types';
// @ts-ignore
import {DOMAIN_OUTPUT_DIR, DOMAIN_OUTPUT_DIR2, TECHNICAL_OUTPUT_DIR, TEST_OUTPUT_TEC} from './outputDirPath';

const moduleConfig: ModuleConfig = {
  type: 'module',
  name: 'demo',
};

beforeAll(async () => {
  setEngineConfiguration({ environment: 'development' });
});

beforeEach(async () => {
 // await fs.mkdir(DOMAIN_OUTPUT_DIR, { recursive: true });
});

afterEach(async () => {
  // await fs.rm(OUTPUT_DIR, { recursive: true });
});

describe('New Module', () => {

  it('should create the module structure with all the directories.', async () => {
    await addModule(moduleConfig, DOMAIN_OUTPUT_DIR);
  });

  it('should create the module structure with all the directories.', async () => {
    await addModule(moduleConfig, TECHNICAL_OUTPUT_DIR);
  });
});