# addEnum

Produces a Java enum implementing `IgrpEnum<String>` and a manifest. The enum includes built-in static lookup methods.

## Manifest written to

`.igrpstudio/<module>/enum/<Name>.json`

## Manifest fields

### Top-level

| Field | Required | Rules |
|---|---|---|
| `type` | Yes | Must be exactly `enum` |
| `name` | Yes | PascalCase. Pattern: `^[A-Za-z][A-Za-z0-9_]*$` |
| `values` | Yes | Array of enum value objects. Cannot be empty |
| `module` | No | Default: `shared`. Pattern: `^[a-zA-Z0-9_]+$` |
| `attributes` | No | Array of constructor field objects (shared across all constants) |
| `readOnly` | No | Boolean — prevents overwriting |
| `id` | No | String |
| `version` | No | String |

No other fields are permitted.

### Enum value object

| Field | Required | Rules |
|---|---|---|
| `name` | Yes | Pattern: `^[A-Za-z][A-Za-z0-9_]*$` — uppercased in the generated class |
| `attributes` | No | Array of strings — one argument per constructor field, in order |

### Constructor field object (`attributes[]` at top level)

| Field | Required | Rules |
|---|---|---|
| `name` | Yes | Field name — lowercased in the generated class |
| `type` | Yes | Engine type or Java type string |

> **How `attributes` and `values[].attributes` relate:**
> Top-level `attributes` defines the constructor signature (field names and types).
> Each `values[].attributes` provides the argument values for that constant, in the same order.

## Output paths

| Style | Java path |
|---|---|
| Technical | `<mainPath>/enum/<Name>.java` |
| Domain | `<mainPath>/<module>/application/enum/<Name>.java` |

## Java output

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
[technical:] import <group>.<packageName>.exceptions.IgrpResponseStatusException;
[domain:]    import <group>.<packageName>.shared.domain.exceptions.IgrpResponseStatusException;

public enum <Name> implements IgrpEnum<String> {

    CONSTANT_ONE[("arg1", "arg2")],
    CONSTANT_N[("arg1", "arg2")];       ← semicolon after the last constant

    [when top-level attributes defined:]
    private final <JavaType> <lowerFieldName>;

    <Name>(<JavaType> <lowerFieldName>[, ...]) {
        this.<lowerFieldName> = <lowerFieldName>;
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
    private static final Map<String, <Name>> CODE_MAP = Arrays.stream(values())
            .collect(Collectors.toMap(<Name>::getCode, Function.identity()));

    /**
    * Attempts to find the enum value associated with the given code.
    * @param code The code to look up
    * @return An Optional containing the enum value if found, empty Optional otherwise
    */
    public static Optional<<Name>> fromCode(String code) {
        return Optional.ofNullable(CODE_MAP.get(code));
    }

    /**
    * Finds the enum value associated with the given code or throws an exception if not found.
    * @param code The code to look up
    * @return The enum value for the given code
    * @throws IgrpResponseStatusException if no enum value exists for the given code
    */
    public static <Name> fromCodeOrThrow(String code) {
        return fromCode(code).orElseThrow(
                () -> IgrpResponseStatusException.of(HttpStatus.BAD_REQUEST, "Invalid <Name> for this code: " + code));
    }

    /**
    * Returns a map of code to description.
    */
    public static Map<String, String> codeDescriptionMap() {
        return CODE_MAP.values().stream().collect(Collectors.toMap(<Name>::getCode, <Name>::getDescription));
    }

}
```

> Constant names are uppercased. The semicolon `;` follows the last constant on its line.
