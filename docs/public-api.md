# Public API Reference

All functions are exported from `@igrp/igrp-studio-springboot-engine` (`src/index.ts`).

---

## Engine Configuration

### `setEngineConfiguration(config)`

Configures the engine runtime environment. Must be called before any generation function.

```typescript
import { setEngineConfiguration } from '@igrp/igrp-studio-springboot-engine';

setEngineConfiguration({ environment: 'development' });
// or
setEngineConfiguration({ environment: 'production' });
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `config.environment` | `'development' \| 'production'` | Controls template path resolution |

- **development** — templates loaded from `public/templates/` (source tree)
- **production** — templates loaded from `dist/templates/` (bundled output)

---

### `loadEngineConfiguration(name?)`

Returns the current engine configuration as an object.

```typescript
const config = loadEngineConfiguration();
console.log(config.environment); // 'development'
```

---

### `getPaths()`

Returns the resolved template and dependency file paths based on current environment.

```typescript
const paths = getPaths();
// { template: '...', partials: '...', springDependencies: '...' }
```

Returns a `PathConfig` object with `template`, `partials`, and `springDependencies` paths.

---

## Project Initialization

### `newApi(config, basePath)`

Creates a complete Spring Boot project structure in an **empty** directory.

```typescript
await newApi({
  type: 'springboot',
  name: 'my_api',
  group: 'com.example',
  artifact: 'animals',
  database: 'MySQL',
  projectStructureStyle: 'technical',
  enableObservability: false,
  enableEntityRevision: false,
  enableGraalVm: false,
}, '/path/to/empty/dir');
```

**Generated files:**
- `.igrpstudio/baseApi.json`
- `pom.xml`
- `src/main/resources/application.properties`
- `src/main/java/<group>/<packageName>/<Name>Application.java`
- Docker, Kubernetes, and observability config files (if enabled)

**Throws** if:
- `basePath` is not empty
- Config is invalid

---

## Module Management

### `addModule(config, basePath)`

Creates a new logical module (package group) within an existing API.

```typescript
await addModule({ type: 'module', name: 'users' }, '/path/to/api');
```

**Generated files:**
- `.igrpstudio/users/module.json`
- Package directory structure under `src/main/java/.../users/`

---

## Entity Model

### `addModel(config, basePath)`

Generates a JPA entity class, its repository, and optionally CRUD endpoints.

```typescript
await addModel({
  type: 'model',
  name: 'UserEntity',
  tableName: 'users',
  module: 'users',
  audit: true,
  attributes: [
    { type: 'string',  name: 'username', nullable: false, unique: true },
    { type: 'string',  name: 'email',    nullable: false },
    { type: 'integer', name: 'age',      nullable: true },
  ],
  primaryKey: [{ type: 'long', name: 'id' }],
}, '/path/to/api');
```

**Generated files (technical style):**
- `.igrpstudio/<module>/models/UserEntity.json`
- `src/main/java/.../models/userentity/UserEntity.java`
- `src/main/java/.../models/userentity/UserEntityRepository.java`

**Generated files (domain style):**
- `src/main/java/.../<module>/infrastructure/persistence/entity/UserEntity.java`
- `src/main/java/.../<module>/domain/repository/UserEntityRepository.java`
- `src/main/java/.../<module>/infrastructure/persistence/repository/UserEntityRepositoryImpl.java`
- `src/main/java/.../<module>/infrastructure/persistence/repository/UserEntityEntityRepository.java`

**Supported attribute types:** `string`, `text`, `integer`, `long`, `double`, `float`, `boolean`, `date`, `datetime`, `time`, `file`, `relation`, `enum`

---

## Data Transfer Objects

### `addDTO(config, basePath)`

Generates a DTO class. Supports classic (field-based) and record (Java record) templates.

```typescript
await addDTO({
  type: 'dto',
  name: 'UserDTO',
  module: 'users',
  template: 'classic',
  attributes: [
    { name: 'id',       type: 'long',    objectType: 'java',    required: false },
    { name: 'username', type: 'string',  objectType: 'java',    required: true  },
    { name: 'email',    type: 'string',  objectType: 'java',    required: true, isEmail: true },
  ],
}, '/path/to/api');
```

**Supported `type` values:**
| Type | Purpose | Manifest filename suffix |
|------|---------|--------------------------|
| `dto` | Standard DTO | `DTO` |
| `response` | Response-only DTO | `DTO` |
| `filter` | Filter/search DTO | `DTO` |
| `command` | DDD Command object | `Command` |
| `query` | DDD Query object | `Query` |
| `event` | DDD Domain Event | `Event` |

**DDD types** (`command`, `query`, `event`) automatically generate matching handler classes.

**Generated files (technical style, `type='dto'`):**
- `.igrpstudio/users/dto/UserDTO.json`
- `src/main/java/.../dto/UserDTO.java`

---

## Controllers

### `addController(config, basePath)`

Generates a REST controller class with its service interface and service implementation.

```typescript
await addController({
  type: 'controller',
  name: 'User',
  module: 'users',
  basePath: '/api/v1/users',
  description: 'User management endpoints',
  actions: [
    {
      actionName: 'getAll',
      method: 'GET',
      path: '/',
      responses: {
        '200': {
          name: 'UserDTO',
          content: {
            'application/json': {
              schema: { type: 'UserDTO', objectType: 'dto', collectionType: 'list' },
            },
          },
        },
      },
    },
    {
      actionName: 'create',
      method: 'POST',
      path: '/',
      requestBody: {
        name: 'UserDTO',
        content: { 'application/json': { schema: { type: 'UserDTO', objectType: 'dto' } } },
      },
    },
  ],
}, '/path/to/api');
```

**Generated files (technical style):**
- `.igrpstudio/users/controllers/UserController.json`
- `src/main/java/.../controllers/user/UserController.java`
- `src/main/java/.../services/IUserService.java`
- `src/main/java/.../services/UserService.java`

**Generated files (domain style):**
- `src/main/java/.../<module>/interfaces/rest/UserController.java`
- For each GET action: `QueryHandler` + `Query` + test
- For each non-GET action: `CommandHandler` + `Command` + test

---

### `addCrudController(config, basePath)`

Automatically generates a full CRUD controller wired to an existing model.

```typescript
await addCrudController({
  type: 'crudController',
  name: 'User',
  module: 'users',
  modelName: 'UserEntity',
  basePath: '/api/v1/users',
}, '/path/to/api');
```

Generates GET (paginated), GET by ID, POST, PUT, DELETE endpoints automatically.

---

## Enumerations

### `addEnum(config, basePath)`

Generates a Java enum class.

```typescript
await addEnum({
  type: 'enum',
  name: 'UserStatus',
  module: 'users',
  attributes: [
    { name: 'ACTIVE' },
    { name: 'INACTIVE' },
    { name: 'SUSPENDED' },
  ],
}, '/path/to/api');
```

**Generated files:**
- `.igrpstudio/users/enum/UserStatus.json`
- `src/main/java/.../enum/UserStatus.java`

---

## Response DTOs

### `addResponse(config, basePath)`

Generates a standalone response DTO class (used as an API response body type).

```typescript
await addResponse({
  type: 'response',
  name: 'PaginatedUsersResponse',
  module: 'users',
  attributes: [
    { name: 'data',       type: 'UserDTO', objectType: 'dto',  required: true, collectionType: 'list' },
    { name: 'totalItems', type: 'long',    objectType: 'java', required: true },
  ],
}, '/path/to/api');
```

---

## Permissions

### `addPermission(config, basePath)`

Registers a permission definition and wires `@PreAuthorize` annotations on controllers.

```typescript
await addPermission({
  type: 'permission',
  name: 'USER_READ',
  description: 'Read user data',
  endpoints: [
    { type: 'controller', resource: 'User', method: 'GET', path: '/api/v1/users' },
  ],
}, '/path/to/api');
```

---

### `addPermissionConfig(basePath, groupConfig, moduleName)`

Adds a permission group definition.

---

### `getPermissions(basePath)`

Returns all permission configurations for a project.

---

### `deletePermission(config, basePath)`

Removes a permission configuration.

---

## Element Management

### `deleteElement(config, basePath)`

Removes a generated element (model, DTO, controller, enum) and its manifest.

```typescript
await deleteElement({
  type: 'delete',
  elementType: 'model',
  name: 'UserEntity',
  module: 'users',
}, '/path/to/api');
```

---

### `moveElement(config, basePath)`

Moves an element from one module to another.

```typescript
await moveElement({
  type: 'move',
  elementType: 'dto',
  name: 'UserDTO',
  fromModule: 'users',
  toModule: 'shared',
}, '/path/to/api');
```

---

## Serialization

### `serializeElement(config, basePath)`

Converts an existing JSON schema, XML, or SQL DDL into a Model or DTO manifest.

```typescript
await serializeElement({
  type: 'serialization',
  targetType: 'dto',
  module: 'users',
  json: { /* raw JSON schema */ },
}, '/path/to/api');
```

---

## Utilities

### `getSpringDependencies()`

Fetches the list of available Spring Initializer dependencies (from bundled JSON).

```typescript
const deps = await getSpringDependencies();
```

---

### `engineTypes(module, basePath)`

Returns the available attribute types for the schema (based on registered DTOs, models, enums).

---

### `loadConfigs(basePath, moduleName)`

Loads all configuration manifests for a given module.
