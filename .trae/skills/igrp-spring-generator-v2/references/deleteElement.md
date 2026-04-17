# deleteElement

Removes a manifest file and its corresponding Java file(s). Performs dependency checking before deletion to prevent broken references.

## Schema

```typescript
interface DeleteConfig {
  type: string;     // required — one of: model, dto, filter, response, enum, controller
  name: string;     // required, element name to delete
  module?: string;  // defaults to "shared"
  subType?: string; // optional
}
```

## Dependency Checking

Before deleting, the engine scans for references to the element being removed:

| Element type | Checks performed |
|---|---|
| `dto` / `filter` | Referenced by other DTOs (`extends`, attribute `objectType: 'dto'`) and controller `requestBody` / `responses` |
| `enum` | Referenced by DTO attributes (`objectType: 'enum'`) and model attributes (`type: 'enum'`) |
| `model` | Referenced by `relation` attributes in other models and DTO attributes with `objectType: 'model'` |
| `controller` | Checks for permission groups linked to this controller's actions |

If dependencies are found the operation **fails with an error listing all dependents**. Remove the references first, then delete.

## What Gets Deleted

| Element type | Files removed |
|---|---|
| `dto` / `filter` / `response` | Manifest + Java DTO class |
| `enum` | Manifest + Java enum class |
| `model` | Manifest + entity Java + repository Java (domain: also impl and entity adapter) |
| `controller` | Manifest + controller Java + service interface + service impl (technical) OR controller + all handlers (domain) |

## Manifest Paths Removed

| Type | Manifest |
|---|---|
| `dto` / `filter` / `response` | `.igrpstudio/<module>/dto/<Name>DTO.json` |
| `command` | `.igrpstudio/<module>/dto/<Name>Command.json` |
| `query` | `.igrpstudio/<module>/dto/<Name>Query.json` |
| `event` | `.igrpstudio/<module>/dto/<Name>Event.json` |
| `enum` | `.igrpstudio/<module>/enum/<Name>.json` |
| `model` | `.igrpstudio/<module>/models/<Name>.json` |
| `controller` | `.igrpstudio/<module>/controllers/<Name>Controller.json` |

## Examples

**Delete a DTO:**
```json
{
  "type": "dto",
  "name": "CreateOrder",
  "module": "orders"
}
```

Deletes (technical):
- `.igrpstudio/orders/dto/CreateOrderDTO.json`
- `<mainPath>/dto/CreateOrderDTO.java`

---

**Delete a model:**
```json
{
  "type": "model",
  "name": "Order",
  "module": "orders"
}
```

Deletes (technical):
- `.igrpstudio/orders/models/Order.json`
- `<mainPath>/models/order/Order.java`
- `<mainPath>/models/order/OrderRepository.java`

Deletes (domain):
- `.igrpstudio/orders/models/Order.json`
- `<mainPath>/orders/infrastructure/persistence/entity/Order.java`
- `<mainPath>/orders/domain/repository/OrderRepository.java`
- `<mainPath>/orders/infrastructure/persistence/repository/OrderRepositoryImpl.java`
- `<mainPath>/orders/infrastructure/persistence/repository/OrderEntityRepository.java`

## Important Notes

- `readOnly: true` on a manifest does **not** prevent deletion. That flag only prevents overwriting during generation.
- Deleting a `model` also removes its entry from any permission manifests that reference it.
- Deleting a `controller` also cleans its permission endpoints from `.igrpstudio/permissions/` manifests.
