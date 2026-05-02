import * as fs from 'fs';
import * as path from 'path';
import {addGraphQLSchema, setEngineConfiguration} from '../src';

const PROJECTS = [
  'C:\\spring-engine\\demoTechnical',
  'C:\\spring-engine\\demoDomain',
];

function collectManifests(igrpDir: string): string[] {
  const found: string[] = [];
  const walk = (dir: string) => {
    if (!fs.existsSync(dir)) return;
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f);
      if (fs.statSync(full).isDirectory()) { walk(full); }
      else if (f.endsWith('.json') && full.includes('graphql') && !full.includes('types')) {
        found.push(full);
      }
    }
  };
  walk(igrpDir);
  return found;
}

describe('Regenerate GraphQL schemas in existing projects', () => {
  beforeAll(() => { setEngineConfiguration({environment: 'development'}); });

  for (const proj of PROJECTS) {
    const manifests = collectManifests(path.join(proj, '.igrpstudio'));
    for (const manifestPath of manifests) {
      it(`${path.basename(proj)}: regenerate ${path.basename(manifestPath, '.json')}`, async () => {
        const config = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
        await addGraphQLSchema(config, proj);
      });
    }
  }
});
