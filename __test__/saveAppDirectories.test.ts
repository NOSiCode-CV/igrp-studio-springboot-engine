import fs from 'fs-extra';
import path from 'path';
import { OUTPUT_DIR } from '../src/utils/constants';
import { saveAppDirectories } from '../src/modules/createAppDirectories';

afterEach(async () => {
  await fs.rm(OUTPUT_DIR, { recursive: true });
});

it('should create the directory in the specified path', async () => {
  const dirs = [OUTPUT_DIR];

  await saveAppDirectories(dirs);

  const existPath = await Promise.all(dirs.map((dir) => fs.pathExists(dir)));
  expect(existPath).toBeTruthy();
});

it('should create an subdirectory in the specified directory.', async () => {
  const dirs = [path.join(OUTPUT_DIR, 'testDir')];
  const dirsCreated = [OUTPUT_DIR, ...dirs];

  await saveAppDirectories(dirs);

  const existPath = await Promise.all(dirsCreated.map((dir) => fs.pathExists(dir)));
  expect(existPath).toBeTruthy();
});

it('should not overwrite the directory when creating twice', async () => {
  const dirs = [OUTPUT_DIR, path.join(OUTPUT_DIR, 'testDir')];
  await saveAppDirectories(dirs);

  dirs.pop();
  await saveAppDirectories(dirs);

  const existPath = fs.pathExists(path.join(OUTPUT_DIR, 'testDir'));
  expect(existPath).toBeTruthy();
});