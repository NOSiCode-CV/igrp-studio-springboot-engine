# addModel

Produces a JPA entity class, a repository, and a model manifest. In domain style it also produces a domain repository interface, a repository implementation, and an entity repository adapter.

## Manifest written to

`.igrpstudio/<module>/models/<Name>.json`

## Manifest fields

### Top-level

| Field | Required | Rules |
|---|---|---|
| `type` | Yes | Must be exactly `model` |
| `name` | Yes | PascalCase entity name. Pattern: `^[A-Za-z][A-Za-z0-9_]*$` |
| `tableName` | Yes | Database table name. Pattern: `^[A-Za-z][A-Za-z0-9_]*$` |
| `attributes` | Yes | Array of attribute objects. Cannot be empty |
| `module` | No | Default: `shared`. Pattern: `^[A-Za-z][A-Za-z0-9_]*$` |
| `primaryKey` | No | Array of composite primary key objects |
| `uniqueConstraints` | No | Array of unique constraint objects |
| `indexes` | No | Array of index objects |
| `relationReference` | No | Array of inverse-side relation objects |
| `audit` | No | Boolean — `true` makes the class extend `AuditEntity` |
| `revision` | No | Boolean — `true` adds `@Audited` (Hibernate Envers) |
| `crud` | No | Boolean — `true` auto-generates CRUD endpoints |
| `readOnly` | No | Boolean — `true` prevents overwriting existing files |
| `id` | No | String |
| `version` | No | String |

No other fields are permitted.

### Attribute object

| Field | Required | Rules |
|---|---|---|
| `type` | Yes | One of the attribute types listed below |
| `name` | Yes | camelCase field name. Pattern: `^[A-Za-z][A-Za-z0-9_]*$` |
| `length` | No | Number |
| `nullable` | No | Boolean |
| `unique` | No | Boolean |
| `primaryKey` | No | Boolean |
| `generationType` | No | One of: `` (empty) · `IDENTITY` · `SEQUENCE` · `TABLE` · `AUTO` · `NONE` |
| `sequenceName` | No | Required when `generationType` is `SEQUENCE`. Pattern: `^[A-Za-z][A-Za-z0-9_]*$` |
| `defaultValue` | No | String |
| `objectType` | No | The enum class name — used when `type` is `enum` |
| `module` | No | Module of the referenced enum. Pattern: `^[A-Za-z][A-Za-z0-9_]*$` |
| `relation` | No | Relation object — required when `type` is `relation` |
| `skipFieldRevision` | No | Boolean — adds `@NotAudited` (Envers) |

### Attribute types

All accepted values for the `type` field on an attribute:

`boolean` · `integer` · `long` · `short` · `float` · `double` · `string` · `char` · `uuid` · `decimal` · `biginteger` · `date` · `datetime` · `time` · `instant` · `uri` · `url` · `text` · `json` · `binary` · `file` · `object` · **`relation`** (JPA relationship)

### Attribute type → Java type mapping

| Attribute type | Java type | Import |
|---|---|---|
| `boolean` | `boolean` | — |
| `integer` | `Integer` | — |
| `long` | `Long` | — |
| `short` | `short` | — |
| `float` | `Float` | — |
| `double` | `Double` | — |
| `string` | `String` | — |
| `char` | `char` | — |
| `text` | `String` | — |
| `uuid` | `UUID` | `java.util.UUID` |
| `decimal` | `BigDecimal` | `java.math.BigDecimal` |
| `biginteger` | `BigInteger` | `java.math.BigInteger` |
| `date` | `LocalDate` | `java.time.LocalDate` |
| `datetime` | `LocalDateTime` | `java.time.LocalDateTime` |
| `time` | `LocalTime` | `java.time.LocalTime` |
| `instant` | `Instant` | `java.time.Instant` |
| `uri` | `URI` | `java.net.URI` |
| `url` | `URL` | `java.net.URL` |
| `json` | `JsonNode` | `com.fasterxml.jackson.databind.JsonNode` |
| `binary` | `byte[]` | — |
| `file` | `byte[]` (stored as BLOB) | — |
| `object` | `Object` | — |

### Relation object

| Field | Required | Rules |
|---|---|---|
| `type` | Yes | One of: `OneToOne` · `OneToMany` · `ManyToOne` · `ManyToMany` |
| `entity` | Yes | Target entity class name. No spaces or hyphens |
| `fetchType` | Yes | One of: `lazy` · `eager` (lowercase in manifest → `FetchType.LAZY/EAGER` in Java) |
| `cardinality` | Yes | One of: `oneWay` · `twoWay` — `twoWay` generates the `mappedBy` inverse side |
| `cascadeType` | No | Array of objects `{ "type": "ALL\|PERSIST\|MERGE\|REFRESH\|REMOVE\|DETACH" }` |
| `orphanRemoval` | No | Boolean |
| `entity` | Yes | Target entity name |
| `fieldName` | No | Override the generated field name. Pattern: `^[a-zA-Z0-9_]+$` |
| `mappedBy` | No | The field on the owning side |
| `referencedColumnName` | No | `@JoinColumn(referencedColumnName=...)` |
| `joinTable` | No | Join table name for ManyToMany |
| `joinColumn` | No | Join column name |
| `inverseJoinColumn` | No | Inverse join column name for ManyToMany |
| `module` | No | Module of the target entity |

### Composite primary key object (`primaryKey[]`)

| Field | Required | Rules |
|---|---|---|
| `type` | Yes | One of: `integer` · `long` · `string` · `uuid` · `boolean` · `short` · `float` · `double` · `char` · `decimal` · `biginteger` |
| `name` | Yes | Pattern: `^[A-Za-z][A-Za-z0-9_]*$` |
| `length` | No | Number |
| `defaultValue` | No | String |

### Unique constraint object

| Field | Required | Rules |
|---|---|---|
| `name` | Yes | Pattern: `^[A-Za-z][A-Za-z0-9_]*$` |
| `columns` | Yes | Array of column name strings |

### Index object

| Field | Required | Rules |
|---|---|---|
| `name` | Yes | Pattern: `^[A-Za-z][A-Za-z0-9_]*$` |
| `columns` | Yes | Array of column name strings |
| `unique` | Yes | Boolean |

### Inverse relation object (`relationReference[]`)

| Field | Required | Rules |
|---|---|---|
| `type` | Yes | One of: `OneToOne` · `OneToMany` · `ManyToOne` · `ManyToMany` |
| `entity` | Yes | Source entity class name |
| `fetchType` | Yes | `lazy` or `eager` |
| `fieldName` | No | Override generated field name |
| `joinColumn` | No | Join column name |
| `mappedBy` | No | Owning-side field name |
| `cascadeType` | No | Array of cascade strings |
| `orphanRemoval` | No | Boolean |
| `module` | No | Module of the source entity |

## Primary key rules

- A model cannot have both a composite primary key (`primaryKey[]`) and a simple primary key attribute (`attribute.primaryKey: true`) simultaneously
- Only one attribute may have `primaryKey: true`
- When an attribute has `primaryKey: true`, `generationType` must be specified
- Valid types for a simple primary key attribute: `integer` · `long` · `uuid` · `string`
- Table name is lowercased for PostgreSQL and MySQL, uppercased for Oracle

## Java — entity class

```java
/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME */

package <computed.package>;

<imports>

[@Audited]                          ← when revision=true
@Getter
@Setter
@IgrpEntity
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(
    name = "<tableName>"
    [, uniqueConstraints = { @UniqueConstraint(name="<n>", columnNames={<cols>}) }]
    [, indexes = { @Index(name="<n>", columnList="<cols>", unique=<bool>) }]
)
public class <Name> [extends AuditEntity] {    ← extends AuditEntity when audit=true

    // composite PK
    [@EmbeddedId
    private <Name>PrimaryKey id;]

    // simple PK — IDENTITY/AUTO/TABLE
    [@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "<name>", unique = true, nullable = false)
    private <JavaType> <fieldName>;]

    // simple PK — SEQUENCE
    [@Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "<seqName>")
    @SequenceGenerator(name = "<seqName>", sequenceName = "<seqName>", allocationSize = 1)
    @Column(name = "<name>", unique = true, nullable = false)
    private <JavaType> <fieldName>;]

    // regular column
    [@NotBlank / @NotNull when nullable=false]
    [@Enumerated(EnumType.STRING) when type=enum]
    @Column(name="<name>" [,length=<n>] [,unique=true] [,nullable=false])
    private <JavaType> <fieldName>;

    // text
    @Lob
    @Column(name="<name>", columnDefinition="TEXT")
    private String <fieldName>;

    // file/binary
    @Lob
    @JdbcType(BinaryJdbcType.class)
    @Column(columnDefinition="BLOB")
    private byte[] <fieldName>;

    // ManyToOne
    [@NotNull when nullable=false]
    @ManyToOne(fetch=FetchType.<LAZY|EAGER> [,cascade={CascadeType.X}])
    @JoinColumn(name="<joinColumn>")
    private <Entity> <fieldName>;

    // OneToMany
    @OneToMany(mappedBy="<mappedBy>" [,cascade={CascadeType.X}] [,orphanRemoval=true])
    private List<<Entity>> <fieldName> = new ArrayList<>();

    // ManyToMany (owning)
    @ManyToMany([cascade={CascadeType.X}])
    @JoinTable(name="<joinTable>",
        joinColumns=@JoinColumn(name="<joinColumn>"),
        inverseJoinColumns=@JoinColumn(name="<inverseJoinColumn>"))
    private Set<<Entity>> <fieldName> = new HashSet<>();

    // OneToOne
    @OneToOne(fetch=FetchType.<LAZY|EAGER>)
    @JoinColumn(name="<joinColumn>")
    private <Entity> <fieldName>;

    // relationReference — inverse side
    @OneToOne(mappedBy="<mappedBy>") private <Entity> <fieldName>;
    @OneToMany(mappedBy="<mappedBy>") private List<<Entity>> <fieldName> = new ArrayList<>();
    @ManyToMany(mappedBy="<mappedBy>") private Set<<Entity>> <fieldName> = new HashSet<>();
}
```

## Java — repository (technical)

```java
@Repository
public interface <Name>Repository extends JpaRepository<<Name>, <PkType>> {}
```

## Java — domain style repositories

```java
// Domain contract
public interface <Name>Repository { }

// JPA adapter
@Repository
public interface <Name>EntityRepository extends JpaRepository<<Name>, <PkType>> {}

// Implementation
@Component
public class <Name>RepositoryImpl implements <Name>Repository {
    private final <Name>EntityRepository entityRepository;
    public <Name>RepositoryImpl(<Name>EntityRepository entityRepository) {
        this.entityRepository = entityRepository;
    }
}
```
