# IGRP Spring Engine — Documentation

> **Package:** `@igrp/igrp-studio-springboot-engine`
> **Version:** `0.1.0-beta.20`
> **Purpose:** TypeScript engine that generates Spring Boot microservice projects from declarative JSON configuration objects.

---

## What Is This?

The IGRP Spring Engine is the code-generation core of the IGRP Studio ecosystem. It takes structured JSON configuration objects (called **manifests**) and produces:

- Full **Spring Boot project scaffolding** (`pom.xml`, `application.properties`, bootstrapping classes)
- **Java source files** for entities, repositories, DTOs, controllers, services, enumerations, and handlers
- **`.igrpstudio/` configuration files** that store the canonical manifest state for future re-generation

It is consumed by IGRP Studio (the GUI tool) and can also be called programmatically via its public TypeScript API.

---

## Documentation Index

| Document | Description |
|----------|-------------|
| [Architecture](./architecture.md) | System architecture, module structure, design patterns |
| [Public API](./public-api.md) | All exported functions with signatures, parameters, and examples |
| [Configuration Types](./configuration-types.md) | TypeScript interfaces for all configuration objects |
| [Code Generation Pipeline](./code-generation-pipeline.md) | End-to-end flow from config to generated Java |
| [Extending the Engine](./extending-the-engine.md) | How to add new operations, module types, and templates |
| [Demoteste Backend Alignment](./demoteste-backend-alignment.md) | Practical summary of how backend generation was aligned with the `demoteste` workspace pattern |

---

## Quick Start

```typescript
import {
  setEngineConfiguration,
  newApi,
  addModule,
  addModel,
  addDTO,
  addController,
  addEnum,
} from '@igrp/igrp-studio-springboot-engine';

// 1. Configure the engine environment
setEngineConfiguration({ environment: 'development' });

// 2. Initialize a new Spring Boot project
await newApi({
  type: 'springboot',
  name: 'my_api',
  group: 'com.example',
  artifact: 'myapp',
  database: 'MySQL',
  authMode: 'keycloak',
  projectStructureStyle: 'technical',
  enableObservability: false,
  enableEntityRevision: false,
  enableGraalVm: false,
}, '/path/to/output');

// 3. Add a module
await addModule({ type: 'module', name: 'users' }, '/path/to/output');

// 4. Add an entity model
await addModel({
  type: 'model',
  name: 'UserEntity',
  tableName: 'users',
  module: 'users',
  attributes: [
    { type: 'string', name: 'username', nullable: false },
    { type: 'string', name: 'email',    nullable: false },
  ],
}, '/path/to/output');
```

---

## Key Concepts

### Project Structure Styles

The engine supports two styles, controlled by `projectStructureStyle`:

| Style | Description |
|-------|-------------|
| `technical` | Classes organized by type: `models/`, `controllers/`, `services/`, `dto/` |
| `domain` | Classes organized by DDD layer: `domain/`, `application/`, `infrastructure/`, `interfaces/rest/` |

### Backend Authentication Modes

The backend generator supports two runtime authentication modes:

| Mode | Behavior |
|------|----------|
| `keycloak` | Default mode. Backend generation keeps the Keycloak issuer-based behavior and explicitly emits `AUTH_PROVIDER=keycloak` |
| `autentika` | Backend generation still uses only `AUTH_JWT_ISSUER`, but emits `AUTH_PROVIDER=autentika` and uses `${AUTENTIKA_ISSUER}` as issuer |

The Spring Engine does not generate frontend-specific authentication variables. It only emits backend runtime auth settings.

### Manifest-First Workflow

Every generated artifact is backed by a JSON manifest stored in `.igrpstudio/`. The manifest is:
- Written first (before any Java is generated)
- Used to re-generate Java at any time (idempotent regeneration)
- The source of truth for all configuration

### Configuration Storage (`.igrpstudio/`)

```
.igrpstudio/
├── baseApi.json                          ← API-level config
├── <module>/
│   ├── module.json                       ← Module config
│   ├── models/<ModelName>.json           ← Entity configs
│   ├── dto/<Name>DTO.json                ← DTO configs
│   ├── controllers/<Name>Controller.json ← Controller configs
│   └── enum/<EnumName>.json             ← Enum configs
└── permissions/<Name>.json              ← Permission configs
```

---

## Technology Stack

| Technology | Purpose |
|-----------|---------|
| TypeScript | Engine source language |
| Handlebars | Java code template engine |
| AJV (v8) | JSON Schema validation of config objects |
| fs-extra | File system operations |
| Vite | Bundling (CJS + ESM outputs) |
| Jest + ts-jest | Test runner |
| pluralize / inflection | String transformations for naming |

---

## Supported Spring Versions (bundled defaults)

| Component | Version |
|-----------|---------|
| Java | 25 |
| Spring Boot | 3.5.10 |
| Spring Cloud | 2025.0.1 |
| SpringDoc (Swagger) | 2.8.15 |
