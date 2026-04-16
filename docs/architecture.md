# Architecture

## Overview

The IGRP Spring Engine follows a **configuration-driven code generation** architecture. Every generated artifact is deterministically derived from a JSON manifest object, validated against a JSON Schema, rendered through Handlebars templates, and written to disk.

```
┌─────────────────────────────────────────────────┐
│                  Public API (index.ts)           │
│   newApi · addModule · addModel · addDTO         │
│   addController · addEnum · addResponse · ...    │
└────────────────────┬────────────────────────────┘
                     │ calls
        ┌────────────▼────────────┐
        │   Schema Validation      │  ← AJV JSON Schema
        │   (src/schema/)          │
        └────────────┬────────────┘
                     │ valid config
        ┌────────────▼────────────┐
        │   Module Logic           │  ← src/modules/<feature>/
        │   (generate*, save*)     │
        └────────────┬────────────┘
                     │
          ┌──────────┴──────────┐
          │                     │
  ┌───────▼──────┐   ┌─────────▼────────┐
  │ Template     │   │ Config Storage   │
  │ Rendering    │   │ (.igrpstudio/)   │
  │ (Handlebars) │   │                  │
  └───────┬──────┘   └──────────────────┘
          │
  ┌───────▼──────┐
  │ File Write   │  ← src/main/java/**/*.java
  │ (fs-extra)   │
  └──────────────┘
```

---

## Source Directory Structure

```
src/
├── index.ts                   ← Public API — all exported functions
├── interfaces/
│   └── types.ts               ← All TypeScript interfaces and type aliases
├── utils/
│   ├── constants.ts           ← DIRECTORIES, TEMPLATES, HTTP_METHODS, etc.
│   ├── helpers.ts             ← Path helpers, name normalizers
│   └── checkFiles.ts          ← Directory existence checks
├── schema/                    ← AJV JSON Schema validators (one per config type)
│   ├── baseApiConfig.ts
│   ├── modelConfig.ts
│   ├── dtoConfig.ts
│   ├── controllerConfig.ts
│   ├── enumConfig.ts
│   ├── moduleConfig.ts
│   ├── permissionConfig.ts
│   ├── requestConfig.ts
│   ├── deleteConfig.ts
│   ├── moveConfig.ts
│   ├── serializationConfig.ts
│   └── engineConfigurationRegisterConfig.ts
├── helper/                    ← Handlebars helper functions registered globally
│   ├── stringHelper.ts        ← capitalize, camelCase, pluralize, ...
│   ├── modelHelper.ts         ← Model-specific helpers
│   ├── dtoHelper.ts           ← DTO-specific helpers
│   ├── logicalHelper.ts       ← Conditional helpers (isPageable, ...)
│   └── generalHelper.ts       ← Generic helpers
├── config/                    ← Engine runtime configuration
│   ├── default.ts             ← Default engine module
│   └── index.ts               ← setConfiguration / configurationAsObject
└── modules/                   ← Feature generation modules
    ├── baseApi/               ← Project scaffolding (newApi)
    ├── model/                 ← Entity + Repository (addModel)
    ├── dto/                   ← DTO classes (addDTO)
    ├── controller/            ← Controllers + Services (addController)
    ├── crudController/        ← Auto-CRUD controllers (addCrudController)
    ├── enum/                  ← Enum classes (addEnum)
    ├── response/              ← Response DTOs (addResponse)
    ├── module/                ← Module scaffolding (addModule)
    ├── handlers/              ← DDD handlers (addDTO with type=command/query/event)
    ├── permission/            ← Permission management
    ├── test/                  ← Test service stubs
    ├── delete/                ← Element deletion (deleteElement)
    ├── move/                  ← Element relocation (moveElement)
    ├── serialization/         ← JSON/XML/SQL → Model/DTO (serializeElement)
    └── common/                ← Shared utilities used by all modules
        ├── renderTemplate.ts  ← Handlebars rendering
        ├── saveToFile.ts      ← File writing with duplicate check
        ├── getBaseApiConfig.ts← Load + validate baseApi.json
        ├── cleanerConfigFile.ts← Strip unknown keys before validation
        └── checkDuplicates.ts ← Prevent duplicate element names
```

---

## Core Design Patterns

### 1. RenderContext — The Central Data Object

Every generation function receives or builds a `RenderContext<T>` object that carries all the data needed by any template:

```typescript
type RenderContext<T = undefined> = {
  resourceConfig: T;        // The specific config (ModelConfig, DTOConfig, etc.)
  basePath: string;         // Absolute path to the project root
  baseConfig: ApiConfig;    // Loaded from .igrpstudio/baseApi.json
  fullPath: string;         // Resolved Java output directory
};
```

This object is passed through the entire pipeline — from the public API entry point all the way to the template renderer.

### 2. Cleaner → Validate → Generate → Save Pipeline

Every public API function follows this exact pipeline:

```
1. cleaner(dirty)           → strips unknown/extra keys from the raw input
2. schemaValidator(config)  → throws if JSON Schema is violated
3. getBaseApiConfig(path)   → loads baseApi.json (for non-newApi functions)
4. buildRenderContext(...)  → constructs the RenderContext<T>
5. generate*(context)       → renders Handlebars template(s) to string(s)
6. saveToFile(...)          → writes Java file(s) to disk
7. saveConfig(...)          → writes .igrpstudio/**.json manifest
```

### 3. Project Structure Branching

All generation modules branch on `context.baseConfig.projectStructureStyle`:

```typescript
if (style === 'domain') {
  // DDD paths: <module>/infrastructure/persistence/entity/
  // DDD paths: <module>/application/commands/
  // DDD paths: <module>/domain/repository/
} else {
  // Technical paths: models/, controllers/, services/, dto/
}
```

This branching controls both the **Java output path** and the **template used**.

### 4. Handlebars Template System

Templates live in `public/templates/`. The renderer:
1. Loads the template file by name from `TEMPLATES` constants
2. Loads all partials from `public/templates/partials/`
3. Registers all helpers from `src/helper/`
4. Calls `Handlebars.compile(template)(context)` and returns the rendered string

See [Template System](./extending-the-engine.md#template-system) for details.

### 5. Schema Validation with AJV

Each config type has a dedicated AJV schema validator in `src/schema/`. Validators are compiled once and reused. Errors are thrown as-is (arrays of AJV `ErrorObject`).

```typescript
const valid = modelConfigValidator(config);
if (!valid && modelConfigValidator.errors) throw modelConfigValidator.errors;
```

### 6. Manifest-First Persistence

The `.igrpstudio/` directory stores the canonical state:
- Manifests are written **before** Java generation begins
- On conflict, an element is only overwritten if `readOnly !== true`
- All future operations (move, delete, re-generate) read from manifests

---

## Module Responsibilities

| Module | Key files | Responsibility |
|--------|-----------|----------------|
| `baseApi` | `createAppDirectories`, `saveBaseApiFiles`, `saveBaseApiConfig` | Creates entire project scaffold: pom.xml, application.properties, Application.java |
| `model` | `generateModel`, `generateRepository`, `saveModelConfig` | Entity class, Repository interface, optional RepositoryImpl (DDD) |
| `dto` | `generateDTO`, `saveDTOConfig`, `generateDTOCustomValidator` | DTO class (classic or record template), optional custom validator |
| `controller` | `generateController`, `generateServiceInterface`, `generateService`, `generateRequest`, `generateResponses` | Controller class, Service interface, Service implementation |
| `crudController` | `generateCrudController` | Auto-generates CRUD controller wired to a model |
| `enum` | `generateEnum`, `saveEnumConfig` | Java enum class |
| `response` | `generateSingleResponse`, `saveResponseConfig` | Response DTO class |
| `module` | `createModuleDirectory`, `saveModuleConfig` | Module directory structure + module.json |
| `handlers` | `generateHandlers`, `generateTestHandlers` | DDD Command/Query/Event handler classes |
| `permission` | `savePermissionConfig`, `getPermissions`, `permissionManagement` | Permission JSON files + `@PreAuthorize` wiring |
| `delete` | `deleteElementConfig` | Removes Java files + manifest entries |
| `move` | `moveElementConfig` | Relocates element from one module to another |
| `serialization` | `serializeData` | Converts JSON/XML/SQL structure to Model or DTO configs |
| `test` | `generateTestService`, `generateTestHandlers` | Test service stub classes |
| `common` | `renderTemplate`, `saveToFile`, `getBaseApiConfig`, `cleaner`, `checkDuplicates` | Shared infrastructure used by all modules |

---

## Path Resolution Rules

Given `baseConfig.group = "com.example"` and `baseConfig.packageName = "myapp"`:

```
mainPath = src/main/java/com/example/myapp
testPath = src/test/java/com/example/myapp

Technical style:
  model:       <mainPath>/models/<modelName>/
  dto:         <mainPath>/dto/
  controller:  <mainPath>/controllers/<controllerName>/
  service:     <mainPath>/services/
  enum:        <mainPath>/enum/

Domain style:
  entity:      <mainPath>/<module>/infrastructure/persistence/entity/
  repository:  <mainPath>/<module>/domain/repository/
  repo-impl:   <mainPath>/<module>/infrastructure/persistence/repository/
  controller:  <mainPath>/<module>/interfaces/rest/
  command:     <mainPath>/<module>/application/commands/
  query:       <mainPath>/<module>/application/queries/
  dto:         <mainPath>/<module>/application/dto/
```

The Java `package` statement is derived by stripping the `basePath` prefix from the full output path, then removing `src`, `main`/`test`, `java` segments, and joining with `.`.
