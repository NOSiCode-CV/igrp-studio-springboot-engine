## Adding a New Operation — Step-by-Step

This reference walks through every file that must be created or modified when adding a new public operation to the engine. Use `addEnum` as the closest analogous example.

> Full implementation guide: [docs/extending-the-engine.md](../../../../docs/extending-the-engine.md)
> Naming and path rules: [engine-patterns.md](./engine-patterns.md)

---

### File checklist (in implementation order)

```
1. src/interfaces/types.ts          ← add interface
2. src/schema/<name>Config.ts       ← create AJV validator
3. src/modules/<name>/
   ├── save<Name>Config.ts          ← create manifest saver
   └── generate<Name>.ts            ← create generator
4. public/templates/<name>.hbs      ← create template
5. src/utils/constants.ts           ← add TEMPLATES.<NAME> constant
6. src/index.ts                     ← add export function
7. __test__/add<Name>.test.ts       ← add tests
```

---

### File 1 — `src/interfaces/types.ts`

Add the config interface. Use the smallest set of fields needed.

```typescript
export interface MyFeatureConfig extends IdentifiableElement, VersionedConfig {
  type: 'myFeature';       // unique string literal — used to identify the manifest type
  name: string;            // PascalCase class name
  module?: string;         // which module (defaults to 'shared')
  readOnly?: boolean;      // if true, existing file is not overwritten
  // ... feature-specific fields
}
```

Also add `MyFeatureConfig` to the imports list at the top of `src/index.ts`.

---

### File 2 — `src/schema/<name>Config.ts`

```typescript
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import addErrors from 'ajv-errors';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
addErrors(ajv);

const NAME_PATTERN = '^[a-zA-Z][a-zA-Z0-9_]*$';

export const myFeatureValidation = ajv.compile({
  type: 'object',
  additionalProperties: false,
  required: ['type', 'name'],
  properties: {
    id:       { type: 'string' },
    version:  { type: 'string' },
    type:     { type: 'string', const: 'myFeature' },
    name:     { type: 'string', pattern: NAME_PATTERN },
    module:   { type: 'string', pattern: NAME_PATTERN },
    readOnly: { type: 'boolean' },
    // ... add feature-specific properties here
  },
  errorMessage: {
    properties: {
      name: 'name must start with a letter and contain only letters, digits, or underscores',
      type: 'type must be "myFeature"',
    },
  },
});
```

---

### File 3a — `src/modules/<name>/save<Name>Config.ts`

```typescript
import fs from 'fs-extra';
import path from 'path';
import { MyFeatureConfig } from '../../interfaces/types';

export const saveMyFeatureConfig = async (config: MyFeatureConfig, basePath: string) => {
  const module = (config.module ?? 'shared').toLowerCase();

  // Use .igrpstudio/<module>/<pluralFeatureName>/<Name>.json
  const configDir = path.join(basePath, '.igrpstudio', module, 'myfeatures');
  await fs.ensureDir(configDir);

  await fs.writeJSON(
    path.join(configDir, `${config.name}.json`),
    config,
    { spaces: 2 },
  );
};
```

---

### File 3b — `src/modules/<name>/generate<Name>.ts`

```typescript
import path from 'path';
import { MyFeatureConfig, RenderContext } from '../../interfaces/types';
import { renderTemplate } from '../common/renderTemplate';
import { saveToFile } from '../common/saveToFile';
import { PROJECT_STRUCTURE_STYLE, TEMPLATES } from '../../utils/constants';
import { saveMyFeatureConfig } from './saveMyFeatureConfig';

export const generateMyFeature = async (context: RenderContext<MyFeatureConfig>) => {
  const { resourceConfig, baseConfig, basePath, fullPath } = context;
  const module = (resourceConfig.module ?? 'shared').toLowerCase();

  // --- Determine Java output path ---
  let outputDir: string;
  if (baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
    // Domain style: place under module's infrastructure layer
    outputDir = path.join(fullPath, module, 'infrastructure', 'myfeature');
  } else {
    // Technical style: place in a top-level directory
    outputDir = path.join(fullPath, 'myfeature');
  }
  const outputPath = path.join(outputDir, `${resourceConfig.name}.java`);

  // --- Render the template ---
  const rendered = await renderTemplate(TEMPLATES.MY_FEATURE, context);

  // --- Write Java file to disk ---
  await saveToFile(rendered, outputPath, !resourceConfig.readOnly);

  // --- Save the .igrpstudio manifest ---
  await saveMyFeatureConfig(resourceConfig, basePath);
};
```

---

### File 4 — `public/templates/<name>.hbs`

```handlebars
/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME */

package {{resolvePackage fullPath basePath}};

{{! Add necessary imports }}
import org.springframework.stereotype.Component;

@Component
public class {{capitalize resourceConfig.name}} {

  {{! Render feature-specific Java code }}
  {{#each resourceConfig.someField}}
  // {{this.name}}
  {{/each}}

}
```

**Key template rules (see [template-system.md](./template-system.md) for full reference):**
- Line 1-2: mandatory generated-file comment header
- `package {{resolvePackage fullPath basePath}};` — always use this helper
- `{{capitalize resourceConfig.name}}` — always capitalize class names
- No extra blank lines between the header and the package declaration

---

### File 5 — `src/utils/constants.ts`

Add the template constant inside the `TEMPLATES` object:

```typescript
export const TEMPLATES = {
  // ... existing entries ...
  MY_FEATURE: 'myfeature.hbs',    // ← kebab-case, match the .hbs filename
};
```

Optionally add a `DIRECTORIES` entry for the new manifest path:

```typescript
export const DIRECTORIES = {
  // ... existing entries ...
  CONFIG_MY_FEATURE: '.igrpstudio/{{module}}/myfeatures',
};
```

---

### File 6 — `src/index.ts`

Add the import block at the top (with other schema and module imports):

```typescript
import { myFeatureValidation } from './schema/myFeatureConfig';
import { generateMyFeature } from './modules/myFeature/generateMyFeature';
```

Add the exported function at the end of the file, following this **exact pattern**:

```typescript
/**
 * Generates a MyFeature class for the given configuration.
 *
 * @param {MyFeatureConfig} dirty - The configuration object.
 * @param {string} basePath - The output path where the API lives.
 */
export const addMyFeature = async (dirty: MyFeatureConfig, basePath: string) => {
  // Step 1: Clean unknown keys
  const config = cleaner(dirty);

  // Step 2: Validate schema
  const valid = myFeatureValidation(config);
  if (!valid && myFeatureValidation.errors) throw myFeatureValidation.errors;

  // Step 3: Check basePath
  if (!basePath) throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;

  // Step 4: Load project config
  const baseConfig = await getBaseApiConfig(basePath);

  // Step 5: Build RenderContext
  const context: RenderContext<MyFeatureConfig> = {
    resourceConfig: config,
    basePath,
    baseConfig,
    fullPath: getMainPath(baseConfig.group, baseConfig.packageName),
  };

  // Step 6: Generate (includes manifest save + Java file write)
  await generateMyFeature(context);
};
```

---

### File 7 — `__test__/add<Name>.test.ts`

```typescript
import { setEngineConfiguration, newApi, addMyFeature } from '../src/index';
import path from 'path';

const OUTPUT_DIR = path.join(__dirname, '../test-output/myfeature');

beforeAll(async () => {
  setEngineConfiguration({ environment: 'development' });
  await newApi({
    type: 'springboot',
    name: 'test_api',
    group: 'com.example',
    artifact: 'testapp',
    database: 'MySQL',
    projectStructureStyle: 'technical',
    enableObservability: false,
    enableEntityRevision: false,
    enableGraalVm: false,
  }, OUTPUT_DIR);
});

describe('addMyFeature — technical style', () => {
  it('generates a MyFeature class', async () => {
    await expect(
      addMyFeature({
        type: 'myFeature',
        name: 'LoggingFeature',
        module: 'shared',
      }, OUTPUT_DIR)
    ).resolves.not.toThrow();
  });

  it('writes the manifest to .igrpstudio', async () => {
    const manifestPath = path.join(
      OUTPUT_DIR, '.igrpstudio', 'shared', 'myfeatures', 'LoggingFeature.json'
    );
    const fs = await import('fs-extra');
    expect(await fs.pathExists(manifestPath)).toBe(true);
  });
});
```

---

### After implementation

Run the tests:
```bash
npm test -- --testPathPattern=addMyFeature
```

Then update the project documentation:
- Add the new function to [docs/public-api.md](../../../../docs/public-api.md)
- Add the new interface to [docs/configuration-types.md](../../../../docs/configuration-types.md)
