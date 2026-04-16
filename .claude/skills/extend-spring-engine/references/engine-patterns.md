## Engine Patterns and Conventions

### Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Config interface | PascalCase + `Config` suffix | `AspectConfig`, `ExceptionConfig` |
| Public function | camelCase, verb + noun | `addAspect`, `generateEnum`, `deleteElement` |
| Module directory | lowercase, noun | `src/modules/aspect/` |
| Generate function | `generate` + PascalCase | `generateAspect` |
| Save config function | `save` + PascalCase + `Config` | `saveAspectConfig` |
| AJV validator | camelCase + `Validation` | `aspectValidation` |
| Template file | kebab-case `.hbs` | `aspect.hbs`, `dto-record.hbs` |
| `TEMPLATES` constant | UPPER_SNAKE_CASE | `TEMPLATES.ASPECT` |
| Java output directories | lowercase | `aspect/`, `controllers/` |
| `.igrpstudio` subdir | lowercase, plural | `aspects/`, `controllers/`, `models/` |

---

### File Placement Rules

| Artifact | Location |
|----------|---------|
| TypeScript interface | `src/interfaces/types.ts` |
| AJV schema validator | `src/schema/<name>Config.ts` |
| Generation module | `src/modules/<name>/generate<Name>.ts` |
| Config saver | `src/modules/<name>/save<Name>Config.ts` |
| Handlebars template | `public/templates/<name>.hbs` |
| Handlebars partial | `public/templates/partials/<name>.hbs` |
| String/logic helper | `src/helper/stringHelper.ts` or `logicalHelper.ts` |
| Constants | `src/utils/constants.ts` |
| Tests | `__test__/add<Name>.test.ts` |

---

### `DIRECTORIES` Constants

All `.igrpstudio` paths are constructed using `DIRECTORIES` constants from `src/utils/constants.ts`. Never hardcode paths.

```typescript
// Pattern for a new manifest directory:
const configDir = path.join(basePath, DIRECTORIES.IGRPSTUDIO, module, 'aspects');

// Existing patterns for reference:
DIRECTORIES.CONFIG_MODEL      = '.igrpstudio/{{module}}/models'
DIRECTORIES.CONFIG_DTO        = '.igrpstudio/{{module}}/dto'
DIRECTORIES.CONFIG_CONTROLLER = '.igrpstudio/{{module}}/controllers'
DIRECTORIES.CONFIG_ENUM       = '.igrpstudio/{{module}}/enum'
DIRECTORIES.IGRPSTUDIO        = '.igrpstudio'
```

When adding a new config type, add its directory pattern to `DIRECTORIES`:
```typescript
DIRECTORIES.CONFIG_ASPECT = '.igrpstudio/{{module}}/aspects'
```

---

### Java Path Construction

All Java output paths are derived from `fullPath` (which is `src/main/java/<group>/<packageName>`):

```typescript
// From getMainPath() in src/utils/helpers.ts:
fullPath = getMainPath(baseConfig.group, baseConfig.packageName)
// = 'src/main/java/com/example/myapp'

// Technical style paths:
const outputDir = path.join(fullPath, 'aspect');
// = 'src/main/java/com/example/myapp/aspect'

// Domain style paths (always include module):
const outputDir = path.join(fullPath, module, 'infrastructure', 'aspect');
// = 'src/main/java/com/example/myapp/users/infrastructure/aspect'
```

**Never** compute Java paths as raw strings — always use `path.join()` with `fullPath`.

---

### `PROJECT_STRUCTURE_STYLE` Constants

Always use the constants, never compare against raw strings:

```typescript
import { PROJECT_STRUCTURE_STYLE } from '../../utils/constants';

if (context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
  // domain paths
} else {
  // technical paths (PROJECT_STRUCTURE_STYLE.TECHNICAL)
}
```

Values:
- `PROJECT_STRUCTURE_STYLE.TECHNICAL = 'technical'`
- `PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN = 'domain'`

---

### Module Default

When a `module` field is optional and not provided, it defaults to `'shared'`:

```typescript
const module = (resourceConfig.module ?? 'shared').toLowerCase();
```

Always call `.toLowerCase()` on the module name when building file paths.

---

### The `cleaner()` Function

`cleaner()` from `src/modules/common/cleanerConfigFile.ts` removes any extra keys from the raw input object. It must always be the **first call** in a public API function:

```typescript
export const addMyFeature = async (dirty: MyFeatureConfig, basePath: string) => {
  const config = cleaner(dirty);   // ← always first
  // then validate, then everything else
};
```

---

### `saveToFile()` Parameters

```typescript
await saveToFile(
  renderedString,          // string: rendered Java source
  absoluteOutputPath,      // string: full path to .java file
  canOverwrite,            // boolean: !resourceConfig.readOnly
  elementType?,            // string: 'models', 'controllers', etc. (optional)
  elementId?,              // string: resourceConfig.id (optional)
  module?,                 // string: module name (optional)
  basePath?,               // string: project root (optional)
);
```

The minimum call is `saveToFile(rendered, outputPath, !config.readOnly)`.

---

### AJV Schema Pattern

Every schema file follows this structure:

```typescript
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import addErrors from 'ajv-errors';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
addErrors(ajv);

const NAME_PATTERN = '^[a-zA-Z][a-zA-Z0-9_]*$';

const schema = {
  type: 'object',
  additionalProperties: false,              // MANDATORY
  required: ['type', 'name', ...],          // list all required fields
  properties: {
    id:      { type: 'string' },
    version: { type: 'string' },
    type:    { type: 'string', const: 'myFeature' },
    name:    { type: 'string', pattern: NAME_PATTERN },
    module:  { type: 'string', pattern: NAME_PATTERN },
    // ... feature-specific properties
  },
  errorMessage: {
    properties: {
      name: 'name must start with a letter and contain only letters, digits, or underscores',
    },
  },
};

export const myFeatureValidation = ajv.compile(schema);
```

---

### Test Structure

Tests use the same `setEngineConfiguration({ environment: 'development' })` pattern:

```typescript
import { setEngineConfiguration, newApi, addMyFeature } from '../src/index';

const OUTPUT_DIR = '/some/test/output/dir';

beforeAll(async () => {
  setEngineConfiguration({ environment: 'development' });
  // Optionally create a base API first:
  await newApi({ type: 'springboot', name: 'test', ... }, OUTPUT_DIR);
});

describe('addMyFeature', () => {
  it('generates for technical style', async () => {
    await addMyFeature({ type: 'myFeature', name: 'TestFeature', ... }, OUTPUT_DIR);
    // assert file exists at expected path
    // assert content matches expected Java
  });
});
```
