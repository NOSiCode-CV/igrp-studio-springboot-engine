# addController

Produces a REST controller and a manifest. In technical style also produces a service interface and service implementation. In domain style produces a command or query class and a handler per action, plus test stubs.

## Manifest written to

`.igrpstudio/<module>/controllers/<Name>Controller.json`

## Manifest fields

### Top-level

| Field | Required | Rules |
|---|---|---|
| `type` | Yes | Must be exactly `controller` |
| `name` | Yes | PascalCase (without "Controller"). Pattern: `^[A-Za-z][A-Za-z0-9_]*$` |
| `basePath` | Yes | URL base path. Pattern: `^[A-Za-z][A-Za-z0-9-/]*$` |
| `actions` | Yes | Array of action objects. At least one required |
| `description` | Yes | Free text description |
| `module` | No | Default: `shared`. Pattern: `^[A-Za-z][A-Za-z0-9_]*$` |
| `globalPermission` | No | Permission reference object |
| `globalRoles` | No | Array of role strings |
| `readOnly` | No | Boolean — prevents overwriting |
| `id` | No | String |
| `version` | No | String |

No other fields are permitted.

### Action object

| Field | Required | Rules |
|---|---|---|
| `actionName` | Yes | camelCase. Pattern: `^[A-Za-z][A-Za-z0-9_]*$` |
| `method` | Yes | One of: `GET` · `POST` · `PUT` · `DELETE` · `PATCH` · `OPTIONS` · `HEAD` |
| `path` | No | Relative path segment. May contain `{variable}`. Pattern: `^$\|^/?[A-Za-z_{][A-Za-z0-9_{}/-]*$` |
| `description` | No | Free text |
| `permission` | No | Permission reference object |
| `roles` | No | Array of role strings |
| `requestParams` | No | Array of request parameter objects |
| `pathVariables` | No | Array of path variable objects |
| `headers` | No | Array of HTTP header objects |
| `multipartFiles` | No | Array of multipart file objects |
| `modelAttribute` | No | Model attribute object |
| `requestBody` | No | Body object |
| `responses` | No | Object mapping status codes (3-digit pattern) to body objects |

### Permission reference object

| Field | Required | Rules |
|---|---|---|
| `items` | Yes | Array of permission key strings. At least one required |
| `operator` | No | One of: `AND` · `OR` |

### Request parameter object

| Field | Required | Rules |
|---|---|---|
| `type` | Yes | One of: `long` · `string` · `integer` · `boolean` · `object` · `file` · `uuid` · `date` |
| `name` | Yes | Pattern: `^[a-zA-Z0-9_]+$` |
| `isRequired` | Yes | Boolean |
| `value` | No | Pattern: `^[a-zA-Z0-9_]+$` |
| `description` | No | String |
| `collectionType` | No | One of: `list` · `set` · `collection` |

### Path variable object

| Field | Required | Rules |
|---|---|---|
| `type` | Yes | One of: `long` · `string` · `integer` · `boolean` · `object` · `file` · `uuid` · `date` |
| `name` | Yes | Pattern: `^[a-zA-Z0-9_]+$` |
| `isRequired` | Yes | Boolean |

### HTTP header object

| Field | Required | Rules |
|---|---|---|
| `type` | Yes | One of: `long` · `string` · `integer` · `boolean` · `object` · `file` · `uuid` · `date` |
| `header` | Yes | One of the fixed header names listed below |
| `value` | Yes | Non-empty string |
| `isRequired` | Yes | Boolean |

**Allowed header names:** `Accept` · `Cache-Control` · `Content-Type` · `Content-Length` · `Accept-Charset` · `Accept-Encoding` · `Accept-Language` · `Expires` · `Access-Control-Allow-Origin` · `Access-Control-Request-Headers` · `Access-Control-Request-Method` · `Custom-Header`

> Use `Custom-Header` for any header not in the list above.

### Multipart file object

| Field | Required | Rules |
|---|---|---|
| `type` | Yes | String |
| `name` | Yes | String |
| `isRequired` | Yes | Boolean |

### Model attribute object

| Field | Required | Rules |
|---|---|---|
| `name` | Yes | DTO class name. No spaces or hyphens |
| `module` | No | Pattern: `^[A-Za-z][A-Za-z0-9_]*$` |

### Body object (requestBody / responses values)

| Field | Required | Rules |
|---|---|---|
| `content` | Yes | Object mapping MIME types to schema objects |
| `name` | No | String |
| `module` | No | String |
| `description` | No | String |
| `id` | No | String |
| `version` | No | String |

Response status codes must match the pattern `^\d{3}$` (e.g. `"200"`, `"201"`, `"400"`).

## Output paths

### Technical style

| File | Path |
|---|---|
| Controller | `<mainPath>/controllers/<name_lowercase>/<Name>Controller.java` |
| Service interface | `<mainPath>/services/I<Name>Service.java` |
| Service impl | `<mainPath>/services/<Name>Service.java` |

### Domain style

| File | Path |
|---|---|
| Controller | `<mainPath>/<module>/interfaces/rest/<Name>Controller.java` |
| GET action → Query | `<mainPath>/<module>/application/queries/<ActionName>Query.java` |
| GET action → Query handler | `<mainPath>/<module>/application/queries/<ActionName>QueryHandler.java` |
| GET action → Handler test | `<testPath>/<module>/application/queries/<ActionName>QueryHandlerTest.java` |
| Non-GET → Command | `<mainPath>/<module>/application/commands/<ActionName>Command.java` |
| Non-GET → Command handler | `<mainPath>/<module>/application/commands/<ActionName>CommandHandler.java` |
| Non-GET → Handler test | `<testPath>/<module>/application/commands/<ActionName>CommandHandlerTest.java` |

## Permission expression resolution

```
items: ["A", "B"], operator: "AND"  →  @PreAuthorize("hasAuthority('A') and hasAuthority('B')")
items: ["A", "B"], operator: "OR"   →  @PreAuthorize("hasAuthority('A') or hasAuthority('B')")
roles: ["ADMIN", "USER"]            →  @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
both permission and roles           →  combine with " and "
```

## Method parameter order

Parameters always appear in this fixed order:
1. `@PathVariable` — one per path variable entry
2. `@RequestParam` — one per request param entry
3. `@RequestHeader` — one per header entry
4. `@RequestBody` — from `requestBody.content["application/json"]`
5. `@ModelAttribute` — from `modelAttribute`
6. `@RequestPart` — one per multipart file entry
7. `Pageable pageable` — only for GET with pageable response type

## Java output — controller

```java
/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME */

package <computed.package>;

<imports>

@IgrpController
@RestController
@RequestMapping(path = "<basePath>")
[@PreAuthorize("<GLOBAL_EXPRESSION>")]
@Tag(name = "<Name>", description = "<description>")
public class <Name>Controller {

    [technical:]
    private final I<Name>Service <lowerName>Service;
    public <Name>Controller(I<Name>Service <lowerName>Service) {
        this.<lowerName>Service = <lowerName>Service;
    }

    [domain — only injected buses that are needed:]
    [private final QueryBus queryBus;]
    [private final CommandBus commandBus;]
    public <Name>Controller([QueryBus queryBus,] [CommandBus commandBus]) { ... }

    [per action:]
    [@PreAuthorize("<ACTION_EXPRESSION>")]
    @<Method>Mapping([value = "<path>"])
    @Operation(summary = "<actionName>", operationId = "<actionName>")
    @ApiResponses(value = { @ApiResponse(responseCode = "<code>", ...) })
    public ResponseEntity<<ResolvedType>> <actionName>(<params>) {

        [technical:]   var response = <lowerName>Service.<actionName>(<args>); return response;
        [domain GET:]  final var query = new <ActionName>Query(<args>); return queryBus.handle(query);
        [domain other:]final var command = new <ActionName>Command(<args>); return commandBus.send(command);
    }
}
```

## Java output — technical service

```java
@Service
public interface I<Name>Service {
    ResponseEntity<<ReturnType>> <actionName>(<params>);
}

@Service
public class <Name>Service implements I<Name>Service {
    @Override
    public ResponseEntity<<ReturnType>> <actionName>(<params>) {
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
```

## Java output — domain handlers

```java
@Component
public class <ActionName>CommandHandler implements CommandHandler<<ActionName>Command, ResponseEntity<?>> {
    @Override
    public ResponseEntity<?> handle(<ActionName>Command command) {
        throw new UnsupportedOperationException("Not implemented yet");
    }
}

@Component
public class <ActionName>QueryHandler implements QueryHandler<<ActionName>Query, ResponseEntity<?>> {
    @Override
    public ResponseEntity<?> handle(<ActionName>Query query) {
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
```
