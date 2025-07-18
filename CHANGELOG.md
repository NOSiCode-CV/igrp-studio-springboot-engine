# Changelog

All notable changes to the IGRP Spring Engine project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Future features and improvements will be listed here before they are released

### Changed
- Upcoming changes to existing functionality will be listed here

### Deprecated
- Soon-to-be removed features will be listed here

### Removed
- Features that have been removed will be listed here

### Fixed
- Bug fixes will be listed here

### Security
- Security improvements will be listed here

## [0.1.0-beta.1] - 2025-07-18

### Added
- `.env.example` file to the project root as a template for environment variables
  - Serves as a base reference for developers to create their own `.env` file
  - Note: This does not affect existing projects — only new ones will include this file automatically
- Updated `.gitignore` and `.dockerignore` to:
  - Ignore `.env` (to avoid leaking local secrets)
  - Include `.env.example` (so the template is tracked and shared)

### Changed
- **🔧 Project Structure Refactoring**
  - Major restructuring of the project to improve clarity, modularity, and encourage clean separation between persistence and business logic
  - Follows clean architecture and Domain-Driven Design (DDD) principles

- **Configuration Changes**
  - Adjustment to the structure of the `.igrpstudio/baseApi.json` file:
    - Removed field `springBootVersion`
    - Renamed field `igrpCoreVersion` to `version` and set it to `0.1.0-beta.1`
  
  - Adjustment to the `pom.xml` file:
    - Added the following properties:
      - `<igrp.version>0.1.0-beta.1</igrp.version>` - Used by IGRP framework dependencies, for example:
        ```xml
        <!-- IGRP dependencies -->
        <dependency>
            <groupId>cv.igrp.framework</groupId>
            <artifactId>core</artifactId>
            <version>${igrp.version}</version>
        </dependency>

        <dependency>
            <groupId>cv.igrp.framework</groupId>
            <artifactId>stereotype</artifactId>
            <version>${igrp.version}</version>
        </dependency>

        <!-- IGRP File Libraries -->
        <dependency>
            <groupId>cv.igrp.platform</groupId>
            <artifactId>filemanager</artifactId>
            <version>${igrp.version}</version>
        </dependency>

        <dependency>
            <groupId>cv.igrp.framework.filemanager</groupId>
            <artifactId>minio</artifactId>
            <version>${igrp.version}</version>
        </dependency>

        <!-- IGRP Report Libraries -->
        <dependency>
            <groupId>cv.igrp.platform</groupId>
            <artifactId>report</artifactId>
            <version>${igrp.version}</version>
        </dependency>

        <dependency>
            <groupId>cv.igrp.framework.report</groupId>
            <artifactId>jasper</artifactId>
            <version>${igrp.version}</version>
        </dependency>
        ```
      - `<java.version>23</java.version>` - Specifies the Java version for the project
      - `<spring-cloud.version>2025.0.0</spring-cloud.version>` - Used by Spring Cloud dependencies
      - `<springdoc.version>2.8.9</springdoc.version>` - Used by SpringDoc OpenAPI UI

- **Architecture Layer Changes**
  - **Domain Layer**:
    - The `domain` package was redefined to serve strictly as the space for business logic implementation
    - Subpackages such as `model`, `repository`, `service`, and `events` remain present but are now empty by default, allowing developers to structure their logic intentionally
    - The previously generated CRUD interface that was placed in `domain/repository` (which exposed CRUD operations over the persistence entity) was removed, eliminating persistence concerns from the domain

  - **Persistence Layer**:
    - The persistence entity was moved from `domain/model` to `persistence/entity` and renamed with the suffix `Entity`
    - JPA repositories were organized under `persistence/repository`, keeping the naming convention based on the entity name (e.g., `XEntityRepository`)

  - **Application Layer**:
    - The `handlers` subpackages inside `application/commands` and `application/queries` were removed
    - Handlers are now placed directly within their respective `commands` or `queries` packages to simplify structure

  - **Interface Layer**:
    - Controllers were moved from `infrastructure/controller` to `interfaces/rest` for a clearer representation of the system's entry points

### Directory Structure Changes

#### Before

```
application/
└── commands/
    ├── commands/
    │   └── SomeCommand.java
    └── handlers/
        └── SomeCommandHandler.java

└── queries/
    ├── queries/
    │   └── SomeQuery.java
    └── handlers/
        └── SomeQueryHandler.java

domain/
  ├── model/
  │   └── <Entity.java>
  ├── repository/
  │   └── I<EntityRepository.java>
  ├── service/
  └── events/

infrastructure/
├── persistence/
│   └── <EntityRepository.java>  (JPA repository)
└── controller/
    └── <Controller.java>
```

#### After

```
application/
  ├── commands/
  │   ├── SomeCommand.java
  │   └── SomeCommandHandler.java
  ├── queries/
  │   ├── SomeQuery.java
  │   └── SomeQueryHandler.java

domain/
  ├── model/
  ├── repository/
  ├── service/
  └── events/
  (all empty by default – for business logic only)

persistence/
  ├── entity/
  │   └── <EntityEntity.java>
  └── repository/
      └── <EntityEntityRepository.java>

interfaces/
  └── rest/
      └── <Controller.java>
```

### Purpose of Changes

- Establish a clear separation of concerns between layers
- Isolate domain logic from infrastructure and persistence
- Simplify folder structure to enhance readability and maintainability
- Provide a clean starting point for developers to define business logic manually

[Unreleased]: https://github.com/yourusername/spring-engine/compare/v0.1.0-beta.1...HEAD
[0.1.0-beta.1]: https://github.com/yourusername/spring-engine/releases/tag/v0.1.0-beta.1