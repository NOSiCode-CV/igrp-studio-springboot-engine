import {loadConfigs} from '../src';
// @ts-ignore
import {TEST_OUTPUT_DIR} from './outputDirPath';

test('load permissions configuration', async () => {
    const config = await loadConfigs(TEST_OUTPUT_DIR);

    console.dir(config, { depth: null, colors: true });

    expect(config).toBeDefined();
});
