# deleteElement

Removes the manifest and all corresponding Java files for a named element. Performs dependency checking before deletion to prevent broken references in the project.

## Manifest fields (the object that describes what to delete)

| Field | Required | Rules |
|---|---|---|
| `type` | Yes | One of: `dto` · `controller` · `model` · `module` · `enum` · `filter` · `response` |
| `name` | Yes | Name of the element to delete. Pattern: `^[A-Za-z][A-Za-z0-9_]*$` |
| `module` | No | Default: `shared`. Pattern: `^[A-Za-z][A-Za-z0-9_]*$` |
| `subType` | No | String |

No other fields are permitted.

## Dependency checking

Before deleting, scan all manifests in `.igrpstudio/` for references to the element:

| Element being deleted | What is checked |
|---|---|
| `dto` · `filter` | Referenced by other DTOs (`extends.name`, attribute with `objectType: 'dto'`) and by controller `requestBody` / `responses` schemas |
| `enum` | Referenced by DTO attributes (`objectType: 'enum'`) and model attributes (`type: 'enum'`, `objectType` matching the enum name) |
| `model` | Referenced by `relation.entity` in other models and by DTO attributes with `objectType: 'model'` |
| `controller` | Permission manifests that list this controller's actions as endpoints |

If dependencies are found, deletion **fails** and lists the dependents. Remove those references first, then delete.

## What gets removed per type

| `type` | Manifest removed | Java files removed |
|---|---|---|
| `dto` · `filter` · `response` | `.igrpstudio/<module>/dto/<Name>DTO.json` | DTO class |
| `enum` | `.igrpstudio/<module>/enum/<Name>.json` | Enum class |
| `model` (technical) | `.igrpstudio/<module>/models/<Name>.json` | Entity + Repository |
| `model` (domain) | `.igrpstudio/<module>/models/<Name>.json` | Entity + domain Repository interface + RepositoryImpl + EntityRepository |
| `controller` (technical) | `.igrpstudio/<module>/controllers/<Name>Controller.json` | Controller + service interface + service impl |
| `controller` (domain) | `.igrpstudio/<module>/controllers/<Name>Controller.json` | Controller + all command/query handlers for its actions |

Deleting a `controller` also cleans its endpoints from all permission manifests under `.igrpstudio/permissions/`.

Deleting a `model` also removes its entries from any permission manifests that reference it.

## Notes

- `readOnly: true` on a manifest does **not** prevent deletion — that flag only blocks regeneration overwrites.
- Deleting a `module` checks that no models, DTOs, enums, or controllers exist inside it first.
