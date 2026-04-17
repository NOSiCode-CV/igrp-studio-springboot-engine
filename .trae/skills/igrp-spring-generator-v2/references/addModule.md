# addModule

Creates a new logical module with its directory structure and `.igrpstudio/<module>/module.json` manifest.

> The `module` field in all other operations defaults to `shared` when omitted. Create the module first before adding models, DTOs, enums, or controllers to it.

## Schema

```typescript
interface ModuleConfig {
  type: 'module'; // required, literal
  name: string;   // required, [a-zA-Z][a-zA-Z0-9_]*
}
```

## Manifest Output

Written to: `.igrpstudio/<normalizedModuleName>/module.json`

```json
{
  "type": "module",
  "name": "<name>"
}
```

## Directories Created

### Technical Style

```
.igrpstudio/<module>/
  module.json
  controllers/
  models/
  dto/
    .gitkeep
  enum/
    .gitkeep
src/main/java/<groupPath>/<packageName>/
  models/
  services/
  controllers/
  config/
  security/
```

### Domain Style

```
.igrpstudio/<module>/
  module.json
  models/
    .gitkeep
  dto/
    .gitkeep
  enum/
    .gitkeep
src/main/java/<groupPath>/<packageName>/<module>/
  application/
    dto/
    commands/
    queries/
    events/
    enum/
  domain/
    models/
      .gitkeep
    repository/
      .gitkeep
    service/
      .gitkeep
    events/
      .gitkeep
  infrastructure/
    messaging/
    persistence/
      entity/
      repository/
  interfaces/
    rest/
```

**.gitkeep content:**
```
This file is used to let Git track empty directories.
```

## Example

```json
{
  "type": "module",
  "name": "orders"
}
```

Creates `.igrpstudio/orders/module.json` and all corresponding module directories.
