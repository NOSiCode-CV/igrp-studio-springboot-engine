---
name: igrp-spring-generator
description: Generates Spring Boot projects and code artifacts that mirror the iGRP Studio spring-engine pipeline. Use this skill when the user wants to create, modify, inspect, delete, or move IGRP Spring Boot manifests and Java code.
version: 2.0
---

# IGRP Spring Generator

You are acting as the `@igrp/igrp-studio-springboot-engine`. Every manifest and Java file you produce must be byte-for-byte identical to what the engine would produce.

## Core Rules

1. **Always read `<basePath>/.igrpstudio/baseApi.json` before any operation** (except `newApi`). All path and package computations depend on `group`, `artifact`, `name`, and `projectStructureStyle` from that file.
2. **Write manifest first, then Java.** The engine saves `.igrpstudio/**/*.json` first, then renders Java.
3. **Respect `readOnly: true`.** Never overwrite a manifest or Java file when `readOnly: true` is set.
4. **Schema is authoritative.** `additionalProperties: false` — never add fields to manifests that are not defined in the schema for that operation.
5. **Java is formatted by Prettier** (`prettier-plugin-java`, tab width: 4, print width: 120). Match this formatting exactly.

## 7-Step Generation Pipeline

Every operation runs this pipeline in order:

```
Input JSON
  ↓  1. clean()        — strip unknown/extra keys from input
  ↓  2. validate()     — AJV schema check (fail fast with human-readable error)
  ↓  3. loadBaseApi()  — read .igrpstudio/baseApi.json  [skipped for newApi]
  ↓  4. buildContext() — assemble RenderContext { resourceConfig, basePath, baseConfig, fullPath }
  ↓  5. saveManifest() — write .igrpstudio/**/*.json
  ↓  6. render()       — Handlebars template → Java string
  ↓  7. saveFile()     — write src/main/java/**/*.java (formatted with Prettier)
```

If `readOnly: true`, steps 5–7 are skipped for that element.

## Input Modes

### Mode A — Intent Only
User describes what they want without providing a manifest.

1. Identify the operation from context.
2. Ask for missing **required** fields. Never guess required values.
3. Produce valid manifest JSON.
4. Write manifest to the correct `.igrpstudio/**` path.
5. Generate corresponding Java file(s).

### Mode B — Manifest → Java
User provides a manifest JSON.

1. Read `baseApi.json` for project context.
2. Validate against the operation schema (see reference file).
3. Write manifest to the correct path.
4. Generate Java file(s).

### Mode C — Java → Manifest
User provides existing Java code.

1. Infer names, fields, types, and module from the code.
2. Produce structurally valid manifest JSON using only fields defined in the schema.
3. Save manifest to the correct `.igrpstudio/**` path.

## Operations

| Operation | When to use | Reference |
|---|---|---|
| `newApi` | Initialize a new Spring Boot project scaffold | [newApi.md](references/newApi.md) |
| `addModule` | Create a new feature module with directory structure | [addModule.md](references/addModule.md) |
| `addModel` | Generate a JPA entity + repository | [addModel.md](references/addModel.md) |
| `addDTO` | Generate DTO / Command / Query / Event class | [addDTO.md](references/addDTO.md) |
| `addController` | Generate REST controller + service (or CQRS handlers) | [addController.md](references/addController.md) |
| `addEnum` | Generate a Java enum implementing `IgrpEnum` | [addEnum.md](references/addEnum.md) |
| `deleteElement` | Remove an element (manifest + Java file) | [deleteElement.md](references/deleteElement.md) |
| `moveElement` | Move an element from one module to another | [moveElement.md](references/moveElement.md) |
| `addPermission` | Register a permission group | [addPermission.md](references/addPermission.md) |

## Recommended Creation Order

For a complete feature, follow this sequence:

```
newApi            ← once per project (usually already done by Studio)
  └─ addModule    ← one per feature domain
       ├─ addEnum       ← any enums the model or DTOs need
       ├─ addModel      ← entity + repository
       ├─ addDTO        ← request/response DTOs
       └─ addController ← REST endpoints
```

## Path & Naming Conventions

See [paths.md](references/paths.md).
