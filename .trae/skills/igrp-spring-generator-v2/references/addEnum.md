# addEnum

Generates a Java enum implementing `IgrpEnum<String>`. Provides built-in static lookup via `fromCode()`, `fromCodeOrThrow()`, and `codeDescriptionMap()`.

## Schema

```typescript
interface EnumConfig {
  name: string;           // required, PascalCase
  values: EnumValue[];    // required, non-empty
  module?: string;        // defaults to "shared"
  attributes?: EnumAttribute[]; // constructor fields shared across all constants
  type?: 'enum';          // optional — if present, must equal "enum"
  readOnly?: boolean;     // do not overwrite existing files on regeneration
  id?: string;
  version?: string;
}

interface EnumValue {
  name: string;           // required — becomes UPPER_CASE constant
  attributes?: string[];  // constructor argument values for this constant
}

interface EnumAttribute {
  name: string;  // required — field name (lowercase in constructor)
  type: string;  // required — engine type or Java type
}
```

> **`attributes` vs `values[].attributes`:**
> - `EnumConfig.attributes` defines the **constructor signature** (field names and types)
> - `EnumValue.attributes` provides the **argument values** per constant

## Manifest Output

Written to: `.igrpstudio/<module>/enum/<EnumName>.json`

## Java Output Path

| Style | Path |
|---|---|
| Technical | `<mainPath>/enum/<EnumName>.java` |
| Domain | `<mainPath>/<module>/application/enum/<EnumName>.java` |

## Java Output

```java
/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME */

package <computed.package>;

import cv.igrp.framework.core.domain.IgrpEnum;
import java.util.Arrays;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
[Technical:] import <group>.<packageName>.exceptions.IgrpResponseStatusException;
[Domain:]    import <group>.<packageName>.shared.domain.exceptions.IgrpResponseStatusException;

public enum <EnumName> implements IgrpEnum<String> {

    <CONSTANT_1>[(<arg1>, <arg2>)],
    <CONSTANT_N>[(<arg1>, <arg2>)];    ← semicolon after last constant

    [when attributes defined:]
    private final <JavaType1> <lowerName1>;
    [private final <JavaType2> <lowerName2>;]

    <EnumName>(<JavaType1> <lowerName1>[, <JavaType2> <lowerName2>]) {
        this.<lowerName1> = <lowerName1>;
        [this.<lowerName2> = <lowerName2>;]
    }

    @Override
    public String getCode() {
        return code;
    }

    @Override
    public String getDescription() {
        return description;
    }

    /**
    * Pre-built maps for fast lookup.
    */
    private static final Map<String, <EnumName>> CODE_MAP = Arrays.stream(values())
            .collect(Collectors.toMap(<EnumName>::getCode, Function.identity()));

    /**
    * Attempts to find the enum value associated with the given code.
    * @param code The code to look up
    * @return An Optional containing the enum value if found, empty Optional otherwise
    */
    public static Optional<<EnumName>> fromCode(String code) {
        return Optional.ofNullable(CODE_MAP.get(code));
    }

    /**
    * Finds the enum value associated with the given code or throws an exception if not found.
    * @param code The code to look up
    * @return The enum value for the given code
    * @throws IgrpResponseStatusException if no enum value exists for the given code
    */
    public static <EnumName> fromCodeOrThrow(String code) {
        return fromCode(code).orElseThrow(
                () -> IgrpResponseStatusException.of(HttpStatus.BAD_REQUEST, "Invalid <EnumName> for this code: " + code));
    }

    /**
    * Returns a map of code to description.
    */
    public static Map<String, String> codeDescriptionMap() {
        return CODE_MAP.values().stream().collect(Collectors.toMap(<EnumName>::getCode, <EnumName>::getDescription));
    }

}
```

> Constant names are uppercased via `toUpperCase()`. The semicolon `;` follows the last constant.

## Examples

**Simple enum (no constructor params):**
```json
{
  "type": "enum",
  "name": "OrderStatus",
  "module": "orders",
  "values": [
    { "name": "PENDING" },
    { "name": "CONFIRMED" },
    { "name": "SHIPPED" },
    { "name": "DELIVERED" },
    { "name": "CANCELLED" }
  ]
}
```

**Enum with constructor attributes (code + description pattern):**
```json
{
  "type": "enum",
  "name": "PaymentMethod",
  "module": "orders",
  "attributes": [
    { "name": "code", "type": "string" },
    { "name": "description", "type": "string" }
  ],
  "values": [
    { "name": "CREDIT_CARD", "attributes": ["CC", "Credit Card"] },
    { "name": "BANK_TRANSFER", "attributes": ["BT", "Bank Transfer"] },
    { "name": "CASH", "attributes": ["CA", "Cash"] }
  ]
}
```

Generated constants:
```java
CREDIT_CARD("CC", "Credit Card"),
BANK_TRANSFER("BT", "Bank Transfer"),
CASH("CA", "Cash");
```
