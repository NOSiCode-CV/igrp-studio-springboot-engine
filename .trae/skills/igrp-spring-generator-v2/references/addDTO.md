# addDTO

Generates a DTO class. The `type` field controls the class role and file suffix. The `template` field controls class vs record syntax.

## Schema

```typescript
interface DTOConfig {
  type: 'dto' | 'response' | 'filter' | 'command' | 'query' | 'event'; // required
  template: 'classic' | 'record';       // required
  name: string;                          // required, PascalCase
  attributes: JavaAttribute[];           // required
  module?: string;                       // defaults to "shared"
  enableCustonValidation?: boolean;      // generates a custom validator interface
  readOnly?: boolean;                    // do not overwrite existing files on regeneration
  extends?: { name: string; module: string }; // parent DTO for inheritance (classic only)
  id?: string;
  version?: string;
}

interface JavaAttribute {
  name: string;        // required, camelCase field name
  type: string;        // required — engine type OR Java class name when objectType='java'
  objectType: 'java' | 'dto' | 'model' | 'enum'; // required
  required: boolean;   // required — drives @NotNull / @NotBlank
  collectionType?: 'list' | 'set' | 'collection' | 'pageable' | 'map' | 'none';
  isEmail?: boolean;   // adds @Email
  isUrl?: boolean;     // adds @URL
  before?: boolean;    // adds @Past
  after?: boolean;     // adds @Future
  positive?: boolean;  // adds @Positive
  minLength?: number;  // adds @Size(min=...)
  maxLength?: number;  // adds @Size(max=...)
  regex?: string;      // adds @Pattern(regexp="...")
  primaryKey?: boolean;
  jsonAttributeName?: string;  // adds @JsonProperty("...")
  xmlAttributeName?: string;   // adds @JacksonXmlProperty(localName="...")
  module?: string;     // module of the referenced dto / model / enum
}
```

## Type → Class Suffix Mapping

| `type` value | Class suffix | Manifest filename |
|---|---|---|
| `dto` | `DTO` | `<Name>DTO.json` |
| `response` | `DTO` | `<Name>DTO.json` |
| `filter` | `DTO` | `<Name>DTO.json` |
| `command` | `Command` | `<Name>Command.json` |
| `query` | `Query` | `<Name>Query.json` |
| `event` | `Event` | `<Name>Event.json` |

**Name normalization before saving manifest:** strip trailing `DTO` / `Command` / `Query` / `Event` (case-insensitive) from the input name, then append the suffix.

## Output Paths

### Technical Style

All DTO types output to: `<mainPath>/dto/<NormalizedName><Suffix>.java`

### Domain Style

| `type` | Java Path |
|---|---|
| `dto`, `response`, `filter` | `<mainPath>/<module>/application/dto/<Name>DTO.java` |
| `command` | `<mainPath>/<module>/application/commands/<Name>Command.java` |
| `query` | `<mainPath>/<module>/application/queries/<Name>Query.java` |
| `event` | `<mainPath>/<module>/application/events/<Name>Event.java` |

## Java Output

### Classic Template

```java
/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME */

package <computed.package>;

import cv.igrp.framework.stereotype.IgrpDTO;
import jakarta.validation.*;
import jakarta.validation.constraints.*;
[import lombok.EqualsAndHashCode;]         ← only when extends is set
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
[import <group>.<packageName>.dto.validator.<NameValidator>;] ← when enableCustonValidation
<resolved-imports-sorted>

@Data
@NoArgsConstructor
@AllArgsConstructor
[@EqualsAndHashCode(callSuper = true)]     ← only when extends is set
[@<NameValidator>]                         ← when enableCustonValidation
@IgrpDTO
public class <Name><Suffix> [extends <ParentName>DTO] {

    [per attribute:]
    [<validation-annotations>]
    private <JavaType> <fieldName>[<collectionInitializer>];

}
```

### Record Template

```java
/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME */

package <computed.package>;

import cv.igrp.framework.stereotype.IgrpDTO;
import jakarta.validation.*;
import jakarta.validation.constraints.*;
<resolved-imports-sorted>

@IgrpDTO
public record <Name><Suffix>(
    [per attribute:]
    [<validation-annotations>]
    <JavaType> <fieldName>[,]    ← comma after all except last
) {}
```

## Helper Algorithms

### Type Resolution

```
resolveType(attribute):

  base:
    if objectType = 'dto':
      strip trailing 'DTO' from attribute.name → base + 'DTO'
    if objectType = 'model':
      use attribute.name as-is
    if objectType = 'enum':
      use attribute.objectType (the enum class name)
    if objectType = 'java':
      map engine type → Java type (see table below)

  wrap by collectionType:
    'list'       → List<base>         initializer: = new ArrayList<>()
    'set'        → Set<base>          initializer: = new HashSet<>()
    'collection' → Collection<base>
    'pageable'   → Page<base>
    'map'        → Map<String, base>
    'none' / missing → base
```

### Engine Type → Java Type (for `objectType: 'java'`)

| Engine type | Java type |
|---|---|
| `string` | `String` |
| `integer` | `Integer` |
| `long` | `Long` |
| `double` | `Double` |
| `float` | `Float` |
| `boolean` | `Boolean` |
| `date` | `LocalDate` |
| `datetime` | `LocalDateTime` |
| `time` | `LocalTime` |

### Validation Annotation Resolution (applied in this order)

```
1. @JsonProperty("<jsonAttributeName>")                              ← if jsonAttributeName set
2. @JacksonXmlProperty(localName = "<xmlAttributeName>")            ← if xmlAttributeName set
3. if required:
     string / text            → @NotBlank
     list / set / collection  → @NotNull + @NotEmpty
     other types              → @NotNull
4. if minLength or maxLength  → @Size(min=<n>, max=<n>)
5. if regex (non-empty string) → @Pattern(regexp = "<regex>")
6. if isEmail                 → @Email
7. if isUrl                   → @URL
8. if before                  → @Past
9. if after                   → @Future
10. if positive               → @Positive
```

### Import Resolution

Build a **sorted** set of imports:

- Always: `cv.igrp.framework.stereotype.IgrpDTO`, `jakarta.validation.*`, `jakarta.validation.constraints.*`
- Classic: `lombok.Data`, `lombok.NoArgsConstructor`, `lombok.AllArgsConstructor`
- If `extends`: `lombok.EqualsAndHashCode`; import parent DTO from its module if cross-module
- If `jsonAttributeName`: `com.fasterxml.jackson.annotation.JsonProperty`
- If `xmlAttributeName`: `com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty`
- If `collectionType=list`: `java.util.List`, `java.util.ArrayList`
- If `collectionType=set`: `java.util.Set`, `java.util.HashSet`
- If `collectionType=collection`: `java.util.Collection`
- If `collectionType=pageable`: `org.springframework.data.domain.Page`
- If `collectionType=map`: `java.util.Map`
- If `type=date`: `java.time.LocalDate`
- If `type=datetime`: `java.time.LocalDateTime`
- If `type=time`: `java.time.LocalTime`

## Examples

**Classic DTO:**
```json
{
  "type": "dto",
  "template": "classic",
  "name": "CreateOrder",
  "module": "orders",
  "attributes": [
    { "name": "customerId", "type": "long", "objectType": "java", "required": true },
    { "name": "deliveryDate", "type": "date", "objectType": "java", "required": false, "after": true },
    { "name": "items", "type": "string", "objectType": "java", "required": true, "collectionType": "list" }
  ]
}
```

**Record Command (domain style):**
```json
{
  "type": "command",
  "template": "record",
  "name": "CreateOrder",
  "module": "orders",
  "attributes": [
    { "name": "customerId", "type": "long", "objectType": "java", "required": true },
    { "name": "deliveryDate", "type": "date", "objectType": "java", "required": false }
  ]
}
```

Manifest: `.igrpstudio/orders/dto/CreateOrderCommand.json`
Java: `<mainPath>/orders/application/commands/CreateOrderCommand.java`

**DTO with inheritance:**
```json
{
  "type": "dto",
  "template": "classic",
  "name": "UpdateOrder",
  "module": "orders",
  "extends": { "name": "CreateOrder", "module": "orders" },
  "attributes": [
    { "name": "id", "type": "long", "objectType": "java", "required": true }
  ]
}
```
