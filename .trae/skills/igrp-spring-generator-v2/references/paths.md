# Path & Naming Conventions

All path computation depends on values loaded from `.igrpstudio/baseApi.json`:

| Field | Example | Purpose |
|---|---|---|
| `group` | `cv.igrp` | Java group ID |
| `artifact` | `order-service` | Maven artifact ID |
| `name` | `OrderService` | Class name prefix |
| `projectStructureStyle` | `technical` or `domain` | Directory layout |

## Package Name Normalization

```
normalizePackageName(artifact):
  1. Replace all `-` with `_`
  2. Remove all characters not in [a-zA-Z0-9_]
  Result: packageName

Example: "order-service" → "order_service"
```

## Java Output Base Paths

```
groupPath = group.replace('.', '/')        // "cv/igrp"
mainPath  = src/main/java/<groupPath>/<packageName>
testPath  = src/test/java/<groupPath>/<packageName>
```

## Package Statement Resolution

To derive the `package` declaration for any Java file:

1. Convert path to forward slashes
2. Remove the `<basePath>/` prefix
3. Split by `/`
4. Drop segments: `src`, `main`, `test`, `java`
5. Join remaining segments with `.`

**Example:**
- File: `src/main/java/cv/igrp/order_service/dto/CreateOrderDTO.java`
- Package: `cv.igrp.order_service.dto`

## Module Name Normalization

```
normalizeModuleName(name):
  1. Replace `-` with `_`
  2. Remove all characters not in [a-zA-Z0-9_]
  3. Lowercase
  Default when omitted: "shared"
```

## Manifest Paths (`.igrpstudio/`)

| Element | Manifest Path |
|---|---|
| Base API | `.igrpstudio/baseApi.json` |
| Module | `.igrpstudio/<module>/module.json` |
| DTO (type: dto / response / filter) | `.igrpstudio/<module>/dto/<NormalizedName>DTO.json` |
| DTO (type: command) | `.igrpstudio/<module>/dto/<NormalizedName>Command.json` |
| DTO (type: query) | `.igrpstudio/<module>/dto/<NormalizedName>Query.json` |
| DTO (type: event) | `.igrpstudio/<module>/dto/<NormalizedName>Event.json` |
| Controller | `.igrpstudio/<module>/controllers/<NormalizedName>Controller.json` |
| Model | `.igrpstudio/<module>/models/<ModelName>.json` |
| Enum | `.igrpstudio/<module>/enum/<EnumName>.json` |
| Permission | `.igrpstudio/permissions/<PermissionName>.json` |

**DTO name normalization before saving:** strip trailing `dto` / `DTO` / `command` / `Command` / `query` / `Query` / `event` / `Event` (case-insensitive) from the input name, then append the suffix.

Example: `name: "CreateOrderDTO"` → stored as `CreateOrderDTO.json`, class name `CreateOrderDTO`.

## Java Output Paths

### Technical Style

| Element | Java Path |
|---|---|
| Entity | `<mainPath>/models/<modelName_lowercase>/<ModelName>.java` |
| Repository | `<mainPath>/models/<modelName_lowercase>/<ModelName>Repository.java` |
| DTO (all types) | `<mainPath>/dto/<NormalizedName>DTO.java` |
| Command | `<mainPath>/dto/<NormalizedName>Command.java` |
| Query | `<mainPath>/dto/<NormalizedName>Query.java` |
| Event | `<mainPath>/dto/<NormalizedName>Event.java` |
| Controller | `<mainPath>/controllers/<controllerName_lowercase>/<ControllerName>Controller.java` |
| Service Interface | `<mainPath>/services/I<ControllerName>Service.java` |
| Service Impl | `<mainPath>/services/<ControllerName>Service.java` |
| Enum | `<mainPath>/enum/<EnumName>.java` |

### Domain Style

| Element | Java Path |
|---|---|
| Entity | `<mainPath>/<module>/infrastructure/persistence/entity/<ModelName>.java` |
| Domain Repository Interface | `<mainPath>/<module>/domain/repository/<ModelName>Repository.java` |
| Repository Impl | `<mainPath>/<module>/infrastructure/persistence/repository/<ModelName>RepositoryImpl.java` |
| Entity Repository Adapter | `<mainPath>/<module>/infrastructure/persistence/repository/<ModelName>EntityRepository.java` |
| DTO (type: dto / response / filter) | `<mainPath>/<module>/application/dto/<NormalizedName>DTO.java` |
| Command | `<mainPath>/<module>/application/commands/<NormalizedName>Command.java` |
| Query | `<mainPath>/<module>/application/queries/<NormalizedName>Query.java` |
| Event | `<mainPath>/<module>/application/events/<NormalizedName>Event.java` |
| Controller | `<mainPath>/<module>/interfaces/rest/<ControllerName>Controller.java` |
| Command Handler | `<mainPath>/<module>/application/commands/<ActionName>CommandHandler.java` |
| Query Handler | `<mainPath>/<module>/application/queries/<ActionName>QueryHandler.java` |
| Enum | `<mainPath>/<module>/application/enum/<EnumName>.java` |
