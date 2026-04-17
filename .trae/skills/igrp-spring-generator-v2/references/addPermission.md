# addPermission

Registers a named permission group that documents which endpoints it governs. Permission keys defined here are referenced in controller action `permission.items` arrays, which resolve to `@PreAuthorize` expressions on the generated controller methods.

## Manifest written to

`.igrpstudio/permissions/<Name>.json`

## Manifest fields

### Top-level

| Field | Required | Rules |
|---|---|---|
| `type` | Yes | Must be exactly `permission` |
| `name` | Yes | Permission group name. Pattern: `^[A-Za-z][A-Za-z0-9_]*$` — no spaces, no hyphens |
| `description` | Yes | Human-readable description |
| `endpoints` | Yes | Array of endpoint objects. Cannot be empty |

No other fields are permitted.

### Endpoint object

| Field | Required | Rules |
|---|---|---|
| `type` | Yes | One of: `controller` · `model` |
| `resource` | Yes | Controller or model name this endpoint belongs to |
| `method` | Yes | One of: `GET` · `POST` · `PUT` · `PATCH` · `DELETE` |
| `path` | Yes | Full URL path of the endpoint |

## How permissions connect to Java code

This manifest is **metadata only** — it does not generate Java code directly. The `@PreAuthorize` annotation is produced by `addController` when an action carries a `permission` field:

```json
"permission": { "items": ["ORDERS_WRITE"], "operator": "OR" }
```

Generates:

```java
@PreAuthorize("hasAuthority('ORDERS_WRITE')")
```

The permission manifest records the human-readable group, description, and the endpoints it covers. This metadata is used by the Studio to manage permission assignments in the UI and to keep permission groups consistent with the actual controller actions.

## Related operations

| Operation | Effect |
|---|---|
| `addPermission` | Writes `.igrpstudio/permissions/<Name>.json` |
| `deletePermission` | Removes `.igrpstudio/permissions/<Name>.json` |
| `getPermissions` | Loads all manifests from `.igrpstudio/permissions/` |

## Automatic permission cleanup

When `deleteElement` removes a **controller**, all endpoint entries that reference that controller are removed from every permission manifest. When a **model** with `crud: true` is deleted, its CRUD endpoints are cleaned from permission manifests as well.

## Notes

- Before adding a new permission group, check existing manifests in `.igrpstudio/permissions/` to avoid duplicate names.
- Permission key strings in `items` are free-form identifiers — keep them consistent across controllers and permission manifests (e.g. `ORDERS_READ`, `ORDERS_WRITE`).
