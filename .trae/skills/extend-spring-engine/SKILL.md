---
name: "extend-spring-engine"
description: "Guides any evolution of the IGRP Spring Engine codebase — adding new operations, extending existing ones (new fields, new types, new behaviors), improving generation logic, adding templates or helpers. Invoke whenever the goal is to make the engine itself do something it currently cannot or does not do well."
---

# Extend Spring Engine

## Goal

Guide any evolution of the engine codebase (`src/`) so that every change is consistent with existing architecture, patterns, naming, and pipeline order. This skill covers the full spectrum of engine evolution — from adding a brand-new exported operation to simply teaching the engine to support a new Java type in an existing feature.

## When to use this skill

**Adding new capabilities:**
- "Add a new `addAspect` operation to the engine"
- "Add support for generating exception handler classes"
- "Add a new project structure style"

**Extending existing features:**
- "The engine doesn't support `uuid` as a type in `requestParams` — add it"
- "Add a `deprecated` flag to `ControllerConfig`"
- "Support `@NotEmpty` validation in DTOs"
- "Add `SEQUENCE` generation strategy support to model primary keys"

**Improving generation quality:**
- "The generated service always returns `void` — it should infer the return type"
- "Add `@JsonProperty` to DTO fields when `jsonAttributeName` is set"
- "Improve how enum imports are resolved in controllers"

**Template and helper work:**
- "Add a new Handlebars template variant for DTOs"
- "Add a `toKebabCase` helper"
- "Extract the imports block into a reusable partial"

**Do NOT use this skill** to generate Spring Boot project files using the engine. For that, use the `igrp-spring-generator` skill.

---

## Mandatory Workflow (follow in order)

### 1. Classify the change

Identify which category applies — this determines which reference files to read:

| Category | Description | Reference |
|----------|-------------|-----------|
| **A) New operation** | Brand-new exported function + new module + new template | [adding-new-operation.md](./references/adding-new-operation.md) |
| **B) New module type** | Multi-file generator (like `addController`) | [adding-new-module-type.md](./references/adding-new-module-type.md) |
| **C) Extend existing feature** | New field, new type support, new behavior, non-Java resource files, `newApi` feature flags | [extending-existing-features.md](./references/extending-existing-features.md) |
| **D) Template / helper work** | New template, template variant, new partial, new Handlebars helper | [template-system.md](./references/template-system.md) |

A single request may span multiple categories — e.g., "add UUID support to requestParams" is **C** (extend type mapping) + **D** (update template).

---

### 2. Read the documentation

Before writing any code, read what is relevant:

- **Always read first:** [Architecture](../../../docs/architecture.md) and [Code Generation Pipeline](../../../docs/code-generation-pipeline.md)
- For type/interface details: [Configuration Types](../../../docs/configuration-types.md)
- For existing function signatures: [Public API](../../../docs/public-api.md)
- For extension how-tos: [Extending the Engine](../../../docs/extending-the-engine.md)

Then load the reference files for the identified category (see table above).

---

### 3. Read the relevant source files

Read the actual source before touching anything:

| If you are working on | Read first |
|-----------------------|-----------|
| New operation | analogous `src/modules/<similar>/generate*.ts` and `save*Config.ts` |
| Extending a config | `src/interfaces/types.ts` + `src/schema/<name>Config.ts` |
| Adding a type | `src/utils/constants.ts` (type enums) + the template where the type is used |
| Modifying a template | `public/templates/<name>.hbs` + the helper files it uses |
| Adding a helper | `src/helper/stringHelper.ts` or `logicalHelper.ts` |
| Schema validation | `src/schema/<name>Config.ts` |

**Never assume — always read first.**

---

### 4. Plan before coding

Clearly state what will change and why:
- Which files will be created
- Which files will be modified (and what changes)
- Whether schema, interface, template, and constants all need to align
- Whether both `technical` and `domain` styles are affected

---
bo
### 5. Implement

For **new operations**, follow the 7-step pipeline (non-negotiable):
1. `cleaner(dirty)` — strip unknown keys
2. AJV schema validate — throw on invalid
3. `getBaseApiConfig(basePath)` — load project config
4. Build `RenderContext<T>` — assemble context
5. Save manifest to `.igrpstudio/` — before Java generation
6. Render Handlebars template(s) — to string(s)
7. `saveToFile()` — write Java file(s) to disk

For **extending existing features**, the pipeline is already in place — identify exactly which step(s) need to change and only touch those.

---

### 6. Verify conformance

After implementing:
- [ ] TypeScript interface change is reflected in the AJV schema (and vice versa)
- [ ] AJV schema keeps `additionalProperties: false`
- [ ] New fields on existing types are **optional** (`?`) — not added to `required[]`
- [ ] New types added to `constants.ts` type enum arrays
- [ ] Template changes handle both `technical` and `domain` styles if path-dependent
- [ ] Template header (2-line comment) is present on all new Java `.hbs` files (not on resource files)
- [ ] `.igrpstudio/` manifest is saved for every operation, including non-Java generators
- [ ] Tests cover the new or changed behavior
- [ ] Documentation updated in `docs/` if the public API surface changed
- [ ] If the extension is large enough to introduce a new generation paradigm, a companion skill was created for consumers

### 7. Create a companion skill (for large extensions)

If the extension adds a new generation paradigm (e.g., GraphQL, gRPC, WebSocket), create a new skill under `.trae/skills/` to guide users on how to **use** the new operations:

```
.trae/skills/
├── extend-spring-engine/        ← this skill (for engine developers)
├── igrp-spring-generator/       ← existing (for REST generation)
└── igrp-spring-graphql-generator/  ← new companion skill (for GraphQL generation)
```

The companion skill follows the same structure as `igrp-spring-generator`: a concise `SKILL.md` with progressive disclosure via reference files.

---

## Key Invariants (never violate)

1. **Pipeline order is fixed** — manifest save always before file generation (Java or otherwise).
2. **`additionalProperties: false`** in every AJV schema — no unknown keys.
3. **`cleaner()` is always the first call** in a public API function.
4. **`getBaseApiConfig()` is always called** before building `RenderContext` (except `newApi`).
5. **Both style branches** (`technical` / `domain`) must be handled wherever paths differ.
6. **Template header** (2-line `/* THIS FILE WAS GENERATED... */`) is mandatory on every generated Java file. Non-Java files (`.graphqls`, `.yaml`, etc.) do NOT use this header.
7. **`readOnly` flag** must be respected — never overwrite if `readOnly === true`.
8. **Type changes must be consistent** — interface → schema → constants → template → tests, all in sync.
9. **Backward compatibility** — new fields on existing config types must always be `optional` (`?`). Never add a new field to the `required` array of an existing AJV schema. Existing stored manifests on disk must continue to validate after the change.
10. **Manifest is always saved** — every operation must write its `.igrpstudio/<module>/<type>/<Name>.json` manifest, even if the operation only generates non-Java resource files. Without the manifest, the element is invisible to `deleteElement`, `moveElement`, and `loadConfigs`.

---

## Minimal example: extending a type (Category C)

Scenario: "Add `uuid` support to `requestParams` in controllers."

```
Files to touch:
1. src/utils/constants.ts       → add 'uuid' to PARAMS_TYPES enum
2. src/schema/controllerConfig.ts → update enum in requestParams.type
3. public/templates/controller.hbs → handle uuid → java.util.UUID import + String param
4. __test__/addController.test.ts  → add test case with type: 'uuid'
```

No new modules. No new schema file. No new exported function.
Read [extending-existing-features.md](./references/extending-existing-features.md) for the full pattern.

---

## Minimal example: new operation skeleton (Category A)

```typescript
// src/index.ts — export pattern (DO NOT DEVIATE)
export const addMyFeature = async (dirty: MyFeatureConfig, basePath: string) => {
  const config = cleaner(dirty);
  const valid = myFeatureValidation(config);
  if (!valid && myFeatureValidation.errors) throw myFeatureValidation.errors;
  if (!basePath) throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;
  const baseConfig = await getBaseApiConfig(basePath);
  const context: RenderContext<MyFeatureConfig> = {
    resourceConfig: config,
    basePath,
    baseConfig,
    fullPath: getMainPath(baseConfig.group, baseConfig.packageName),
  };
  await generateMyFeature(context);
};
```

See [adding-new-operation.md](./references/adding-new-operation.md) for the full step-by-step.

---

## Suggested trigger test prompts
1. "Add `uuid` as a supported type in `requestParams` for controllers."
2. "Add a new `addAspect` operation to the engine that generates Spring AOP aspect classes."
3. "Add a `deprecated` boolean field to `ControllerConfig` and annotate the generated class with `@Deprecated` when set."
4. "The engine doesn't generate `@JsonProperty` on DTO fields — add it when `jsonAttributeName` is present."
5. "Add a `dto-builder` template variant for `addDTO` that generates a Builder inner class."
6. "Add a `toKebabCase` Handlebars helper and register it."
7. "Support `SEQUENCE` generation strategy with a custom sequence name in model primary keys."
