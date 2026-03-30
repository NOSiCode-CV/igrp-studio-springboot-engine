## Template System Reference

Templates live in `public/templates/` and are rendered by `src/modules/common/renderTemplate.ts` using Handlebars.

---

### Template File Structure (mandatory)

Every template **must** start with the 2-line generated-file comment:

```handlebars
/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME */

package {{resolvePackage fullPath basePath}};
```

The `{{resolvePackage fullPath basePath}}` helper derives the Java `package` statement from the output path by:
1. Converting paths to forward slashes
2. Removing the `basePath/` prefix
3. Dropping `src`, `main`/`test`, `java` segments
4. Joining remaining segments with `.`

---

### Available Context Variables

```handlebars
{{! ── Project-level (baseConfig) ── }}
{{baseConfig.group}}               → "com.example"
{{baseConfig.packageName}}         → "myapp"
{{baseConfig.projectStructureStyle}} → "technical" | "domain"
{{baseConfig.database}}            → "MySQL" | "Oracle" | "Postgresql"
{{baseConfig.name}}                → "my_api"

{{! ── Element-specific (resourceConfig) ── }}
{{resourceConfig.name}}            → "UserEntity"
{{resourceConfig.module}}          → "users"
{{resourceConfig.type}}            → "model" | "dto" | "controller" | ...
{{resourceConfig.attributes}}      → array

{{! ── Computed paths ── }}
{{fullPath}}                       → "src/main/java/com/example/myapp"
{{basePath}}                       → absolute path to project root
```

---

### Available Helpers

#### String helpers (`src/helper/stringHelper.ts`)

| Helper | Input | Output | Notes |
|--------|-------|--------|-------|
| `capitalize` | `user_entity` | `UserEntity` | PascalCase conversion |
| `capitalizeJavaStyle` | `userEntity` | `UserEntity` | First-letter only |
| `camelCase` | `UserEntity` | `userEntity` | lowerCamelCase |
| `pluralize` | `User` | `Users` | Pluralization |
| `singularize` | `Users` | `User` | Singularization |
| `toLowerCase` | `UserEntity` | `userentity` | All lowercase |
| `toUpperCase` | `user` | `USER` | All uppercase |
| `resolvePackage` | `fullPath, basePath` | `com.example.myapp.models.user` | Package statement |

#### Logic helpers (`src/helper/logicalHelper.ts`)

| Helper | Usage | Description |
|--------|-------|-------------|
| `isPageable` | `{{#if (isPageable responses)}}` | True if any response uses collection type `pageable` |
| `eq` | `{{#if (eq type "string")}}` | Equality |
| `not` | `{{#if (not nullable)}}` | Logical not |
| `and` | `{{#if (and a b)}}` | Logical and |
| `or` | `{{#if (or a b)}}` | Logical or |
| `includes` | `{{#if (includes list item)}}` | Array membership check |

#### Type helpers

| Helper | Usage | Description |
|--------|-------|-------------|
| `resolveJavaType` | `{{resolveJavaType type objectType}}` | Maps engine types to Java types |
| `javaImport` | `{{javaImport type module baseConfig}}` | Produces import statement |
| `collectionWrapper` | `{{collectionWrapper baseType collectionType}}` | `List<T>`, `Set<T>`, etc. |

---

### Conditionals and Loops

```handlebars
{{! If/else }}
{{#if resourceConfig.audit}}
  extends AuditEntity
{{/if}}

{{#if (eq resourceConfig.adviceType "around")}}
  Object execute(ProceedingJoinPoint joinPoint)
{{else}}
  void execute()
{{/if}}

{{! Loop over array }}
{{#each resourceConfig.attributes}}
  private {{resolveJavaType this.type this.objectType}} {{camelCase this.name}};
{{/each}}

{{! Loop with index }}
{{#each resourceConfig.attributes}}
  {{! @index is the 0-based index }}
  {{! @first is true for the first item }}
  {{! @last is true for the last item }}
  {{this.name}}{{#unless @last}}, {{/unless}}
{{/each}}
```

---

### Partials

Partials are stored in `public/templates/partials/` and are auto-loaded by `renderTemplate`. Use them for reusable blocks:

```handlebars
{{! Use a partial }}
{{> imports}}
{{> constructor}}
{{> annotation-block}}
```

To create a new partial:
1. Create `public/templates/partials/my-partial.hbs`
2. Use it anywhere: `{{> my-partial}}`

No registration needed — all `.hbs` files in the partials directory are loaded automatically.

---

### Java Type Resolution

The engine maps its attribute types to Java types as follows:

| Engine type | `objectType` | Java type |
|------------|-------------|-----------|
| `string` | `java` | `String` |
| `integer` | `java` | `Integer` |
| `long` | `java` | `Long` |
| `double` | `java` | `Double` |
| `float` | `java` | `Float` |
| `boolean` | `java` | `Boolean` |
| `date` | `java` | `LocalDate` |
| `datetime` | `java` | `LocalDateTime` |
| `time` | `java` | `LocalTime` |
| `file` | `java` | `byte[]` |
| `binary` | `java` | `byte[]` |
| `<Name>` | `dto` | `<Name>DTO` |
| `<Name>` | `model` | `<Name>` (entity class) |
| `<Name>` | `enum` | `<Name>` (enum class) |

Collection wrapping (from `collectionType`):
- `list` → `List<T>`
- `set` → `Set<T>`
- `collection` → `Collection<T>`
- `pageable` → `Page<T>`
- `map` → `Map<T, ?>`
- _(none)_ → `T`

---

### Import Block Pattern

Imports in generated Java files are ordered:
1. Framework imports (`cv.igrp.framework.*`)
2. Spring imports (`org.springframework.*`)
3. Jakarta imports (`jakarta.*`)
4. Swagger imports (`io.swagger.*`)
5. Third-party imports (alphabetical)
6. Java stdlib imports (`java.*`)
7. Project-local imports (same package or subpackage)

In templates, the import block is assembled conditionally:

```handlebars
import cv.igrp.framework.stereotype.IgrpEntity;
{{#if resourceConfig.audit}}
import {{baseConfig.group}}.{{baseConfig.packageName}}.config.AuditEntity;
{{/if}}
import jakarta.persistence.*;
{{#if hasRelations}}
import java.util.List;
import java.util.ArrayList;
{{/if}}
```

---

### Formatting Rules

- **Indentation:** 2 spaces (matching the existing templates)
- **Blank lines:** one blank line between class members; no trailing blank line inside class body
- **Braces:** opening brace on the same line (`public class Foo {`)
- **Annotations:** one annotation per line, directly above the declaration

```handlebars
  @NotNull(message = "{{camelCase this.name}} is mandatory")
  @Column(name = "{{toLowerCase this.name}}", nullable = false)
  private {{resolveJavaType this.type this.objectType}} {{camelCase this.name}};
```

---

### Debugging Templates

To debug a template during development:
1. Set `setEngineConfiguration({ environment: 'development' })`
2. Run the relevant test: `npm test -- --testPathPattern=addMyFeature`
3. Inspect the generated file in the test output directory
4. Compare against an existing reference file from `demoDomain/` or `demoTechnical/`
