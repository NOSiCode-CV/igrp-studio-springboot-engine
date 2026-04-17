# addModule

Creates a named module with its directory structure and a module manifest. All other operations target a module — this must exist before adding models, DTOs, enums, or controllers to it. The default module `shared` is created by `newApi` and does not need to be created manually.

## Manifest written to

`.igrpstudio/<normalizedModuleName>/module.json`

Module name normalization: replace `-` with `_`, remove non-alphanumeric non-underscore characters, lowercase.

## Manifest fields

| Field | Required | Rules |
|---|---|---|
| `type` | Yes | Must be exactly `module` |
| `name` | Yes | Must start with a letter. Only letters, digits, underscores. Pattern: `^[A-Za-z][A-Za-z0-9_]*$` |

No other fields are permitted.

## Directories created

### Technical style

```
.igrpstudio/<module>/
  module.json
  controllers/
  models/
  dto/
    .gitkeep
  enum/
    .gitkeep
```

### Domain style

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

`.gitkeep` content: `This file is used to let Git track empty directories.`
