# addController

Generates a REST controller. For **technical** style: also generates a service interface and service implementation. For **domain** style: generates CQRS command/query classes and handlers per action, plus test stubs.

## Schema

```typescript
interface ControllerConfig {
  type: 'controller';          // required, literal
  name: string;                // required, PascalCase (without "Controller" suffix)
  basePath: string;            // required, URL base path (e.g. "/api/v1/orders")
  actions: ControllerAction[]; // required, non-empty
  module?: string;             // defaults to "shared"
  description?: string;
  globalPermission?: PermissionRef;
  globalRoles?: string[];
  readOnly?: boolean;
  id?: string;
  version?: string;
}

interface ControllerAction {
  actionName: string;                              // required, camelCase method name
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'; // required
  path?: string;                                   // relative to basePath (e.g. "/{id}")
  description?: string;
  permission?: PermissionRef;
  roles?: string[];
  requestParams?: RequestParam[];
  pathVariables?: PathVariable[];
  headers?: HttpHeader[];
  multipartFiles?: MultipartFile[];
  modelAttribute?: ModelAttribute;
  requestBody?: Body;
  responses?: { [statusCode: string]: Body };
}

interface PermissionRef {
  items: string[];           // required, permission key strings
  operator?: 'AND' | 'OR';  // defaults to OR
}

interface RequestParam {
  type: string;        // required
  name: string;        // required
  value?: string;
  description?: string;
  isRequired: boolean; // required
}

interface PathVariable {
  type: string;        // required
  name: string;        // required
  isRequired: boolean; // required
}

interface HttpHeader {
  header: string;      // required
  value: string;       // required
  isRequired: boolean; // required
}

interface MultipartFile {
  type: string;
  name: string;
  isRequired: boolean;
}

interface ModelAttribute {
  name: string;    // required, DTO class name
  module?: string;
}

interface Body {
  id?: string;
  version?: string;
  name?: string;
  module?: string;
  description?: string;
  content: { [mimeType: string]: SchemaObject }; // required
}
```

## Output Paths

### Technical Style

| File | Path |
|---|---|
| Controller | `<mainPath>/controllers/<controllerName_lowercase>/<ControllerName>Controller.java` |
| Service Interface | `<mainPath>/services/I<ControllerName>Service.java` |
| Service Impl | `<mainPath>/services/<ControllerName>Service.java` |

### Domain Style

| File | Path |
|---|---|
| Controller | `<mainPath>/<module>/interfaces/rest/<ControllerName>Controller.java` |
| Per GET action — Query | `<mainPath>/<module>/application/queries/<ActionName>Query.java` |
| Per GET action — Query Handler | `<mainPath>/<module>/application/queries/<ActionName>QueryHandler.java` |
| Per GET action — Handler Test | `<testPath>/<module>/application/queries/<ActionName>QueryHandlerTest.java` |
| Per non-GET action — Command | `<mainPath>/<module>/application/commands/<ActionName>Command.java` |
| Per non-GET action — Command Handler | `<mainPath>/<module>/application/commands/<ActionName>CommandHandler.java` |
| Per non-GET action — Handler Test | `<testPath>/<module>/application/commands/<ActionName>CommandHandlerTest.java` |

## Controller Java Output

```java
/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME */

package <computed.package>;

<IMPORTS_BLOCK>

@IgrpController
@RestController
@RequestMapping(path = "<basePath>")
[@PreAuthorize("<GLOBAL_EXPRESSION>")]   ← when globalPermission or globalRoles set
@Tag(
    name = "<ControllerName>",
    description = "<description>")
public class <ControllerName>Controller {

    [Technical — service injection:]
    private final I<ControllerName>Service <lowerCamelName>Service;

    public <ControllerName>Controller(I<ControllerName>Service <lowerCamelName>Service) {
        this.<lowerCamelName>Service = <lowerCamelName>Service;
    }

    [Domain — bus injection:]
    [private final QueryBus queryBus;]     ← only if any GET actions
    [private final CommandBus commandBus;] ← only if any non-GET actions

    public <ControllerName>Controller([QueryBus queryBus,] [CommandBus commandBus]) {
        [this.queryBus = queryBus;]
        [this.commandBus = commandBus;]
    }

    [per action:]
    [@PreAuthorize("<ACTION_EXPRESSION>")]
    @<HttpMethod>Mapping([value = "<path>"])
    @Operation(summary = "<actionName>", operationId = "<actionName>")
    @ApiResponses(value = {
        <per response: @ApiResponse(responseCode = "<code>", description = "...")>
    })
    public ResponseEntity<<ResolvedResponseType>> <actionName>(<PARAMS>) {

        [Technical:]
        var response = <lowerCamelName>Service.<actionName>(<args>);
        return response;

        [Domain GET:]
        final var query = new <ActionName>Query(<args>);
        return queryBus.handle(query);

        [Domain non-GET:]
        final var command = new <ActionName>Command(<args>);
        return commandBus.send(command);
    }
}
```

## Permission Expression Resolution

```
PermissionRef { items: ["PERM_A", "PERM_B"], operator: "AND" }
  → @PreAuthorize("hasAuthority('PERM_A') and hasAuthority('PERM_B')")

PermissionRef { items: ["PERM_A", "PERM_B"], operator: "OR" }
  → @PreAuthorize("hasAuthority('PERM_A') or hasAuthority('PERM_B')")

roles: ["ADMIN", "MANAGER"]
  → @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")

Both permission and roles present → combine with " and "
```

## Response Type Resolution

```
resolveResponseType(responses):
  1. Find response with 2xx status code (prefer 200, then 201)
  2. Extract schema from content["application/json"]
  3. Resolve schema ref → Java type using same DTO type rules
  4. If ambiguous or no match → ResponseEntity<?>
```

## Method Parameter Order

Parameters appear in this fixed order:

1. `@PathVariable` params — one per `pathVariables` entry
2. `@RequestParam` params — one per `requestParams` entry
3. `@RequestHeader` params — one per `headers` entry
4. `@RequestBody` — from `requestBody.content["application/json"]`
5. `@ModelAttribute` — from `modelAttribute`
6. `@RequestPart` — one per `multipartFiles` entry
7. `Pageable pageable` — only for GET with `collectionType: 'pageable'` response

## Technical Service Output

```java
// Service Interface
@Service
public interface I<ControllerName>Service {
    ResponseEntity<<ReturnType>> <actionName>(<PARAMS>);
}

// Service Implementation
@Service
public class <ControllerName>Service implements I<ControllerName>Service {

    @Override
    public ResponseEntity<<ReturnType>> <actionName>(<PARAMS>) {
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
```

## Domain Handler Output

```java
// CommandHandler
@Component
public class <ActionName>CommandHandler implements CommandHandler<<ActionName>Command, ResponseEntity<?>> {

    @Override
    public ResponseEntity<?> handle(<ActionName>Command command) {
        throw new UnsupportedOperationException("Not implemented yet");
    }
}

// QueryHandler
@Component
public class <ActionName>QueryHandler implements QueryHandler<<ActionName>Query, ResponseEntity<?>> {

    @Override
    public ResponseEntity<?> handle(<ActionName>Query query) {
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
```

## Example

```json
{
  "type": "controller",
  "name": "Order",
  "basePath": "/api/v1/orders",
  "module": "orders",
  "description": "Order management endpoints",
  "globalPermission": {
    "items": ["ORDERS_ACCESS"],
    "operator": "OR"
  },
  "actions": [
    {
      "actionName": "findAll",
      "method": "GET",
      "requestParams": [
        { "type": "string", "name": "status", "isRequired": false }
      ],
      "responses": {
        "200": {
          "content": {
            "application/json": {
              "schema": { "type": "array", "items": { "$ref": "OrderDTO" } }
            }
          }
        }
      }
    },
    {
      "actionName": "create",
      "method": "POST",
      "permission": { "items": ["ORDERS_WRITE"] },
      "requestBody": {
        "content": {
          "application/json": {
            "schema": { "$ref": "CreateOrderDTO" }
          }
        }
      },
      "responses": {
        "201": {
          "content": {
            "application/json": {
              "schema": { "$ref": "OrderDTO" }
            }
          }
        }
      }
    },
    {
      "actionName": "findById",
      "method": "GET",
      "path": "/{id}",
      "pathVariables": [
        { "type": "long", "name": "id", "isRequired": true }
      ],
      "responses": {
        "200": {
          "content": {
            "application/json": {
              "schema": { "$ref": "OrderDTO" }
            }
          }
        }
      }
    }
  ]
}
```
