# moveElement

Moves an element from one module to another. Internally: load manifest from source → update `module` field → run the corresponding `add*` operation in destination → delete from source.

## Schema

```typescript
interface MoveConfig {
  type: string;              // required — one of: dto, filter, enum, model, response
  name: string;              // required, element name
  sourceModule: string;      // required, current module
  destinationModule: string; // required, target module
  subType?: string;
}
```

## Supported Types

| Type | Supported |
|---|---|
| `dto` | Yes |
| `filter` | Yes |
| `enum` | Yes |
| `model` | Yes |
| `response` | Yes |
| `controller` | **No** — controllers have too many inter-dependencies (services, handlers, permissions) |

## Internal Flow

```
1. Load   .igrpstudio/<sourceModule>/<type>/<Name>.json
2. Update module field → destinationModule
3. Run    add*(updatedConfig, basePath)   ← creates files in destination
4. Run    deleteElement(source config)   ← removes files from source (force=false)
```

If step 4 fails due to remaining references, destination files are already created. Clean them up manually before retrying.

## Effect on Packages

Moving an element changes its Java package because the package is derived from the path. All other files that import from the old package **are not automatically updated** — search for usages and update import statements manually after moving.

## Example

```json
{
  "type": "dto",
  "name": "CreateOrder",
  "sourceModule": "shared",
  "destinationModule": "orders"
}
```

Steps executed:
1. Load `.igrpstudio/shared/dto/CreateOrderDTO.json`
2. Set `module = "orders"`
3. Write new DTO to `orders` module paths
4. Delete `CreateOrderDTO` from `shared` module

## Important Notes

- The destination module must already exist (created via `addModule`) before moving.
- If the element has `readOnly: true`, it will still be moved — `readOnly` only blocks regeneration overwrites, not moves.
- After moving, update any `module` references in DTOs, models, or controllers that pointed to the old location.
