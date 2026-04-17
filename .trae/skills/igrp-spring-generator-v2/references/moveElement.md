# moveElement

Moves an element from one module to another. Internally: load the manifest from the source module → update its `module` field → produce the element in the destination module → delete it from the source module.

## Manifest fields (the object that describes what to move)

| Field | Required | Rules |
|---|---|---|
| `type` | Yes | One of: `dto` · `model` · `enum` · `filter` · `response` |
| `name` | Yes | Name of the element to move. Pattern: `^[A-Za-z][A-Za-z0-9_]*$` |
| `sourceModule` | Yes | Current module. Pattern: `^[A-Za-z][A-Za-z0-9_]*$` |
| `destinationModule` | Yes | Target module. Pattern: `^[A-Za-z][A-Za-z0-9_]*$` |
| `subType` | No | String |

No other fields are permitted.

## Supported types

| Type | Supported |
|---|---|
| `dto` | Yes |
| `filter` | Yes |
| `enum` | Yes |
| `model` | Yes |
| `response` | Yes |
| `controller` | **No** — too many inter-dependencies (services, handlers, permissions) |

## What happens step by step

```
1. Load   .igrpstudio/<sourceModule>/<type>/<Name>.json
2. Update module → destinationModule
3. Produce element files in the destination module
4. Delete element from the source module (dependency check applies)
```

If step 4 fails because other elements still reference the source, the destination files are already written. Clean the references manually and retry the deletion.

## Effect on Java packages

Moving an element changes its Java package because the package is derived from the file path. All files that import from the old package are **not updated automatically** — search for usages in the project and update those import statements manually after the move.

## Preconditions

- The destination module must already exist (created via `addModule`) before moving.
- `readOnly: true` on the source manifest does not prevent a move.
