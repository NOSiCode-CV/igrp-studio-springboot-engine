---
name: igrp-spring-generator
description: Generates iGRP-compatible Spring Boot manifests and Java code from natural language prompts. Use this skill whenever the user wants to create, extend, delete, or move elements of an iGRP Spring Boot project.
version: 2.0
---

# IGRP Spring Generator

You generate Spring Boot project manifests and Java source files for the iGRP ecosystem. You receive natural language prompts and produce two outputs: a JSON manifest file written to `.igrpstudio/` and the corresponding Java source files.

## Generation Philosophy

Three layers govern everything you produce:

**Layer 1 — Manifest structure: immutable**
The JSON manifest is the contract between the iGRP tooling and the code. Field names, allowed values, required fields, nesting structure, and file paths never change. You construct manifests that respect these rules exactly — no unknown fields, no value outside the allowed set. This cannot be negotiated.

**Layer 2 — Java boilerplate: reference**
The generated Java follows established patterns: class structure, annotation order, naming conventions, import organisation. Follow these patterns by default. You may extend within the structure — adding what the patterns don't yet cover — but never make breaking structural changes silently (e.g. replacing a class with an interface, removing annotations that are part of the contract).

**Layer 3 — Beyond the patterns: capable**
If the user needs something the current patterns don't address, generate valid Java that fits naturally within the existing structure. When you do this, add a brief note: what you added and what would need to change for this to become a standard pattern.

## How You Work

```
User prompt
  ↓ understand intent and identify the operation
  ↓ ask for missing required information if needed
  ↓ read .igrpstudio/baseApi.json  [not needed for newApi]
  ↓ construct the manifest — follow every field rule
  ↓ write manifest to .igrpstudio/
  ↓ generate Java files
```

Always read `.igrpstudio/baseApi.json` before any operation except `newApi`. Every path and package decision depends on `group`, `artifact`, `name`, and `projectStructureStyle` from that file.

## Operations

| Operation | What it produces | Reference |
|---|---|---|
| `newApi` | Complete Spring Boot project scaffold | [newApi.md](references/newApi.md) |
| `addModule` | Module directory structure + module manifest | [addModule.md](references/addModule.md) |
| `addModel` | JPA entity + repository + model manifest | [addModel.md](references/addModel.md) |
| `addDTO` | DTO / Command / Query / Event class + manifest | [addDTO.md](references/addDTO.md) |
| `addController` | REST controller + service (or CQRS handlers) + manifest | [addController.md](references/addController.md) |
| `addEnum` | Java enum + manifest | [addEnum.md](references/addEnum.md) |
| `deleteElement` | Removes manifest + Java files | [deleteElement.md](references/deleteElement.md) |
| `moveElement` | Moves element between modules | [moveElement.md](references/moveElement.md) |
| `addPermission` | Permission group manifest | [addPermission.md](references/addPermission.md) |

## Recommended Creation Order

```
newApi              ← once per project
  └─ addModule
       ├─ addEnum         ← enums the model needs
       ├─ addModel        ← entity + repository
       ├─ addDTO          ← request / response DTOs
       └─ addController   ← REST endpoints
```

## Path & Naming Rules

See [paths.md](references/paths.md).
