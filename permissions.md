# Permissions

This document objectively describes the permission interfaces and functions. It is strictly based on the typings and the existing code.

## Introduction
- Permissions are organized into groups, persisted as Java classes with `@IgrpPermission` annotations inside the project structure.
- Flow: define permission group → persist Java class → read and extract permissions into JSON.

## Interfaces

### AppExportsConfig (`src/interfaces/types.ts:234`)
- Purpose: export envelope containing all permission groups read from disk.
- Shape: `permissionGroups: GroupPermissionDef[]`.

### GroupPermissionDef (`src/interfaces/types.ts:238`)
- Purpose: represents a group (class) aggregating multiple permissions.
- Fields: `name: string`, `permissions: PermissionDef[]`, `module?: string`.

### PermissionDef (`src/interfaces/types.ts:244`)
- Purpose: describes a single permission extracted/annotated.
- Fields: `name: string`, `description: string`, `enabled?: boolean`.

### PermissionsConfig (`src/interfaces/types.ts:250`)
- Purpose: defines, at controller/action level, the set of required permissions.
- Fields: `items: string[]`, `operator?: 'AND' | 'OR'` (default `OR`).

### ControllerAction (`src/interfaces/types.ts:266`)
- Purpose: defines an HTTP action of a controller, including the associated permissions configuration.
- Relevant fields for permissions: `permission?: PermissionsConfig`, `roles?: string[]`. Also includes `actionName`, `method`, `path`, and other metadata.

## Functions

### addPermissionConfig(basePath, groupConfig, moduleName?) (`src/index.ts:1348`)
- Goal: persist a `GroupPermissionDef` as the Java class representing the permission group.
- Parameters:
  - `basePath: string` — project base path. Required.
  - `groupConfig: GroupPermissionDef` — group definition and its permissions.
  - `moduleName?: string` — module name to resolve the output directory. Optional.
- Behavior:
  - Validates `basePath` and capitalizes `groupConfig.name`.
  - Loads the application base config to resolve paths.
  - Sets `groupConfig.module = moduleName` (or `'shared'` if not provided).
  - Renders and saves the group `.java` file via template.
- Storage (output path resolved by `saveGroupPermissionDef`):
  - DDD structure: `<basePath>/<main>/<module|shared>/infrastructure/authorization/permission/<GroupName>.java` (`src/modules/permission/saveGroupPermissionDefinition.ts:10–24`).
  - Classic structure: `<basePath>/<main>/authorization/permission/<GroupName>.java` (`src/modules/permission/saveGroupPermissionDefinition.ts:20–24`).

### loadConfigs(basePath, moduleName?) (`src/index.ts:1373`)
- Goal: read permission groups from `.java` files and export as `AppExportsConfig`.
- Parameters:
  - `basePath: string` — project base path.
  - `moduleName?: string` — module to inspect; defaults to `'shared'`.
- Behavior:
  - Resolves `<basePath>/<main>/<module|shared>/infrastructure/authorization/permission/`.
  - Lists all `.java` files and builds a `GroupPermissionDef` for each class found.
  - Permission extraction parses `@IgrpPermission` annotations in class content (`src/utils/permissionParser.ts:6–22`).
- Return: `AppExportsConfig` with `permissionGroups: GroupPermissionDef[]`.

## Expected Flow
- Create: build `GroupPermissionDef` with group name and `PermissionDef[]`.
- Store: call `addPermissionConfig(...)` to render and save the Java class into the module’s permission directory.
- Read: call `loadConfigs(...)` to scan the directory and obtain `AppExportsConfig` as JSON.

## Practical Examples

### 1) Create `GroupPermissionDef`
```ts
import { GroupPermissionDef } from './src/interfaces/types';

const group: GroupPermissionDef = {
  name: 'AppPermissionThree',
  permissions: [
    { name: 'hr.employee.view', description: 'Permission to view employee', enabled: false },
    { name: 'hr.employee.edit', description: 'Permission to edit employee' },
    { name: 'hr.leave.approve', description: 'Permission to approve leave requests' }
  ]
};
```

### 2) Use `addPermissionConfig`
```ts
import { addPermissionConfig } from './src';

await addPermissionConfig('C:/projects/my-api', group, 'shared');
// Without moduleName: await addPermissionConfig('C:/projects/my-api', group);
```

Expected disk output (DDD):
- `C:/projects/my-api/<main>/shared/infrastructure/authorization/permission/AppPermissionThree.java`

Note: the class contains one `@IgrpPermission(name, description, enabled?)` annotation per permission.

### 3) Load permissions with `loadConfigs`
```ts
import { loadConfigs } from './src';

const result = await loadConfigs('C:/projects/my-api', 'shared');
console.log(JSON.stringify(result, null, 2));
```

Example output (`AppExportsConfig`):
```json
{
  "permissionGroups": [
    {
      "name": "AppPermissionThree",
      "permissions": [
        { "name": "hr.employee.view", "description": "Permission to view employee", "enabled": false },
        { "name": "hr.employee.edit", "description": "Permission to edit employee" },
        { "name": "hr.leave.approve", "description": "Permission to approve leave requests" }
      ]
    }
  ]
}
```

## `PermissionsConfig` and `ControllerAction` Examples
- `PermissionsConfig` for an action with default `OR` operator:
```json
{
  "items": ["permission_action_one", "permission_action_two"],
  "operator": "OR"
}
```
- `ControllerAction` with associated permissions:
```json
{
  "actionName": "updateAnimal",
  "path": "update-animal",
  "method": "PUT",
  "roles": ["role_one", "role_two"],
  "permission": {
    "items": ["permission_action_one", "permission_action_two"],
    "operator": "OR"
  }
}
```

## Notes
- `moduleName` only controls the storage directory; groups returned by `loadConfigs` do not set the `module` field by default.
- If the permission directory does not exist, `loadConfigs` returns `{ "permissionGroups": [] }` (`src/index.ts:1398–1400`).