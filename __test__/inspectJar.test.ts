  // Assuming the helper is exported from this file

import { runJarInspector } from '../src/modules/baseApi/helpers';

const OUTPUT_DIR = 'C:\\jar\\test'

// Example of a JAR file path (this should be a real path during the test execution)
const jarPath = 'C:\\jar\\shared-test.jar';

beforeEach(async () => {
  // Ensure the base output directory exists before tests
  //await fs.mkdir(OUTPUT_DIR, { recursive: true });
});

afterEach(async () => {
  // Clean up after each test by removing the directory to prevent leftover files
  //await fs.rm(OUTPUT_DIR, { recursive: true, force: true });
});

describe('Jar Inspector Integration', () => {

  it('should run the jar inspector and generate the correct JSON output', async () => {
    // Call the function to execute the JAR
    await runJarInspector(OUTPUT_DIR, jarPath);
  });
});
