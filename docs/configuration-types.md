# Configuration Types

All interfaces are defined in `src/interfaces/types.ts` and exported via `@igrp/igrp-studio-springboot-engine/types`.

---

## Core Types

### `ProjectStructureStyle`
```typescript
type ProjectStructureStyle = 'technical' | 'domain';
```

### `DatabaseTypes`
```typescript
type DatabaseTypes = 'MySQL' | 'Oracle' | 'Postgresql';
```

### `HttpMethod`
```typescript
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
```

### `AttributeType` (DTO attributes)
```typescript
type AttributeType =
  | 'string' | 'integer' | 'long' | 'double' | 'float' | 'boolean'
  | 'date' | 'datetime' | 'time' | 'file' | 'object' | 'binary';
```

### `ModelAttributeType` (Entity attributes)
```typescript
type ModelAttributeType =
  | 'string' | 'text' | 'integer' | 'long' | 'double' | 'float'
  | 'boolean' | 'date' | 'datetime' | 'time' | 'file' | 'relation' | 'enum';
```

### `RelationshipTypes`
```typescript
type RelationshipTypes = 'OneToOne' | 'OneToMany' | 'ManyToOne' | 'ManyToMany';
```

### `CollectionType`
```typescript
type CollectionType = 'list' | 'set' | 'collection' | 'pageable' | 'map';
```

### `ObjectTypes`
```typescript
type ObjectTypes = 'dto' | 'response' | 'filter' | 'command' | 'query' | 'event';
```

---

## Base / Shared Interfaces

### `IdentifiableElement`
```typescript
interface IdentifiableElement {
  id?: string;  // Optional UUID for tracking
}
```

### `VersionedConfig`
```typescript
interface VersionedConfig {
  version?: string;
}
```

---

## API Configuration

### `BaseApiConfig`

Input to `newApi()`.

```typescript
interface BaseApiConfig extends IdentifiableElement, VersionedConfig {
  type: 'springboot';
  name: string;                           // Project name (letters, digits, underscores only)
  group: string;                          // Java group (e.g. "com.example")
  artifact: string;                       // Maven artifact ID
  database: DatabaseTypes;               // Target database
  description?: string;
  projectStructureStyle: ProjectStructureStyle;
  enableObservability: boolean;
  enableEntityRevision: boolean;         // Hibernate Envers auditing
  enableGraalVm: boolean;
  dependencies?: Dependency[];
  package?: string;
  workspaceId?: string;
}
```

### `ApiConfig`

Extends `BaseApiConfig`, stored in `.igrpstudio/baseApi.json`. Adds computed `packageName`.

```typescript
interface ApiConfig extends BaseApiConfig {
  packageName: string;  // artifact with hyphens → underscores, non-alphanumeric removed
  javaVersion?: string;
  springBootVersion?: string;
  springDocVersion?: string;
  springCloudVersion?: string;
}
```

### `Dependency`
```typescript
interface Dependency {
  id: string;       // Spring Initializer dependency ID
  name: string;
  version?: string;
}
```

---

## Module Configuration

### `ModuleConfig`

Input to `addModule()`.

```typescript
interface ModuleConfig {
  type: 'module';
  name: string;  // Module name (letters, digits, underscores)
}
```

---

## Model Configuration

### `ModelConfig`

Input to `addModel()`.

```typescript
interface ModelConfig extends IdentifiableElement, VersionedConfig {
  type: 'model';
  name: string;              // Class name, expected to end with "Entity"
  tableName: string;         // Database table name
  attributes: Attribute[];
  module?: string;           // Module name (defaults to "shared")
  primaryKey?: PrimaryKey[];
  uniqueConstraints?: UniqueConstraint[];
  indexes?: EntityIndex[];
  relationReference?: RelationReference[];  // Inverse side of relations
  audit?: boolean;           // Extend AuditEntity (createdAt, updatedAt, etc.)
  revision?: boolean;        // @Audited (Hibernate Envers)
  readOnly?: boolean;        // If true, file is not overwritten on regeneration
  crud?: boolean;            // If true, generate CRUD endpoints for this model
}
```

### `Attribute`

Single field in a Model entity.

```typescript
interface Attribute {
  type: ModelAttributeType;
  name: string;
  length?: number | null;
  nullable?: boolean;
  unique?: boolean;
  primaryKey?: boolean;
  generationType?: 'AUTO' | 'IDENTITY' | 'SEQUENCE' | 'TABLE' | 'NONE';
  sequenceName?: string;
  defaultValue?: string;
  module?: string;
  relation?: Relation;           // When type = 'relation'
  skipFieldRevision?: boolean;   // @NotAudited
  objectType?: 'dto' | 'model' | 'java' | 'enum';
}
```

### `Relation`

JPA relationship definition (used inside `Attribute` when `type = 'relation'`).

```typescript
interface Relation {
  type: RelationshipTypes;
  fetchType: 'lazy' | 'eager';
  cardinality: 'twoWay' | 'oneWay';
  entity: string;           // Target entity class name
  fieldName?: string;       // Field name in the Java class
  mappedBy?: string;        // For inverse side
  module?: string;          // Module where the target entity lives
  referencedColumnName?: string;
  joinColumn?: string;
  joinTable?: string;
  inverseJoinColumn?: string;
  cascadeType?: CascadeType[];
  orphanRemoval?: boolean;
}
```

### `RelationReference`

Defines the inverse side of a relation (used in `ModelConfig.relationReference`).

```typescript
interface RelationReference {
  type: RelationshipTypes;
  fetchType: 'lazy' | 'eager';
  entity: string;
  module?: string;
  fieldName?: string;
  mappedBy?: string;
  joinColumn?: string;
  cascadeType?: CascadeType[];
  orphanRemoval?: boolean;
}
```

### `PrimaryKey`
```typescript
interface PrimaryKey {
  type: ModelAttributeType;
  name: string;
  length?: number | null;
  defaultValue?: string;
}
```

### `UniqueConstraint`
```typescript
interface UniqueConstraint {
  name: string;
  columns: string[];
}
```

### `EntityIndex`
```typescript
interface EntityIndex {
  name: string;
  columns: string[];
  unique: boolean;
}
```

---

## DTO Configuration

### `DTOConfig`

Input to `addDTO()`.

```typescript
interface DTOConfig extends IdentifiableElement, VersionedConfig {
  type: ObjectTypes;           // 'dto' | 'response' | 'filter' | 'command' | 'query' | 'event'
  name: string;
  module?: string;
  template: 'classic' | 'record';
  attributes: JavaAttribute[];
  enableCustonValidation?: boolean;
  readOnly?: boolean;
  extends?: DTOParentReference; // Inherit from another DTO
}
```

### `JavaAttribute`

A single field in a DTO.

```typescript
interface JavaAttribute {
  name: string;
  type: string | AttributeType;  // Java type or engine type
  objectType: 'dto' | 'model' | 'java' | 'enum';
  required: boolean;
  collectionType?: CollectionType;
  isEmail?: boolean;
  isUrl?: boolean;
  primaryKey?: boolean;
  before?: boolean;        // @Past / @PastOrPresent
  after?: boolean;         // @Future / @FutureOrPresent
  positive?: boolean;      // @Positive
  minLength?: number;
  maxLength?: number;
  regex?: string;          // @Pattern
  jsonAttributeName?: string;   // @JsonProperty alias
  xmlAttributeName?: string;
  module?: string;         // Module where the referenced type lives
}
```

### `DTOParentReference`
```typescript
interface DTOParentReference {
  name: string;
  module: string;
}
```

### `HandlerConfig`

Extends `DTOConfig` for DDD types (command/query/event). Adds `response`.

```typescript
interface HandlerConfig extends DTOConfig {
  response: { [statusCode: string]: Body };
}
```

---

## Controller Configuration

### `ControllerConfig`

Input to `addController()`.

```typescript
interface ControllerConfig extends IdentifiableElement, VersionedConfig {
  type: 'controller';
  name: string;
  basePath: string;              // Base URL path (e.g. "/api/v1/users")
  actions: ControllerAction[];
  module?: string;
  description: string;
  globalPermission?: PermissionsConfig;
  globalRoles?: string[];
}
```

### `ControllerAction`

Single endpoint/action inside a controller.

```typescript
interface ControllerAction {
  actionName: string;
  method: HttpMethod;
  path?: string;                      // Relative path (appended to basePath)
  permission?: PermissionsConfig;
  roles?: string[];
  headers?: HttpHeader[];
  modelAttribute?: ModelAttribute;    // @ModelAttribute form binding
  requestParams?: RequestParams[];
  requestBody?: BaseBody;
  responses?: { [statusCode: string]: Body };
  pathVariables?: PathVariables[];
  multipartFiles?: MultipartFile[];
}
```

### `PermissionsConfig`
```typescript
interface PermissionsConfig {
  items: string[];
  operator?: 'AND' | 'OR';  // default 'OR'
}
```

### `RequestParams` / `PathVariables`
```typescript
interface RequestParams {
  type: ParamsTypes;
  name: string;
  value?: string;
  description?: string;
  isRequired: boolean;
}
```

### `Body` / `BaseBody`
```typescript
interface BaseBody {
  id?: string;
  version?: string;
  name?: string;
  content: { [contentType: string]: ContentObject };
}
interface Body extends BaseBody {
  module?: string;
  description?: string;
}
```

---

## Enum Configuration

### `EnumConfig`

Input to `addEnum()`.

```typescript
interface EnumConfig extends IdentifiableElement, VersionedConfig {
  type: 'enum';
  name: string;
  module?: string;
  attributes: Array<{ name: string }>;  // Enum constant names (UPPER_CASE convention)
}
```

---

## Permission Configuration

### `PermissionConfig`

Input to `addPermission()`.

```typescript
interface PermissionConfig {
  type: 'permission';
  name: string;
  description: string;
  endpoints: IEndpoint[];
}

interface IEndpoint {
  type: string;         // 'controller' | 'model'
  resource: string;     // Controller or model name
  method: HttpMethod;
  path: string;
}
```

---

## Delete / Move Configuration

### `DeleteConfig`
```typescript
interface DeleteConfig {
  type: 'delete';
  elementType: 'model' | 'dto' | 'controller' | 'enum' | 'response';
  name: string;
  module?: string;
}
```

### `MoveConfig`
```typescript
interface MoveConfig {
  type: 'move';
  elementType: 'model' | 'dto' | 'controller' | 'enum' | 'response';
  name: string;
  fromModule: string;
  toModule: string;
}
```

---

## Engine Configuration

### `EngineConfigurationSettings`
```typescript
interface EngineConfigurationSettings {
  environment: 'development' | 'production';
}
```

---

## RenderContext

Internal type used throughout all generation modules.

```typescript
type RenderContext<T = undefined> = {
  resourceConfig: T;      // The specific manifest config
  basePath: string;       // Absolute path to the project root
  baseConfig: ApiConfig;  // Loaded from .igrpstudio/baseApi.json
  fullPath: string;       // Resolved Java output directory
};
```
