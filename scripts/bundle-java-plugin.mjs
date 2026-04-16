/**
 * Bundles prettier-plugin-java (ESM) into a CJS file for Jest compatibility.
 * Run with: node scripts/bundle-java-plugin.mjs
 */
import {build} from '../node_modules/esbuild/lib/main.js';
import {fileURLToPath} from 'url';
import {dirname, join} from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

await build({
  entryPoints: [join(__dirname, '../node_modules/prettier-plugin-java/dist/index.js')],
  bundle: true,
  outfile: join(__dirname, '../__mocks__/prettier-java-plugin.cjs'),
  format: 'cjs',
  platform: 'node',
  banner: {
    js: `const __importMetaUrl = require('url').pathToFileURL(__filename).href;`,
  },
  define: {
    'import.meta.url': '__importMetaUrl',
  },
  logLevel: 'info',
});

console.log('✔ prettier-java-plugin.cjs generated successfully');
