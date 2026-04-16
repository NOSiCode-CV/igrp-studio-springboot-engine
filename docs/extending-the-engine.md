# Extending the Engine

This document describes how to add new operations, new generation targets, new templates, and how to extend existing functionality.

> **Before reading this, make sure you understand:**
> - [Architecture](./architecture.md) — module structure and design patterns
> - [Code Generation Pipeline](./code-generation-pipeline.md) — the 7-step pipeline every operation follows
> - [Configuration Types](./configuration-types.md) — all TypeScript interfaces

---

## Adding a New Public Operation

A "public operation" is a new function exported from `src/index.ts` (e.g., a new `addAspect()` function). Follow these steps:

### Step 1 — Define the Config Interface

Add your new config interface in `src/interfaces/types.ts`:

```typescript
// src/interfaces/types.ts
export interface AspectConfig extends IdentifiableElement, VersionedConfig {
  type: 'aspect';           // Must be a unique literal type
  name: string;
  module?: string;
  adviceType: 'before' | 'after' | 'around';
  pointcut: string;
}
```

**Rules:**
- Always include `type` as a string literal (used for manifest identification)
- Include `module?` so the element can be placed in any module
- Extend `IdentifiableElement` (adds optional `id`) and `VersionedConfig` (adds optional `version`)
- Prefer optional fields over required where it makes sense

---

### Step 2 — Add a JSON Schema Validator

Create `src/schema/aspectConfig.ts`:

```typescript
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import addErrors from 'ajv-errors';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
addErrors(ajv);

const schema = {
  type: 'object',
  additionalProperties: false,
  required: ['type', 'name', 'adviceType', 'pointcut'],
  properties: {
    id:          { type: 'string' },
    version:     { type: 'string' },
    type:        { type: 'string', const: 'aspect' },
    name:        { type: 'string', pattern: '^[a-zA-Z][a-zA-Z0-9_]*$' },
    module:      { type: 'string', pattern: '^[a-zA-Z][a-zA-Z0-9_]*$' },
    adviceType:  { type: 'string', enum: ['before', 'after', 'around'] },
    pointcut:    { type: 'string', minLength: 1 },
  },
  errorMessage: {
    properties: {
      name: 'name must start with a letter and contain only letters, digits, or underscores',
      type: 'type must be "aspect"',
    },
  },
};

export const aspectValidation = ajv.compile(schema);
```

**Rules:**
- Use `additionalProperties: false` — rejects unknown keys
- Use `pattern: '^[a-zA-Z][a-zA-Z0-9_]*$'` for all name fields
- Use `errorMessage` from `ajv-errors` for human-readable errors
- Export a compiled validator function (not the schema object)

---

### Step 3 — Create the Module Directory

```
src/modules/aspect/
├── generateAspect.ts      ← renders Handlebars template(s)
└── saveAspectConfig.ts    ← saves .igrpstudio manifest
```

**`saveAspectConfig.ts`:**

```typescript
import fs from 'fs-extra';
import path from 'path';
import { AspectConfig } from '../../interfaces/types';
import { DIRECTORIES } from '../../utils/constants';

export const saveAspectConfig = async (config: AspectConfig, basePath: string) => {
  const module = (config.module ?? 'shared').toLowerCase();
  // Define your manifest directory pattern
  const configDir = path.join(
    basePath,
    '.igrpstudio',
    module,
    'aspects',                   // new subdirectory under .igrpstudio/<module>/
  );

  await fs.ensureDir(configDir);
  await fs.writeJSON(
    path.join(configDir, `${config.name}.json`),
    config,
    { spaces: 2 },
  );
};
```

**`generateAspect.ts`:**

```typescript
import { AspectConfig, RenderContext } from '../../interfaces/types';
import { renderTemplate } from '../common/renderTemplate';
import { saveToFile } from '../common/saveToFile';
import { PROJECT_STRUCTURE_STYLE, TEMPLATES } from '../../utils/constants';
import { saveAspectConfig } from './saveAspectConfig';
import path from 'path';

export const generateAspect = async (context: RenderContext<AspectConfig>) => {
  const { resourceConfig, baseConfig, basePath, fullPath } = context;
  const module = (resourceConfig.module ?? 'shared').toLowerCase();

  // 1. Determine output path based on project structure style
  let outputDir: string;
  if (baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
    outputDir = path.join(fullPath, module, 'infrastructure', 'aspect');
  } else {
    outputDir = path.join(fullPath, 'aspect');
  }

  const outputPath = path.join(outputDir, `${resourceConfig.name}.java`);

  // 2. Render the Handlebars template
  const rendered = await renderTemplate(TEMPLATES.ASPECT, context);

  // 3. Save the Java file
  await saveToFile(rendered, outputPath, !resourceConfig.readOnly);

  // 4. Save the manifest
  await saveAspectConfig(resourceConfig, basePath);
};
```

---

### Step 4 — Create the Handlebars Template

Create `public/templates/aspect.hbs`:

```handlebars
/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME */

package {{resolvePackage fullPath basePath}};

import org.aspectj.lang.annotation.Aspect;
{{#if (eq resourceConfig.adviceType "before")}}
import org.aspectj.lang.annotation.Before;
{{/if}}
{{#if (eq resourceConfig.adviceType "after")}}
import org.aspectj.lang.annotation.After;
{{/if}}
{{#if (eq resourceConfig.adviceType "around")}}
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.ProceedingJoinPoint;
{{/if}}
import org.springframework.stereotype.Component;

@Aspect
@Component
public class {{capitalize resourceConfig.name}} {

  @{{capitalize resourceConfig.adviceType}}("{{resourceConfig.pointcut}}")
  public {{#if (eq resourceConfig.adviceType "around")}}Object{{else}}void{{/if}} execute(
    {{#if (eq resourceConfig.adviceType "around")}}ProceedingJoinPoint joinPoint{{/if}}
  ) {{#if (eq resourceConfig.adviceType "around")}}throws Throwable{{/if}} {
    // TODO: implement advice logic
    {{#if (eq resourceConfig.adviceType "around")}}
    return joinPoint.proceed();
    {{/if}}
  }

}
```

**Rules for templates:**
- Always start with the `/* THIS FILE WAS GENERATED AUTOMATICALLY */` header (2 lines)
- Use `{{resolvePackage fullPath basePath}}` for the `package` statement
- Use helpers from `src/helper/` (e.g., `{{capitalize}}`, `{{camelCase}}`)
- Keep Java formatting consistent with existing templates
- Never hardcode package names — always derive them from context

---

### Step 5 — Register the Template Name

Add the template constant to `src/utils/constants.ts`:

```typescript
export const TEMPLATES = {
  // ... existing entries ...
  ASPECT: 'aspect.hbs',     // ← add this
};
```

---

### Step 6 — Wire the Public API

In `src/index.ts`, add the import and the exported function:

```typescript
// Imports (add with other module imports)
import { aspectValidation } from './schema/aspectConfig';
import { generateAspect } from './modules/aspect/generateAspect';

// Exported function (add at the end of the file)
export const addAspect = async (dirty: AspectConfig, basePath: string) => {
  // 1. Clean
  const config = cleaner(dirty);

  // 2. Validate
  const valid = aspectValidation(config);
  if (!valid && aspectValidation.errors) throw aspectValidation.errors;

  // 3. Check basePath
  if (!basePath) throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;

  // 4. Load base API config
  const baseConfig = await getBaseApiConfig(basePath);

  // 5. Build RenderContext
  const context: RenderContext<AspectConfig> = {
    resourceConfig: config,
    basePath,
    baseConfig,
    fullPath: getMainPath(baseConfig.group, baseConfig.packageName),
  };

  // 6. Check for duplicates (optional but recommended)
  await checkDuplicated(config.name, config.module ?? 'shared', 'aspects', basePath);

  // 7. Generate
  await generateAspect(context);
};
```

---

### Step 7 — Add Tests

Create `__test__/addAspect.test.ts`:

```typescript
import { setEngineConfiguration, newApi, addAspect } from '../src/index';
import { DOMAIN_OUTPUT_DIR, TECHNICAL_OUTPUT_DIR } from './outputDirPath';

beforeAll(() => {
  setEngineConfiguration({ environment: 'development' });
});

describe('addAspect - technical style', () => {
  it('generates an aspect file', async () => {
    await addAspect({
      type: 'aspect',
      name: 'LoggingAspect',
      module: 'shared',
      adviceType: 'around',
      pointcut: 'execution(* com.example.myapp.services.*.*(..))',
    }, TECHNICAL_OUTPUT_DIR);
    // Add assertions: check file exists, check content, etc.
  });
});
```

---

## Adding a New Template Variant

If you want to add an alternative template for an existing operation (e.g., a new DTO template style), follow this pattern:

1. Create `public/templates/dto-my-variant.hbs`
2. Add `TEMPLATES.DTO_MY_VARIANT = 'dto-my-variant.hbs'` to `constants.ts`
3. Add the new value to the discriminator field in the config interface (e.g., `template: 'classic' | 'record' | 'my-variant'`)
4. Update the AJV schema enum for `template`
5. Update the generation function to branch on the new template name

---

## Backward Compatibility — Extending Existing Config Types

> **Critical rule:** The engine's manifests are stored on disk by IGRP Studio users. Adding a required field to an existing config type is a **breaking change** — all stored manifests without that field will fail validation.

**New fields on existing interfaces must always be optional (`?`).**

```typescript
// ✅ CORRECT — backward compatible
interface ControllerConfig extends ... {
  deprecated?: boolean;   // existing manifests without this field still validate
}

// ❌ WRONG — breaking change
interface ControllerConfig extends ... {
  deprecated: boolean;    // existing manifests will fail validation
}
```

The same applies to AJV schemas — never add a new field to the `required` array of an existing schema. If the field is logically required for correct generation, handle its absence gracefully in the generation logic:

```typescript
// In the generator — provide a safe default when the field is absent
const isDeprecated = resourceConfig.deprecated ?? false;
```

---

## Extending an Existing Module

### Adding a New Field to an Existing Config

Example: adding `deprecated?: boolean` to `ControllerConfig`.

1. **Add to interface** in `src/interfaces/types.ts` — **must be optional**:
   ```typescript
   interface ControllerConfig extends ... {
     // ... existing fields ...
     deprecated?: boolean;   // ← always optional for backward compatibility
   }
   ```

2. **Add to AJV schema** in `src/schema/controllerConfig.ts` — **do not add to `required`**:
   ```typescript
   properties: {
     // ... existing properties ...
     deprecated: { type: 'boolean' },   // ← add to properties only, not to required[]
   }
   ```

3. **Use in template** in `public/templates/controller.hbs`:
   ```handlebars
   {{#if resourceConfig.deprecated}}
   @Deprecated
   {{/if}}
   public class {{ControllerName}}Controller {
   ```

4. **No changes to `src/index.ts`** needed — the existing function already passes `resourceConfig` to the template.

---

## Extending an Existing Template with a New Partial

Partials live in `public/templates/partials/`. To add a new reusable partial:

1. Create `public/templates/partials/my-partial.hbs`
2. Use it in any template: `{{> my-partial}}`

Partials are loaded automatically by `renderTemplate` — no registration needed.

---

## Adding a New Handlebars Helper

Helpers live in `src/helper/`. To add a new helper:

1. Add the function to the appropriate helper file (or create a new one):
   ```typescript
   // src/helper/stringHelper.ts
   export const toSnakeCase = (str: string): string =>
     str.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`).replace(/^_/, '');
   ```

2. Register it in the helper registration file (the file that calls `Handlebars.registerHelper`):
   ```typescript
   Handlebars.registerHelper('toSnakeCase', toSnakeCase);
   ```

3. Use it in templates:
   ```handlebars
   {{toSnakeCase resourceConfig.name}}
   ```

---

## Template System Reference

### Available Helpers

| Helper | Signature | Description |
|--------|-----------|-------------|
| `capitalize` | `(str)` | PascalCase: `user_entity` → `UserEntity` |
| `capitalizeJavaStyle` | `(str)` | Same as capitalize but Java-aware |
| `camelCase` | `(str)` | `UserEntity` → `userEntity` |
| `pluralize` | `(str)` | `User` → `Users` |
| `resolvePackage` | `(fullPath, basePath)` | Derives `package com.example.myapp;` from paths |
| `resolveJavaType` | `(type, objectType)` | Maps engine types to Java types |
| `isPageable` | `(responses)` | True if any response is pageable |
| `eq` | `(a, b)` | Equality comparison in templates |
| `not` | `(val)` | Logical negation |

### Context Object in Templates

```handlebars
{{! Project-level config }}
{{baseConfig.group}}
{{baseConfig.packageName}}
{{baseConfig.projectStructureStyle}}
{{baseConfig.database}}

{{! Element-specific config }}
{{resourceConfig.name}}
{{resourceConfig.module}}
{{resourceConfig.attributes}}

{{! Computed paths }}
{{fullPath}}
{{basePath}}
```

---

## Generating Non-Java Resource Files

Some features require generating non-Java files — GraphQL schemas (`.graphqls`), YAML configs, XML, etc. The `saveToFile()` function is not Java-specific and works for any text content. The output path simply targets `src/main/resources/` instead of `src/main/java/`.

```typescript
// Non-Java output → src/main/resources/graphql/
const schemaPath = path.join(
  context.basePath,
  'src', 'main', 'resources', 'graphql',
  `${resourceConfig.name}.graphqls`,
);
const schemaContent = await renderTemplate(TEMPLATES.GRAPHQL_SCHEMA, context);
await saveToFile(schemaContent, schemaPath, !resourceConfig.readOnly);
```

Non-Java templates **do not** use the Java generated-file header or `package` statement:

```handlebars
{{! graphql-schema.hbs — no Java header, no package statement }}
type {{capitalize resourceConfig.name}} {
  {{#each resourceConfig.attributes}}
  {{this.name}}: {{resolveGraphQLType this.type}}
  {{/each}}
}
```

**The `.igrpstudio/` manifest must still be saved**, regardless of whether the operation generates Java or resource files. Without the manifest, the element is invisible to `deleteElement`, `moveElement`, and `loadConfigs`.

---

## Extending `newApi` with Optional Feature Flags

Some features (GraphQL, gRPC, observability) need to be enabled at project initialization time because they affect `pom.xml` dependencies and the initial directory structure.

**Step 1 — Add an optional flag to `BaseApiConfig`** (always optional — backward compatible):

```typescript
// src/interfaces/types.ts
interface BaseApiConfig extends IdentifiableElement, VersionedConfig {
  // ... existing fields ...
  enableGraphQL?: boolean;   // ← new optional flag
}
```

**Step 2 — Add to the AJV schema** (properties only, not required):

```typescript
// src/schema/baseApiConfig.ts
properties: {
  // ... existing properties ...
  enableGraphQL: { type: 'boolean' },
}
```

**Step 3 — Use in the `pom.xml` template**:

```handlebars
{{#if baseConfig.enableGraphQL}}
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-graphql</artifactId>
    </dependency>
{{/if}}
```

**Step 4 — Add new directories in `createAppDirectories.ts`** (if needed):

```typescript
// src/modules/baseApi/createAppDirectories.ts
if (context.baseConfig.enableGraphQL) {
  await fs.ensureDir(path.join(basePath, 'src', 'main', 'resources', 'graphql'));
}
```

The flag is persisted automatically in `.igrpstudio/baseApi.json` because `saveBaseApiFileConfig` saves the full config object — no extra save step needed.

---

## Checklist for a New Operation

Use this checklist when adding a new operation to the engine:

- [ ] Interface added to `src/interfaces/types.ts`
- [ ] If extending an existing type: new field is **optional** (`?`) and not in `required[]`
- [ ] AJV schema file created in `src/schema/` (or existing schema updated)
- [ ] Module directory created in `src/modules/<name>/`
- [ ] `generate<Name>.ts` created in the module directory
- [ ] `save<Name>Config.ts` created — manifest saved to `.igrpstudio/<module>/<type>/<Name>.json`
- [ ] Handlebars template created in `public/templates/`
- [ ] Non-Java templates do not include the Java generated-file header
- [ ] Template constant added to `TEMPLATES` in `src/utils/constants.ts`
- [ ] Public function added and exported in `src/index.ts`
- [ ] Tests added in `__test__/`
- [ ] Documentation updated in `docs/public-api.md` and `docs/configuration-types.md`
