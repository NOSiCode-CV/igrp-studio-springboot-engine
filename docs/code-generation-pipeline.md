# Code Generation Pipeline

This document describes the end-to-end flow from a JSON configuration object to generated Java files on disk.

---

## High-Level Flow

```
User Config (JSON)
       │
       ▼
1. cleaner()              ← Strip unknown/extra keys
       │
       ▼
2. AJV Schema Validate()  ← Throw if invalid
       │
       ▼
3. getBaseApiConfig()     ← Load .igrpstudio/baseApi.json
       │
       ▼
4. Build RenderContext    ← Assemble context object
       │
       ├──────────────────────────────────┐
       ▼                                  ▼
5. saveConfig()                    6. generate*()
   (.igrpstudio/**/*.json)            (Handlebars render)
                                         │
                                         ▼
                                    7. saveToFile()
                                       (src/main/java/**/*.java)
```

---

## Step 1 — `cleaner(dirty)`

**File:** `src/modules/common/cleanerConfigFile.ts`

The raw config object may contain extra fields added by the UI or serialization layer. The cleaner strips anything not in the expected config shape, preventing AJV from receiving unknown properties.

```typescript
const config = cleaner(dirty); // safe, schema-conformant object
```

---

## Step 2 — Schema Validation

**Directory:** `src/schema/`

Each config type has its own AJV-compiled validator:

| Config type | Validator file |
|-------------|---------------|
| `BaseApiConfig` | `baseApiConfig.ts` + `apiConfig.ts` |
| `ModelConfig` | `modelConfig.ts` |
| `DTOConfig` | `dtoConfig.ts` |
| `ControllerConfig` | `controllerConfig.ts` |
| `EnumConfig` | `enumConfig.ts` |
| `ModuleConfig` | `moduleConfig.ts` |
| `PermissionConfig` | `permissionConfig.ts` |
| `DeleteConfig` | `deleteConfig.ts` |
| `MoveConfig` | `moveConfig.ts` |

Validators are compiled once with AJV and reused across calls. If validation fails, the raw AJV `ErrorObject[]` is thrown directly.

```typescript
const valid = validateModelConfig(config);
if (!valid && validateModelConfig.errors) throw validateModelConfig.errors;
```

---

## Step 3 — Load Base API Config

**File:** `src/modules/common/getBaseApiConfig.ts`

For every function except `newApi()`, the engine loads `.igrpstudio/baseApi.json` to obtain the project-level settings:

```typescript
const baseConfig = await getBaseApiConfig(basePath);
// Returns: ApiConfig { group, packageName, projectStructureStyle, database, ... }
```

This config is needed to:
- Derive Java package names and output paths
- Know which project structure style to use (`technical` vs `domain`)
- Know the target database (affects table name casing)

---

## Step 4 — Build RenderContext

The `RenderContext<T>` object is assembled and passed to all downstream functions:

```typescript
const context: RenderContext<ModelConfig> = {
  resourceConfig: config,   // The validated model config
  basePath,                 // Absolute path to project root
  baseConfig,               // Loaded API config
  fullPath: getMainPath(baseConfig.group, baseConfig.packageName),
};
```

`fullPath` is the base Java source path: `src/main/java/<group>/<packageName>`.

---

## Step 5 — Save Manifest (`.igrpstudio/`)

**Example files:** `src/modules/model/saveModelConfig.ts`, `src/modules/dto/saveDTOConfig.ts`

The manifest JSON is saved before any Java is generated. This ensures:
- The config is persisted even if Java generation fails
- The manifest is the source of truth for re-generation
- Move/delete operations can find and update the manifest

```typescript
await saveModelConfig(context.resourceConfig, context.basePath);
// Writes: .igrpstudio/<module>/models/<ModelName>.json
```

Manifest path constants are defined in `src/utils/constants.ts` under `DIRECTORIES`:

```typescript
DIRECTORIES.CONFIG_MODEL  = '.igrpstudio/{{module}}/models'
DIRECTORIES.CONFIG_DTO    = '.igrpstudio/{{module}}/dto'
DIRECTORIES.CONFIG_CONTROLLER = '.igrpstudio/{{module}}/controllers'
DIRECTORIES.CONFIG_ENUM   = '.igrpstudio/{{module}}/enum'
```

---

## Step 6 — Template Rendering

**File:** `src/modules/common/renderTemplate.ts`

Templates are Handlebars `.hbs` files in `public/templates/`. The renderer:

1. Reads the template file path from `TEMPLATES` constants
2. Loads all partials from `public/templates/partials/`
3. Registers all Handlebars helpers from `src/helper/`
4. Compiles and renders the template with the context object
5. Returns the rendered Java source code as a string

```typescript
const javaSource = await renderTemplate(templateName, context);
```

### Template Name Resolution

Template names are constants in `src/utils/constants.ts`:

```typescript
TEMPLATES.MODEL = 'model.hbs'
TEMPLATES.DTO   = 'dto.hbs'
TEMPLATES.DTO_RECORD = 'dto-record.hbs'
TEMPLATES.CONTROLLER = 'controller.hbs'
// etc.
```

### Handlebars Context

The context object passed to templates contains the full `RenderContext<T>` plus computed helpers:

```handlebars
{{baseConfig.group}}          ← e.g. "com.example"
{{baseConfig.packageName}}    ← e.g. "myapp"
{{resourceConfig.name}}       ← e.g. "UserEntity"
{{resourceConfig.attributes}} ← array of attributes
{{fullPath}}                  ← computed Java output path
```

### Helpers

Helpers are registered globally and available in all templates:

| Helper | Example | Output |
|--------|---------|--------|
| `capitalize` | `{{capitalize name}}` | `UserEntity` |
| `camelCase` | `{{camelCase name}}` | `userEntity` |
| `pluralize` | `{{pluralize name}}` | `Users` |
| `isPageable` | `{{#if (isPageable responses)}}` | conditional |
| `resolveJavaType` | `{{resolveJavaType type objectType}}` | `String`, `Long`, etc. |
| `javaImport` | `{{javaImport type module}}` | import statement |

---

## Step 7 — Write to File

**File:** `src/modules/common/saveToFile.ts`

The rendered Java string is written to the resolved output path:

```typescript
await saveToFile(
  template,         // rendered Java source string
  outputPath,       // absolute path to .java file
  canOverwrite,     // !context.resourceConfig.readOnly
  elementType,      // 'models', 'controllers', etc.
  elementId,        // UUID for tracking
  module,           // module name
  basePath,         // project root
);
```

`saveToFile` also:
- Creates parent directories if they don't exist (`fs.ensureDir`)
- Checks for duplicates before writing
- Respects the `readOnly` flag (does not overwrite if `true`)

---

## Project Structure Output

### Technical Style

```
src/main/java/<group>/<packageName>/
├── models/
│   └── userentity/
│       ├── UserEntity.java
│       └── UserEntityRepository.java
├── dto/
│   └── UserDTO.java
├── controllers/
│   └── user/
│       └── UserController.java
├── services/
│   ├── IUserService.java
│   └── UserService.java
└── enum/
    └── UserStatus.java
```

### Domain Style

```
src/main/java/<group>/<packageName>/
└── users/
    ├── domain/
    │   └── repository/
    │       └── UserEntityRepository.java
    ├── infrastructure/
    │   └── persistence/
    │       ├── entity/
    │       │   └── UserEntity.java
    │       └── repository/
    │           ├── UserEntityRepositoryImpl.java
    │           └── UserEntityEntityRepository.java
    ├── application/
    │   ├── commands/
    │   │   ├── CreateUserCommand.java
    │   │   └── CreateUserCommandHandler.java
    │   └── queries/
    │       ├── GetAllUsersQuery.java
    │       └── GetAllUsersQueryHandler.java
    └── interfaces/
        └── rest/
            └── UserController.java
```

---

## Duplicate Check

**File:** `src/modules/common/checkDuplicates.ts`

Before writing a new element, the engine checks if an element with the same name already exists in the target module. If it does, an error is thrown to prevent accidental overwrites.

---

## Permission Wiring

After generating a controller or model with CRUD, the engine automatically:

1. Resolves all exposed HTTP endpoints
2. Creates/updates `.igrpstudio/permissions/<name>.json`
3. Wires `@PreAuthorize(...)` annotations in the controller class

This ensures permission management stays in sync with the generated code.
