# igrpstudio-json-generator (SKILL.md)
---
name: igrpstudio-json-generator
description: Generates, validates, and auto-fixes IGRP Studio (spring-engine) JSON configs and writes them to the correct .igrpstudio paths. Supports BaseApiConfig, ModuleConfig, ControllerConfig, ModelConfig, and DTOConfig. Includes fast one-shot and interactive modes.
---

## Purpose
Enable an agent to create `.igrpstudio` JSON configs (IGRP Studio / spring-engine) without the user manually writing JSON. The skill must:

1) detect the project (`basePath`)
2) generate JSON with predictable defaults
3) validate using the engine schemas (AJV)
4) auto-fix conservatively
5) write the file to the correct path under `.igrpstudio`

## Supported types
- `baseApi` → BaseApiConfig → `.igrpstudio/baseApi.json`
- `module` → ModuleConfig → `.igrpstudio/<module>/module.json`
- `controller` → ControllerConfig → `.igrpstudio/<module>/controllers/<Name>Controller.json`
- `model` → ModelConfig → `.igrpstudio/<module>/models/<Name>.json`
- `dto` → DTOConfig → `.igrpstudio/<module>/dto/<Name><Suffix>.json`

## Critical rules
- Never write configs outside a project that contains `.igrpstudio`.
- If the user does not provide `basePath`:
  - assume the current directory is the project if it contains `.igrpstudio/`
  - if it does not contain `.igrpstudio/`, ask for the project path
- Auto-fix must be conservative:
  - fix only unambiguous issues (case normalization, duplicated suffixes, obvious required fields)
  - if ambiguous, ask
- Do not overwrite existing files by default:
  - if the target file exists, ask before overwriting
  - exception: if the user explicitly requested “update/overwrite/replace”
- Always validate with AJV before writing. If validation fails:
  - attempt conservative auto-fixes and re-validate
  - if it still fails, return errors + partial JSON (do not write)

## Operation modes

### Fast mode (one-shot)
Use when the user provides a complete request in a single sentence, for example:
- “create module users”
- “create baseApi for Postgresql domain with observability on”
- “create model User in module users table users with id pk auto, name string required”
- “create dto UserDTO in module users with id:string required, name:string required”
- “create controller User in module users with GET /users/{id} returns UserDTO”

In this mode, the agent must:
1) infer the config type (baseApi/module/model/dto/controller)
2) infer minimal fields and apply predictable defaults
3) validate + auto-fix
4) write to the correct path
5) reply with path + JSON + applied fixes

### Interactive mode (minimal questions)
Use when essential information is missing (no name, no attributes, no actions).
Ask only what is required to produce a valid JSON.

## Validation (AJV) and engine schemas
Always validate generated JSON with the engine schemas:
- BaseApiConfig: `src/schema/baseApiConfig.ts`
- ModuleConfig: `src/schema/moduleConfig.ts`
- ControllerConfig: `src/schema/controllerConfig.ts`
- ModelConfig: `src/schema/modelConfig.ts`
- DTOConfig: `src/schema/dtoConfig.ts`

## Predictable defaults (table)

### Global defaults
| Field | Default | Notes |
|---|---:|---|
| `module` | `shared` | If not provided for controller/model/dto |
| `description` | generated | Example: “Controller for User” |
| file overwrite | `false` | Ask first, unless explicitly requested |

### BaseApiConfig (`baseApi.json`)
| Field | Default | Source/notes |
|---|---:|---|
| `type` | `springboot` | required |
| `enableObservability` | `false` | if not provided |
| `enableGraalVm` | `false` | if not provided |
| `enableEntityRevision` | `false` | if not provided |
| `projectStructureStyle` | `technical` | if not provided |
| `version` | engine default | `package.json.custom.igrpVersion` |
| `javaVersion` | engine default | `package.json.custom.javaVersion` |
| `springBootVersion` | engine default | `package.json.custom.springBootVersion` |
| `springCloudVersion` | engine default | `package.json.custom.springCloudVersion` |
| `springDocVersion` | engine default | `package.json.custom.springDocVersion` |

### ModuleConfig (`module.json`)
| Field | Default | Notes |
|---|---:|---|
| `type` | `module` | required |

### ControllerConfig
| Field | Default | Notes |
|---|---:|---|
| `type` | `controller` | required |
| `module` | `shared` | if not provided |
| `method` | uppercase | `get` → `GET` |
| `responses` | minimal `200` | if missing, create minimal structure |
| `pathVariables` | inferred from path | if `path` contains `{id}` and missing `pathVariables` |

### ModelConfig
| Field | Default | Notes |
|---|---:|---|
| `type` | `model` | required |
| `module` | `shared` | if not provided |
| `nullable` | `true` | if not provided |
| primary key | ask / generate `id` | fast mode may generate `id` |

### DTOConfig
| Field | Default | Notes |
|---|---:|---|
| `template` | `classic` | if not provided |
| `module` | `shared` | if not provided |
| attribute `objectType` | `java` | if not provided |
| suffix normalization | applied | avoid `DTODTO`, `CommandCommand`, etc. |

## Workflow

### Step 0: Detect `basePath`
1) If the user provided `basePath`, use it.
2) Otherwise:
   - check if `.igrpstudio/` exists in the current directory
   - if it exists, use current directory as `basePath`
   - if it does not exist, ask for `basePath`

### Step 1: Ensure BaseApiConfig when needed
- If the request is `controller/model/dto/module` and `.igrpstudio/baseApi.json` does not exist, ask whether to:
  - create `baseApi.json` now (recommended)
  - or provide an existing initialized project path

### Step 2: Ensure ModuleConfig when needed
- If `module != shared`, ensure `.igrpstudio/<module>/module.json` exists
- If missing, create ModuleConfig automatically (fast mode) or ask (interactive mode)

### Step 3: Generate JSON
- Build the object from answers + predictable defaults

### Step 4: Validate + auto-fix
- Validate with AJV
- If invalid, apply conservative fixes and re-validate
- If still invalid, do not write; return errors

### Step 5: Write to the correct path
Use the same paths as the engine:
- BaseApiConfig: `<basePath>/.igrpstudio/baseApi.json`
- ModuleConfig: `<basePath>/.igrpstudio/<module>/module.json`
- ControllerConfig: `<basePath>/.igrpstudio/<module>/controllers/<Name>Controller.json`
- ModelConfig: `<basePath>/.igrpstudio/<module>/models/<Name>.json`
- DTOConfig: `<basePath>/.igrpstudio/<module>/dto/<Name><Suffix>.json`

## Output format
Always return:

```markdown
## Result
- Type: <baseApi|module|controller|model|dto>
- Path: <absolute path to the generated file>
- Validation: OK | Failed (with errors)

## Generated JSON
```json
{ ... }
```

## Applied fixes
- ...
```

## Supported one-shot phrases (mini DSL)

### BaseApiConfig (baseApi.json)
Examples:
- “create baseApi for Postgresql domain with observability on”
- “create baseApi for MySQL technical without observability”
- “initialize baseApi for project my_api group cv.nosi artifact demo database Oracle domain”
- “create baseApi for Postgresql with graalvm on and entity revision on”

Heuristics:
- If `enableObservability/enableGraalVm/enableEntityRevision` are missing, use defaults.
- If `group/artifact/name/database` are missing, ask.

### ModuleConfig (module.json)
Examples:
- “create module users”
- “add module inventory”

### ModelConfig (models/<Name>.json)
Simple model:
- “create model User in module users table users with id pk auto, name string required, email string unique”
- “create model Product table products with id pk identity, name string(120), price float, description text”

With relations:
- “create model Order in module sales table orders with id pk auto, total float required, customer relation many-to-one Customer eager”
- “create model Author table authors with id pk auto, books relation one-to-many Book mappedBy author lazy”
- “create model Student table students with id pk auto, courses relation many-to-many Course joinTable student_course inverseJoinColumn course_id”

Heuristics:
- If a relation requires `mappedBy` and it is missing, ask.
- If `fetchType` is missing, default to `lazy`.

### DTOConfig (dto/<Name><Suffix>.json)
Classic DTO:
- “create dto UserDTO in module users with id string required, name string required, roles string list”
- “create dto CreateUserRequest in module users template classic with name string required, email string required isEmail”

DTO with objectType:
- “create dto OrderDTO in module sales with id long required, customer Customer model required, status OrderStatus enum required”
- “create dto SearchDTO with filters FilterDTO dto, page int, size int”

Commands/Queries/Events:
- “create command CreateOrderCommand in module sales with customerId string required, items string list required”
- “create query FindOrdersQuery in module sales with status string, fromDate string, toDate string”
- “create event OrderCreatedEvent in module sales with orderId string required”

### ControllerConfig (controllers/<Name>Controller.json)
Single endpoint:
- “create controller User in module users basePath users with GET /users/{id} returns UserDTO”
- “create controller Product in module catalog with GET /products returns ProductDTO list”

CRUD:
- “create controller User CRUD in module users basePath users for model User”
- “generate CRUD endpoints for Product in module catalog”

With query params:
- “create controller Search in module users with GET /users/search query params q string required, page int, size int returns UserDTO list”
- “create controller Report in module finance with GET /reports query params ids string list required”

## When not to use this skill
- When the goal is to generate Java code directly (use spring-engine: `newApi`, `addModule`, `addModel`, `addDTO`, `addController`)
- When the user does not want to write files to disk
- When there is no IGRPStudio project and the user refuses to provide `basePath`

