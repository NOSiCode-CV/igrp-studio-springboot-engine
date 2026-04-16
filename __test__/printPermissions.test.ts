import {loadConfigs} from '../src';
// @ts-ignore
import {TEST_OUTPUT_DIR} from './outputDirPath';

test('Extrai e imprime todas as permissões no diretório (async)', async () => {
    console.log('Base path:', TEST_OUTPUT_DIR);

    const config = await loadConfigs(TEST_OUTPUT_DIR);

    console.log(JSON.stringify(config, null, 2));

    expect(config.permissionGroups.length).toBeGreaterThan(0);
    expect(config.permissionGroups[0].permissions.length).toBeGreaterThan(0);
});
