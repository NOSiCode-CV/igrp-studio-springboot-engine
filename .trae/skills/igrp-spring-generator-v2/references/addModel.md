# addModel

Generates a JPA entity class and repository. In domain style also generates a repository implementation and entity repository adapter.

## Schema

```typescript
interface ModelConfig {
  type: 'model';                         // required, literal
  name: string;                          // required, PascalCase entity name
  tableName: string;                     // required, database table name
  attributes: Attribute[];               // required
  module?: string;                       // defaults to "shared"
  primaryKey?: PrimaryKey[];             // composite primary key definition
  uniqueConstraints?: UniqueConstraint[];
  indexes?: EntityIndex[];
  relationReference?: RelationReference[]; // inverse side of JPA relations
  audit?: boolean;     // true = class extends AuditEntity (createdAt, updatedAt, createdBy, lastModifiedBy)
  revision?: boolean;  // true = adds @Audited (Hibernate Envers) to the class
  crud?: boolean;      // true = auto-generate CRUD controller + service for this entity
  readOnly?: boolean;  // true = do not overwrite existing files on regeneration
  id?: string;
  version?: string;
}

interface Attribute {
  type: 'string' | 'text' | 'integer' | 'long' | 'double' | 'float'
      | 'boolean' | 'date' | 'datetime' | 'time' | 'file' | 'relation' | 'enum'; // required
  name: string;           // required
  length?: number;
  nullable?: boolean;
  unique?: boolean;
  primaryKey?: boolean;
  generationType?: 'AUTO' | 'IDENTITY' | 'SEQUENCE' | 'TABLE' | 'NONE';
  sequenceName?: string;  // required when generationType = 'SEQUENCE'
  defaultValue?: string;
  objectType?: string;    // enum class name when type = 'enum'
  module?: string;        // module of the enum when type = 'enum'
  relation?: Relation;    // required when type = 'relation'
  skipFieldRevision?: boolean; // adds @NotAudited (Envers)
}

interface Relation {
  type: 'OneToOne' | 'OneToMany' | 'ManyToOne' | 'ManyToMany'; // required
  entity: string;         // required, target entity class name
  fetchType?: 'LAZY' | 'EAGER';
  cascadeType?: Array<'ALL' | 'PERSIST' | 'MERGE' | 'REMOVE' | 'REFRESH' | 'DETACH'>;
  orphanRemoval?: boolean;
  fieldName?: string;
  mappedBy?: string;
  referencedColumnName?: string;
  cardinality?: string;
  joinTable?: string;
  inverseJoinColumn?: string;
  joinColumn?: string;
  module?: string;
}

interface RelationReference {
  type: 'OneToOne' | 'OneToMany' | 'ManyToMany'; // required — inverse side
  entity: string;         // required
  module?: string;
  fieldName?: string;
  joinColumn?: string;
  mappedBy?: string;
  fetchType?: 'LAZY' | 'EAGER';
  cascadeType?: string[];
  orphanRemoval?: boolean;
}

interface PrimaryKey {
  type: string;  // required
  name: string;  // required
  length?: number;
  defaultValue?: string;
}

interface UniqueConstraint {
  name: string;      // required
  columns: string[]; // required
}

interface EntityIndex {
  name: string;      // required
  columns: string[]; // required
  unique: boolean;   // required
}
```

## Output Paths

### Technical Style

| File | Path |
|---|---|
| Entity | `<mainPath>/models/<modelName_lowercase>/<ModelName>.java` |
| Repository | `<mainPath>/models/<modelName_lowercase>/<ModelName>Repository.java` |

### Domain Style

| File | Path |
|---|---|
| Entity | `<mainPath>/<module>/infrastructure/persistence/entity/<ModelName>.java` |
| Domain Repository Interface | `<mainPath>/<module>/domain/repository/<ModelName>Repository.java` |
| Repository Impl | `<mainPath>/<module>/infrastructure/persistence/repository/<ModelName>RepositoryImpl.java` |
| Entity Repository Adapter | `<mainPath>/<module>/infrastructure/persistence/repository/<ModelName>EntityRepository.java` |

## Entity Java Output

### Class Declaration

```java
/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME */

package <computed.package>;

// imports...

[@Audited]   ← only when revision=true
@Getter
@Setter
@IgrpEntity
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(
    name = "<tableName>"
    [, uniqueConstraints = {
        @UniqueConstraint(name = "<uc.name>", columnNames = {<uc.columns>})
    }]
    [, indexes = {
        @Index(name = "<idx.name>", columnList = "<idx.columns>", unique = <idx.unique>)
    }]
)
public class <ModelName> [extends AuditEntity] {
```

> Add `extends AuditEntity` when `audit: true`. Add `@Audited` before `@Getter` when `revision: true`.

### Composite Primary Key

```java
@EmbeddedId
private <ModelName>PrimaryKey id;
```

Used when `primaryKey[]` array is defined.

### Attribute Patterns

**A) Primary key — IDENTITY / AUTO / TABLE:**
```java
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
@Column(name = "<name>", unique = true, nullable = false)
private <JavaType> <fieldName>;
```

**B) Primary key — SEQUENCE:**
```java
@Id
@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "<sequenceName>")
@SequenceGenerator(name = "<sequenceName>", sequenceName = "<sequenceName>", allocationSize = 1)
@Column(name = "<name>", unique = true, nullable = false)
private <JavaType> <fieldName>;
```

**C) Regular column:**
```java
[@NotBlank]   ← string, nullable=false
[@NotNull]    ← other types, nullable=false
[@Enumerated(EnumType.STRING)]  ← when type='enum'
@Column(name = "<name>"[, length = <n>][, unique = true][, nullable = false])
private <JavaType> <fieldName>;
```

**D) Text column (`type: 'text'`):**
```java
@Lob
@Column(name = "<name>", columnDefinition = "TEXT")
private String <fieldName>;
```

**E) File column (`type: 'file'`):**
```java
@Lob
@JdbcType(BinaryJdbcType.class)
@Column(columnDefinition = "BLOB")
private byte[] <fieldName>;
```

**F) ManyToOne relation:**
```java
[@NotNull]   ← when nullable=false
@ManyToOne(fetch = FetchType.<LAZY|EAGER>[, cascade = { CascadeType.X }])
@JoinColumn(name = "<joinColumn>")
private <Entity> <fieldName>;
```

**G) OneToMany relation:**
```java
@OneToMany(mappedBy = "<mappedBy>"[, cascade = { CascadeType.X }][, orphanRemoval = true])
private List<<Entity>> <fieldName> = new ArrayList<>();
```

**H) ManyToMany relation (owning side):**
```java
@ManyToMany([cascade = { CascadeType.X }])
@JoinTable(
    name = "<joinTable>",
    joinColumns = @JoinColumn(name = "<joinColumn>"),
    inverseJoinColumns = @JoinColumn(name = "<inverseJoinColumn>")
)
private Set<<Entity>> <fieldName> = new HashSet<>();
```

**I) OneToOne relation:**
```java
@OneToOne(fetch = FetchType.<LAZY|EAGER>)
@JoinColumn(name = "<joinColumn>")
private <Entity> <fieldName>;
```

### RelationReference Patterns (Inverse Side)

```java
// OneToOne inverse
@OneToOne(mappedBy = "<mappedBy>")
private <Entity> <fieldName>;

// ManyToOne inverse → OneToMany
@OneToMany(mappedBy = "<mappedBy>")
private List<<Entity>> <fieldName> = new ArrayList<>();

// ManyToMany inverse
@ManyToMany(mappedBy = "<mappedBy>")
private Set<<Entity>> <fieldName> = new HashSet<>();
```

## Repository Java Output

### Technical Style

```java
/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME */

package <computed.package>;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface <ModelName>Repository extends JpaRepository<<ModelName>, <PrimaryKeyType>> {}
```

### Domain Style

**Domain Repository Interface** (pure domain contract):
```java
public interface <ModelName>Repository {
    // Add business-oriented methods here manually
}
```

**Entity Repository Adapter** (JPA):
```java
@Repository
public interface <ModelName>EntityRepository extends JpaRepository<<ModelName>, <PrimaryKeyType>> {}
```

**Repository Implementation:**
```java
@Component
public class <ModelName>RepositoryImpl implements <ModelName>Repository {

    private final <ModelName>EntityRepository entityRepository;

    public <ModelName>RepositoryImpl(<ModelName>EntityRepository entityRepository) {
        this.entityRepository = entityRepository;
    }
}
```

## Type Mapping

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
| `text` | `String` |
| `file` | `byte[]` |
| `enum` | `<objectType>` (enum class name) |
| `relation` | `<relation.entity>` |

## Example

```json
{
  "type": "model",
  "name": "Order",
  "tableName": "orders",
  "module": "orders",
  "audit": true,
  "attributes": [
    {
      "type": "long",
      "name": "id",
      "primaryKey": true,
      "generationType": "IDENTITY",
      "nullable": false
    },
    {
      "type": "string",
      "name": "orderNumber",
      "length": 50,
      "nullable": false,
      "unique": true
    },
    {
      "type": "enum",
      "name": "status",
      "objectType": "OrderStatus",
      "module": "orders",
      "nullable": false
    },
    {
      "type": "relation",
      "name": "customer",
      "relation": {
        "type": "ManyToOne",
        "entity": "Customer",
        "fetchType": "LAZY",
        "cascadeType": ["PERSIST", "MERGE"],
        "joinColumn": "customer_id"
      }
    }
  ],
  "uniqueConstraints": [
    { "name": "uq_order_number", "columns": ["orderNumber"] }
  ]
}
```
