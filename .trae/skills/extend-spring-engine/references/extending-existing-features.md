## Extending Existing Features

This reference covers changes that evolve what the engine already supports — without adding a new operation. Common cases: adding a new type to an existing feature, adding a new field to an existing config, changing generation behavior, or improving a template.

> For adding a brand-new exported function, use [adding-new-operation.md](./adding-new-operation.md).

---

### Category 1 — Adding a New Type to an Existing Feature

**Example:** Add `uuid` support to `requestParams` in `addController`.

This type of change touches 4 layers that must always be kept in sync:

```
1. src/utils/constants.ts          ← add to the type enum/array
2. src/schema/<name>Config.ts      ← add to the AJV enum for that field
3. public/templates/<name>.hbs     ← handle new type in rendering + imports
4. __test__/<name>.test.ts         ← add test case using the new type
```

#### Step 1 — Add to constants

Find the relevant type array in `src/utils/constants.ts`. For `requestParams`:

```typescript
export const PARAMS_TYPES = [
  'string', 'integer', 'long', 'boolean', 'double', 'float',
  'uuid',   // ← add here
] as const;

export type ParamsTypes = (typeof PARAMS_TYPES)[number];
```

For `ModelAttributeType`, `AttributeType`, `CollectionType`, etc., find the corresponding array and add the new value.

#### Step 2 — Update the AJV schema

In `src/schema/controllerConfig.ts`, find the `requestParams` item definition and add the new value to the `enum`:

```typescript
// Before:
type: { type: 'string', enum: ['string', 'integer', 'long', 'boolean', 'double', 'float'] }

// After:
type: { type: 'string', enum: ['string', 'integer', 'long', 'boolean', 'double', 'float', 'uuid'] }
```

#### Step 3 — Update the template

In `public/templates/controller.hbs` (or the relevant `.hbs` file), add the type mapping and import:

```handlebars
{{! In the imports block — add UUID import when needed }}
{{#if (hasType resourceConfig.actions "uuid")}}
import java.util.UUID;
{{/if}}

{{! In the parameter rendering — map uuid to UUID }}
{{#if (eq param.type "uuid")}}
@RequestParam(value = "{{param.name}}", required = {{param.isRequired}}) UUID {{camelCase param.name}}
{{/if}}
```

If a helper like `hasType` doesn't exist yet, add it to `src/helper/logicalHelper.ts` and register it (see [template-system.md](./template-system.md)).

#### Step 4 — Add a test

```typescript
it('generates a controller with uuid requestParam', async () => {
  await addController({
    type: 'controller',
    name: 'Search',
    basePath: '/api/v1/search',
    description: 'Search endpoints',
    actions: [{
      actionName: 'findById',
      method: 'GET',
      requestParams: [{ type: 'uuid', name: 'id', isRequired: true }],
    }],
  }, OUTPUT_DIR);
  // assert file contains: UUID id
});
```

---

### Category 2 — Adding a New Field to an Existing Config

**Example:** Add `deprecated?: boolean` to `ControllerConfig`.

Touch 3 layers:

```
1. src/interfaces/types.ts         ← add field to the interface
2. src/schema/controllerConfig.ts  ← add field to AJV properties
3. public/templates/controller.hbs ← use field in the template
```

No changes to `constants.ts` needed (boolean fields have no enum).

#### Step 1 — Interface

```typescript
// src/interfaces/types.ts
interface ControllerConfig extends IdentifiableElement, VersionedConfig {
  // ... existing fields ...
  deprecated?: boolean;   // ← add
}
```

#### Step 2 — Schema

```typescript
// src/schema/controllerConfig.ts
properties: {
  // ... existing properties ...
  deprecated: { type: 'boolean' },   // ← add
}
```

Do **not** add `deprecated` to the `required` array — it is optional.

#### Step 3 — Template

```handlebars
{{! public/templates/controller.hbs }}
{{#if resourceConfig.deprecated}}
@Deprecated
{{/if}}
public class {{capitalize resourceConfig.name}}Controller {
```

#### Notes
- If the field affects the manifest path or file naming, also update the `save*Config.ts` function.
- If the field affects generation of secondary files (e.g., service, handler), update those templates too.
- The `cleaner()` function strips unknown keys — since the field is now in the interface and schema, it will pass through correctly after this change.

---

### Category 3 — Changing Generation Behavior

**Example:** "The generated service always returns `void` — infer the return type from the controller action's response."

This type of change is purely in the generation logic or template — no schema change needed.

```
Files to change:
- public/templates/<name>.hbs       ← change how the value is rendered
- src/modules/<name>/generate*.ts   ← change how the context is built (if needed)
- src/helper/*.ts                   ← add/update a helper if the logic is complex
```

#### Pattern: move logic to a helper

If the behavior requires non-trivial computation, extract it into a Handlebars helper rather than putting logic in the template:

```typescript
// src/helper/controllerHelper.ts
export const resolveServiceReturnType = (action: ControllerAction): string => {
  if (!action.responses) return 'void';
  const codes = Object.keys(action.responses);
  if (codes.length !== 1) return 'ResponseEntity<?>';
  // ... resolve from the single response body schema
  return resolvedType;
};

// register in the helper registration file:
Handlebars.registerHelper('resolveServiceReturnType', resolveServiceReturnType);
```

Then use in the template:

```handlebars
public {{resolveServiceReturnType this}} {{camelCase this.actionName}}(...) {
```

#### Pattern: extend the RenderContext with computed data

If the template needs data that requires computation from multiple config fields, compute it before rendering and attach it to the context:

```typescript
// src/modules/controller/generateController.ts
const enrichedContext = {
  ...context,
  computedReturnTypes: context.resourceConfig.actions.map(resolveReturnType),
};
const rendered = await renderTemplate(TEMPLATES.CONTROLLER, enrichedContext);
```

---

### Category 4 — Adding Validation to an Existing Config

**Example:** "When `method` is `GET`, `requestBody` should not be allowed."

Add a custom AJV keyword or `if/then` rule to the schema:

```typescript
// src/schema/controllerConfig.ts
{
  // Inside the action item schema:
  if: { properties: { method: { const: 'GET' } }, required: ['method'] },
  then: {
    not: { required: ['requestBody'] },
    errorMessage: 'GET actions cannot have a requestBody',
  },
}
```

For cross-field validation that AJV cannot express cleanly, add a runtime check in the generation function:

```typescript
// src/modules/controller/generateController.ts
export const generateController = async (context: RenderContext<ControllerConfig>) => {
  for (const action of context.resourceConfig.actions) {
    if (action.method === 'GET' && action.requestBody) {
      throw new Error(`Action "${action.actionName}": GET actions cannot have a requestBody.`);
    }
  }
  // ... rest of generation
};
```

---

---

### Category 5 — Generating Non-Java Files (resources, GraphQL schema, YAML, XML)

**Example:** Add `addGraphQLType` that generates a `.graphqls` schema file alongside a Java resolver.

The `saveToFile()` function saves any rendered string to any path — it is not Java-specific. The pattern is identical, but the output path uses a resources directory and a non-`.java` extension.

```typescript
// src/modules/graphql/generateGraphQLType.ts

// Non-Java file (GraphQL schema) → goes to src/main/resources/graphql/
const schemaOutputPath = path.join(
  context.basePath,
  'src', 'main', 'resources', 'graphql',
  `${resourceConfig.name}.graphqls`,
);
const schemaRendered = await renderTemplate(TEMPLATES.GRAPHQL_SCHEMA, context);
await saveToFile(schemaRendered, schemaOutputPath, !resourceConfig.readOnly);

// Java file (resolver) → goes to src/main/java/...
const resolverOutputPath = path.join(outputDir, `${resourceConfig.name}Resolver.java`);
const resolverRendered = await renderTemplate(TEMPLATES.GRAPHQL_RESOLVER, context);
await saveToFile(resolverRendered, resolverOutputPath, !resourceConfig.readOnly);
```

**Non-Java templates do NOT use the Java header or `package` statement:**

```handlebars
{{! public/templates/graphql-schema.hbs — NO Java header here }}
type {{capitalize resourceConfig.name}} {
  {{#each resourceConfig.attributes}}
  {{this.name}}: {{resolveGraphQLType this.type}}
  {{/each}}
}
```

#### Manifest save is MANDATORY for non-Java files too

Every operation — even those that only generate resource files — **must** save its manifest to `.igrpstudio/`. This is the metadata that allows IGRP Studio to track, re-generate, move, and delete the element.

```typescript
// Always save the manifest, regardless of what files were generated
await saveGraphQLTypeConfig(resourceConfig, basePath);
// → writes .igrpstudio/<module>/graphql/<Name>.json
```

Without this, the element is invisible to the engine's `deleteElement`, `moveElement`, and `loadConfigs` operations.

---

### Category 6 — Extending `newApi` with Optional Feature Flags

**Example:** Add `enableGraphQL?: boolean` to `BaseApiConfig` to wire GraphQL dependencies into `pom.xml`.

This is a special case because it extends the project initialization (`newApi`), not a per-element operation. It affects the base scaffold.

#### Step 1 — Add field as optional to the interface

```typescript
// src/interfaces/types.ts
interface BaseApiConfig extends IdentifiableElement, VersionedConfig {
  // ... existing fields (DO NOT change existing fields to required) ...
  enableGraphQL?: boolean;   // ← always optional — see backward compatibility note below
}
```

#### Step 2 — Update the AJV schema

```typescript
// src/schema/baseApiConfig.ts
properties: {
  // ... existing properties ...
  enableGraphQL: { type: 'boolean' },   // ← optional, no addition to required[]
}
```

#### Step 3 — Update the `pom.xml` template

```handlebars
{{! public/templates/pom.hbs }}
{{#if baseConfig.enableGraphQL}}
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-graphql</artifactId>
    </dependency>
{{/if}}
```

#### Step 4 — Update `createAppDirectories` if new directories are needed

If the feature requires new folders (e.g., `src/main/resources/graphql/`), add them in `src/modules/baseApi/createAppDirectories.ts`.

#### Step 5 — The manifest saves automatically

Since `newApi` calls `saveBaseApiFileConfig(config, basePath)` before generating files, and `config` now includes `enableGraphQL`, the flag is persisted in `.igrpstudio/baseApi.json` automatically — no extra save step needed.

---

### Backward Compatibility — Adding Fields to Existing Config Types

**This is critical.** The engine's manifests are stored on disk and consumed by existing IGRP Studio installations. Adding a required field to an existing config type is a **breaking change** — it will cause validation errors for all manifests that don't have the new field.

**Rule: new fields on existing interfaces must always be optional.**

```typescript
// ✅ CORRECT — optional field, backward compatible
interface ControllerConfig extends ... {
  deprecated?: boolean;       // existing manifests without this field still validate
}

// ❌ WRONG — required field, breaks existing manifests
interface ControllerConfig extends ... {
  deprecated: boolean;        // existing manifests will fail validation
}
```

The same rule applies to AJV schemas — never add a new field to the `required` array of an existing schema.

If a field is logically required for correct generation, handle the absence gracefully in the generation logic or template:

```typescript
// In the generator — provide a sensible default if the field is absent
const isDeprecated = resourceConfig.deprecated ?? false;
```

---

### Consistency checklist for extending existing features

- [ ] `constants.ts` updated if a new enum value was added
- [ ] AJV schema updated to accept the new field/value
- [ ] TypeScript interface updated to reflect the new field/value (**always optional** if adding to existing type)
- [ ] New field is **not** added to the `required` array in the AJV schema (backward compatibility)
- [ ] Template updated to use the new field/value (both `technical` and `domain` branches if relevant)
- [ ] Generator handles absent optional fields with a safe default
- [ ] Helper added/updated if logic is non-trivial
- [ ] Non-Java resource files also have their manifest saved to `.igrpstudio/`
- [ ] `save*Config.ts` updated if the field affects manifest storage
- [ ] Tests added for the new behavior
- [ ] `docs/configuration-types.md` updated if the public interface changed
- [ ] `docs/public-api.md` updated if function behavior changed visibly
