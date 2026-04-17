# Path & Naming Rules

All path and package decisions derive from four values in `.igrpstudio/baseApi.json`:

| Field | Example | Role |
|---|---|---|
| `group` | `cv.igrp` | Java group — becomes directory segments |
| `artifact` | `order-service` | Maven artifact — normalized into `packageName` |
| `name` | `OrderService` | API name — used as class prefix |
| `projectStructureStyle` | `technical` or `domain` | Controls directory layout |

## Package Name — normalization rule

```
1. Replace every `-` with `_`
2. Remove every character that is not a letter, digit, or underscore
Result → packageName

Example: "order-service" → "order_service"
```

## Base Paths

```
groupPath = replace every "." in group with "/"    → "cv/igrp"
mainPath  = src/main/java/<groupPath>/<packageName>
testPath  = src/test/java/<groupPath>/<packageName>
```

## Deriving a Java Package Statement

Given a file path, the package statement is computed as:
1. Convert to forward slashes
2. Remove the project root prefix
3. Split by `/`
4. Drop the segments `src`, `main`, `test`, `java`
5. Join the remaining segments with `.`

**Example**
- File: `src/main/java/cv/igrp/order_service/dto/CreateOrderDTO.java`
- Package: `cv.igrp.order_service.dto`

## Module Name — normalization rule

```
1. Replace `-` with `_`
2. Remove every character that is not a letter, digit, or underscore
3. Lowercase the result
Default when omitted: "shared"
```

## Manifest Paths

| What | Path in `.igrpstudio/` |
|---|---|
| Base API | `baseApi.json` |
| Module | `<module>/module.json` |
| DTO — type dto / response / filter | `<module>/dto/<Name>DTO.json` |
| DTO — type command | `<module>/dto/<Name>Command.json` |
| DTO — type query | `<module>/dto/<Name>Query.json` |
| DTO — type event | `<module>/dto/<Name>Event.json` |
| Controller | `<module>/controllers/<Name>Controller.json` |
| Model | `<module>/models/<Name>.json` |
| Enum | `<module>/enum/<Name>.json` |
| Permission | `permissions/<Name>.json` |

> **DTO name rule:** strip any trailing `DTO`, `Command`, `Query`, or `Event` (case-insensitive) from the input name before appending the suffix. Example: input `CreateOrderDTO` → stored as `CreateOrderDTO.json`.

## Java Output Paths

### Technical style

| What | Path |
|---|---|
| Entity | `<mainPath>/models/<name_lowercase>/<Name>.java` |
| Repository | `<mainPath>/models/<name_lowercase>/<Name>Repository.java` |
| DTO (all object types) | `<mainPath>/dto/<Name><Suffix>.java` |
| Controller | `<mainPath>/controllers/<name_lowercase>/<Name>Controller.java` |
| Service interface | `<mainPath>/services/I<Name>Service.java` |
| Service impl | `<mainPath>/services/<Name>Service.java` |
| Enum | `<mainPath>/enum/<Name>.java` |

### Domain style

| What | Path |
|---|---|
| Entity | `<mainPath>/<module>/infrastructure/persistence/entity/<Name>.java` |
| Domain repository interface | `<mainPath>/<module>/domain/repository/<Name>Repository.java` |
| Repository impl | `<mainPath>/<module>/infrastructure/persistence/repository/<Name>RepositoryImpl.java` |
| Entity repository (JPA adapter) | `<mainPath>/<module>/infrastructure/persistence/repository/<Name>EntityRepository.java` |
| DTO — dto / response / filter | `<mainPath>/<module>/application/dto/<Name>DTO.java` |
| Command | `<mainPath>/<module>/application/commands/<Name>Command.java` |
| Query | `<mainPath>/<module>/application/queries/<Name>Query.java` |
| Event | `<mainPath>/<module>/application/events/<Name>Event.java` |
| Controller | `<mainPath>/<module>/interfaces/rest/<Name>Controller.java` |
| Command handler | `<mainPath>/<module>/application/commands/<ActionName>CommandHandler.java` |
| Query handler | `<mainPath>/<module>/application/queries/<ActionName>QueryHandler.java` |
| Handler test | `<testPath>/<module>/application/commands|queries/<ActionName>*HandlerTest.java` |
| Enum | `<mainPath>/<module>/application/enum/<Name>.java` |
