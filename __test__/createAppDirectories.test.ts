import fs from 'fs-extra';
import path from 'path';
import { createDir } from '../src/modules/createAppDirectories'
import { ApiConfig } from '../src/interfaces/types';
import { OUTPUT_DIR, DIRECTORIES, ERROR_MESSAGE } from '../src/utils/constants';

// Defining the API object for testing
const api: ApiConfig = {
  type: 'baseApi',
  apiName: 'rest-api',
  group: 'nosi',
  artifact: 'igrp'
};

describe('createDir', () => {
  const mainDir = DIRECTORIES.MAIN(api);
  const outpathdir = path.join(OUTPUT_DIR, mainDir);
  const resourcDir = path.resolve(outpathdir, '../../');
  const testDir = path.join(OUTPUT_DIR, DIRECTORIES.TEST(api));
  const igrpstudioDir = path.join(OUTPUT_DIR, DIRECTORIES.IGRPSTUDIO);

  beforeAll( async () => {
    // Clean or prepare the environment before all tests
    await fs.ensureDir(OUTPUT_DIR);
  });

  afterAll(async () => {
    // Clean up after all tests
    // Delete directories created during testing

    await fs.remove(outpathdir);
  });

  afterEach(async () => {
    // Clean up after each test
    if (await fs.pathExists(outpathdir)) {
      await fs.remove(outpathdir);
    }
  });

  it('should create the directories correctly', async () => {
    
    await createDir(api, OUTPUT_DIR);

    // Define the expected directories
   
    const dirsToCheck = [
      path.join(outpathdir, 'models'),
      path.join(outpathdir, 'services'),
      path.join(outpathdir, 'controllers'),
      path.join(resourcDir, 'resources'),
      path.join(testDir, 'repositories'),
      path.join(testDir, 'services'),
      path.join(igrpstudioDir, 'controllers'),
      path.join(igrpstudioDir, 'models'),
    ];

    // Verify that each directory exists
    for (const dir of dirsToCheck) {
      expect(await fs.pathExists(dir)).toBe(true);
    }
  });

  it('should return DIRECTORY_ALREADY_EXISTS error if outpathdir already exists', async () => {
    // Create the directory to simulate that it already exists
    await fs.ensureDir(outpathdir);

    const result = await createDir(api, OUTPUT_DIR);

    expect(result).toBe(ERROR_MESSAGE.DIRECTORY_ALREADY_EXISTS);
    const exists = await fs.pathExists(outpathdir);
    expect(exists).toBe(true);
  });
});

