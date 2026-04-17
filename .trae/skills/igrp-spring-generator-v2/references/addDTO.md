# addDTO

Produces a DTO class and a manifest. The `type` field controls the class role and file suffix. The `template` field controls class vs record syntax.

## Manifest written to

| `type` value | Manifest path |
|---|---|
| `dto` · `response` · `filter` | `.igrpstudio/<module>/dto/<Name>DTO.json` |
| `command` | `.igrpstudio/<module>/dto/<Name>Command.json` |
| `query` | `.igrpstudio/<module>/dto/<Name>Query.json` |
| `event` | `.igrpstudio/<module>/dto/<Name>Event.json` |

Name normalization before saving: strip any trailing `DTO` / `Command` / `Query` / `Event` (case-insensitive) from the input name, then append the correct suffix.

## Manifest fields

### Top-level

| Field | Required | Rules |
|---|---|---|
| `type` | Yes | One of: `dto` · `command` · `query` · `event` · `filter` · `response` |
| `template` | Yes | One of: `classic` · `record` |
| `name` | Yes | PascalCase. Pattern: `^[A-Za-z][A-Za-z0-9_]*$` |
| `attributes` | Yes | Array of attribute objects. Cannot be empty |
| `module` | No | Default: `shared`. Pattern: `^[A-Za-z][A-Za-z0-9_]*$` |
| `enableCustonValidation` | No | Boolean — generates a custom validator interface |
| `readOnly` | No | Boolean — prevents overwriting |
| `extends` | No | Object with `name` (required) and `module` (required) |
| `id` | No | String |
| `version` | No | String |

No other fields are permitted.

### Attribute object

| Field | Required | Rules |
|---|---|---|
| `name` | Yes | camelCase. Pattern: `^[A-Za-z][A-Za-z0-9_]*$` |
| `type` | Yes | One of the attribute types listed below |
| `objectType` | Yes | One of: `java` · `dto` · `model` · `enum` |
| `required` | Yes | Boolean — drives `@NotNull` / `@NotBlank` |
| `collectionType` | No | One of: `none` · `list` · `set` · `collection` · `pageable` · `map` |
| `isEmail` | No | Boolean — adds `@Email`. **Only valid when `type` is `string`** |
| `isUrl` | No | Boolean — adds `@URL`. **Only valid when `type` is `string`** |
| `before` | No | Boolean — adds `@Past`. **Only valid when `type` is `datetime`** |
| `after` | No | Boolean — adds `@Future`. **Only valid when `type` is `datetime`** |
| `positive` | No | Boolean — adds `@Positive`. **Only valid for numeric types** |
| `minLength` | No | Number — adds `@Size(min=...)`. **Only valid when `type` is `string`** |
| `maxLength` | No | Number — adds `@Size(max=...)`. **Only valid when `type` is `string`** |
| `regex` | No | String — adds `@Pattern(regexp="...")`. Only for `string` |
| `primaryKey` | No | Boolean |
| `jsonAttributeName` | No | String — adds `@JsonProperty("...")`. Pattern: `^[a-zA-Z0-9_]+$` |
| `xmlAttributeName` | No | String — adds `@JacksonXmlProperty(localName="...")`. Pattern: `^[a-zA-Z0-9_]+$` |
| `module` | No | Module of the referenced dto / model / enum. Pattern: `^[A-Za-z][A-Za-z0-9_]*$` |

### Validation constraints — must be enforced

| Constraint | Rule |
|---|---|
| `isEmail` and `isUrl` | Cannot both be `true` on the same attribute |
| `before` and `after` | Cannot both be `true` on the same attribute |
| `isEmail` / `isUrl` | Only allowed when `type` is `string` |
| `before` / `after` | Only allowed when `type` is `datetime` |
| `positive` | Only allowed for numeric types: `integer` · `long` · `short` · `float` · `double` · `decimal` · `biginteger` |
| `minLength` / `maxLength` | Only allowed when `type` is `string` |

### Attribute types (accepted values for `type`)

All types from the model attribute list are accepted here, except `relation`:

`boolean` · `integer` · `long` · `short` · `float` · `double` · `string` · `char` · `uuid` · `decimal` · `biginteger` · `date` · `datetime` · `time` · `instant` · `uri` · `url` · `text` · `json` · `binary` · `file` · `object`

See `addModel.md` for the Java type mapping of each type.

## Output paths

### Technical style

All DTO types → `<mainPath>/dto/<Name><Suffix>.java`

### Domain style

| `type` | Java path |
|---|---|
| `dto` · `response` · `filter` | `<mainPath>/<module>/application/dto/<Name>DTO.java` |
| `command` | `<mainPath>/<module>/application/commands/<Name>Command.java` |
| `query` | `<mainPath>/<module>/application/queries/<Name>Query.java` |
| `event` | `<mainPath>/<module>/application/events/<Name>Event.java` |

## Type resolution rules

```
objectType = 'java'   → map type to Java type (see addModel.md type table)
objectType = 'dto'    → strip trailing 'DTO' from attribute name, append 'DTO'
objectType = 'model'  → use attribute name as-is
objectType = 'enum'   → use the enum class name from context

collectionType wrapping:
  list       → List<Base>        initializer: = new ArrayList<>()
  set        → Set<Base>         initializer: = new HashSet<>()
  collection → Collection<Base>
  pageable   → Page<Base>
  map        → Map<String, Base>
  none / omitted → Base
```

## Validation annotation resolution (applied in this order per attribute)

```
1. @JsonProperty("<jsonAttributeName>")             if jsonAttributeName is set
2. @JacksonXmlProperty(localName="<xmlAttr>")       if xmlAttributeName is set
3. if required=true:
     string / text            → @NotBlank
     list / set / collection  → @NotNull + @NotEmpty
     all other types          → @NotNull
4. @Size(min=<n>, max=<n>)    if minLength or maxLength is set
5. @Pattern(regexp="<regex>") if regex is non-empty
6. @Email                     if isEmail=true
7. @URL                       if isUrl=true
8. @Past                      if before=true
9. @Future                    if after=true
10. @Positive                 if positive=true
```

## Java output — classic template

```java
/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME */

package <computed.package>;

import cv.igrp.framework.stereotype.IgrpDTO;
import jakarta.validation.*;
import jakarta.validation.constraints.*;
[import lombok.EqualsAndHashCode;]                       ← only when extends is set
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
[import <group>.<pkg>.dto.validator.<NameValidator>;]    ← when enableCustonValidation
<sorted imports for types used>

@Data
@NoArgsConstructor
@AllArgsConstructor
[@EqualsAndHashCode(callSuper = true)]    ← only when extends is set
[@<NameValidator>]                        ← when enableCustonValidation
@IgrpDTO
public class <Name><Suffix> [extends <ParentName>DTO] {

    [per attribute — validation annotations first, then field declaration]
    private <JavaType> <fieldName>[<collectionInitializer>];

}
```

## Java output — record template

```java
/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME */

package <computed.package>;

import cv.igrp.framework.stereotype.IgrpDTO;
import jakarta.validation.*;
import jakarta.validation.constraints.*;
<sorted imports for types used>

@IgrpDTO
public record <Name><Suffix>(
    [per attribute — validation annotations, then type and name]
    <JavaType> <fieldName>[,]    ← comma after every parameter except the last
) {}
```
