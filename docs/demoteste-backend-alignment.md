# Demoteste Backend Alignment

This document explains what changed in the Spring Engine compared with the original backend generator behavior, after aligning it with the Spring Boot backend projects used in the `demoteste` workspace.

The scope of this alignment is intentionally limited to **Spring Boot backend project generation**. It does **not** cover Next.js frontend generation or workspace-root generation, which belong to other engines.

---

## Goal

The original engine generated a valid Spring Boot project, but it was still based on an older infrastructure model:

- standalone-oriented Docker setup
- project-local observability stack
- generic Kubernetes manifests
- incomplete workspace context
- missing backend workspace integration artifacts

The `demoteste` backend projects showed a newer target model:

- every backend generates both:
  - `docker-compose.yml` for standalone execution
  - `igrp-compose-<project>.yaml` for workspace integration
- workspace-specific env file naming:
  - `.igrp.<project>.env`
- project-local database bootstrap:
  - `db/init-database.sh`
- backend project metadata includes:
  - `workspaceId`
  - `workspaceSlug`
- backend authentication now supports two runtime modes:
  - `keycloak` as the default mode
  - `autentika` as an alternative issuer mode
- no project-local monitoring stack
- backend Kubernetes generation is limited to:
  - `deployment.yaml`
  - `service.yaml`

---

## Summary Of Changes

The alignment introduced five main categories of changes:

1. Backend configuration model changes
2. Generated infrastructure artifact changes
3. Backend authentication mode support
4. Removal of obsolete observability scaffolding
5. Test suite modernization

---

## 1. Configuration Model Changes

### Added workspace context and auth mode to backend project config

The engine now supports `workspaceSlug` in the backend base project configuration, alongside `workspaceId`.
It also supports an optional `authMode` field for backend authentication generation.

This change was required because backend project artifacts now depend on the workspace name for:

- Docker external network naming
- registry naming
- gateway labels
- backend integration URLs
- OpenTelemetry collector host naming

The `authMode` field was introduced to support two backend authentication runtime modes without leaking frontend auth concerns into backend generation:

- `keycloak`
- `autentika`

### Files updated

- [src/interfaces/types.ts](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/src/interfaces/types.ts)
- [src/schema/baseApiConfig.ts](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/src/schema/baseApiConfig.ts)
- [src/schema/apiConfig.ts](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/src/schema/apiConfig.ts)
- [src/index.ts](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/src/index.ts)

### Result

The generated project-local metadata in `.igrpstudio/baseApi.json` now preserves both:

- `workspaceId`
- `workspaceSlug`
- `authMode` when explicitly provided

This keeps the generated backend project self-describing without touching workspace-root metadata.

---

## 2. Backend Authentication Mode Support

### Added `keycloak` and `autentika` backend generation modes

The backend projects in `demoteste` now support two authentication runtime modes:

- `keycloak`
- `autentika`

For the Spring Engine, this affects only backend runtime configuration.

It does **not** make the backend generator responsible for frontend auth variables such as:

- `AUTENTIKA_CLIENT_ID`
- `AUTENTIKA_CLIENT_SECRET`
- `AUTENTIKA_HOST`
- `AUTENTIKA_SCOPES`
- frontend `KEYCLOAK_*` variables

### Backend rule

The Spring backend continues to use only:

- `AUTH_PROVIDER`
- `AUTH_JWT_ISSUER`

### Effective behavior

- if `authMode` is omitted, backend generation defaults to `keycloak`
- if `authMode` is `keycloak`, generated projects remain almost identical to the previous aligned output, with `AUTH_PROVIDER=keycloak` added explicitly
- if `authMode` is `autentika`, the backend still uses only `AUTH_JWT_ISSUER`, but the value becomes `${AUTENTIKA_ISSUER}`

### Files updated

- [src/interfaces/types.ts](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/src/interfaces/types.ts)
- [src/schema/baseApiConfig.ts](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/src/schema/baseApiConfig.ts)
- [src/schema/apiConfig.ts](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/src/schema/apiConfig.ts)
- [src/index.ts](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/src/index.ts)
- [public/templates/config/env.hbs](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/public/templates/config/env.hbs)
- [public/templates/config/env.example.hbs](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/public/templates/config/env.example.hbs)
- [public/templates/partials/auth-env.hbs](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/public/templates/partials/auth-env.hbs)
- [public/templates/config/igrp-env.hbs](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/public/templates/config/igrp-env.hbs)
- [public/templates/config/igrp-docker-compose.hbs](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/public/templates/config/igrp-docker-compose.hbs)
- [public/templates/config/k8s/deploymentyaml.hbs](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/public/templates/config/k8s/deploymentyaml.hbs)

### Result

Generated backend projects now support both authentication modes without breaking the default Keycloak path and without importing frontend-specific auth variables into Spring project generation.

---

## 3. Generated Artifact Changes

### 3.1 Standalone backend artifacts were corrected

The original standalone `docker-compose.yml` generation had several issues:

- JDBC host mismatch with generated DB service name
- no database healthcheck
- weak dependency ordering
- older environment variable layout
- monitoring-related compose fragments mixed into backend generation

These were aligned with the `demoteste` backend pattern.

### Files updated

- [public/templates/config/docker-compose.hbs](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/public/templates/config/docker-compose.hbs)
- [public/templates/config/env.hbs](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/public/templates/config/env.hbs)
- [public/templates/config/env.example.hbs](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/public/templates/config/env.example.hbs)
- [public/templates/partials/database-docker-env.hbs](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/public/templates/partials/database-docker-env.hbs)
- [public/templates/partials/database-env.hbs](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/public/templates/partials/database-env.hbs)
- [public/templates/partials/postgres-docker-service.hbs](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/public/templates/partials/postgres-docker-service.hbs)
- [public/templates/partials/mysql-docker-service.hbs](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/public/templates/partials/mysql-docker-service.hbs)
- [public/templates/partials/oracle-docker-service.hbs](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/public/templates/partials/oracle-docker-service.hbs)
- [public/templates/partials/database-docker-volumes.hbs](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/public/templates/partials/database-docker-volumes.hbs)
- [public/templates/partials/auth-env.hbs](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/public/templates/partials/auth-env.hbs)

### Result

Standalone backend projects now generate:

- a corrected database service definition
- a correct JDBC host reference
- database healthchecks
- improved startup ordering
- cleaner backend-focused env files

---

### 3.2 Workspace-integrated backend artifacts were added

The original engine did not generate the backend integration artifacts used by backend projects inside `demoteste`.

The aligned engine now generates:

- `igrp-compose-<project>.yaml`
- `.igrp.<project>.env`
- `db/init-database.sh`

### Files added or registered

- [public/templates/config/igrp-docker-compose.hbs](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/public/templates/config/igrp-docker-compose.hbs)
- [public/templates/config/igrp-env.hbs](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/public/templates/config/igrp-env.hbs)
- [public/templates/config/init-database.sh.hbs](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/public/templates/config/init-database.sh.hbs)
- [src/utils/constants.ts](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/src/utils/constants.ts)
- [src/modules/baseApi/saveBaseApiFiles.ts](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/src/modules/baseApi/saveBaseApiFiles.ts)
- [src/modules/baseApi/createAppDirectories.ts](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/src/modules/baseApi/createAppDirectories.ts)

### Result

Every generated backend project now contains both execution modes:

- standalone mode
- workspace-integrated mode

This matches the current Spring backend project structure used in `demoteste`.

---

### 3.3 Dockerfile generation was simplified and aligned

The previous engine kept Dockerfile branching related to observability and older container build conventions.

The aligned version uses the same Dockerfile approach regardless of whether OpenTelemetry is enabled at application level.

### Files updated

- [public/templates/config/dockerfile.hbs](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/public/templates/config/dockerfile.hbs)
- [src/utils/constants.ts](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/src/utils/constants.ts)

### Result

Dockerfile generation is now simpler:

- one backend Dockerfile model
- BuildKit cache mounts
- no project-local observability agent packaging

OpenTelemetry behavior is now controlled at the application configuration level, not by Dockerfile branching.

---

## 4. Application Configuration Changes

### Application properties were aligned with backend runtime expectations

The backend runtime templates were updated so that generated projects use a cleaner runtime configuration model.

### Files updated

- [public/templates/struct/resource/application.properties.hbs](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/public/templates/struct/resource/application.properties.hbs)
- [public/templates/config/open-telemetry-config-graalvm.hbs](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/public/templates/config/open-telemetry-config-graalvm.hbs)
- [public/templates/partials/observability-env.hbs](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/public/templates/partials/observability-env.hbs)

### Notable behavior changes

- `spring.application.name` is normalized for backend runtime use
- active profile resolution now uses a clearer default form
- OTEL exporter endpoint uses `OTEL_EXPORTER_OTLP_ENDPOINT`
- observability env partial was reduced to application-level OTEL settings only
- backend auth runtime configuration now supports `AUTH_PROVIDER` plus mode-dependent `AUTH_JWT_ISSUER`

### Result

OpenTelemetry is no longer modeled as a local project infrastructure stack. It is now treated only as application/runtime configuration.

---

## 5. Kubernetes Generation Changes

### Backend Kubernetes generation was narrowed to the actual backend pattern

The original engine generated a wider set of Kubernetes artifacts, including placeholder files that no longer match how backend Spring projects are structured in `demoteste`.

The aligned engine keeps backend generation focused on:

- `k8s/deployment.yaml`
- `k8s/service.yaml`

### Files updated

- [public/templates/config/k8s/deploymentyaml.hbs](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/public/templates/config/k8s/deploymentyaml.hbs)
- [public/templates/config/k8s/serviceyaml.hbs](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/public/templates/config/k8s/serviceyaml.hbs)
- [src/modules/baseApi/saveBaseApiFiles.ts](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/src/modules/baseApi/saveBaseApiFiles.ts)

### Result

Generated backend projects no longer emit backend `ingress.yaml` or `cluster.yaml` as part of the default project scaffolding.

This follows the current Spring backend convention used in the workspace projects that served as reference.

---

## 6. CI Generation Changes

### Backend CI was simplified

The GitLab CI template was aligned with the lighter backend CI style used in the `demoteste` backend projects.

### Files updated

- [public/templates/config/gitlabciyaml.hbs](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/public/templates/config/gitlabciyaml.hbs)

### Result

Generated backend projects now produce CI closer to the workspace backend conventions and less tied to the older engine defaults.

---

## 7. Removal Of Obsolete Observability Scaffolding

### Removed project-local monitoring generation

One of the largest conceptual changes was removing the older observability scaffolding from backend project generation.

The previous engine generated backend-project-local monitoring artifacts such as:

- collector
- prometheus
- promtail
- tempo
- observability compose files
- observability-specific Dockerfiles
- OpenTelemetry Java agent binary packaging

This is no longer part of the Spring backend project model used in `demoteste`.

### Files updated

- [src/utils/constants.ts](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/src/utils/constants.ts)
- [src/modules/baseApi/saveBaseApiFiles.ts](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/src/modules/baseApi/saveBaseApiFiles.ts)
- [src/modules/baseApi/createAppDirectories.ts](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/src/modules/baseApi/createAppDirectories.ts)

### Removed constants and generation paths

The following legacy constants were removed from active backend generation:

- `OBSERVABILITY_CONFIG_FILES`
- `OBSERVABILITY_CONFIG_FILES_GRAALVM`
- `OBSERVABILITY_YAML_CONFIG_FILES`
- `OBSERVABILITY_BINARY_FILES`

### Result

Generated backend projects no longer include:

- project-local monitoring directories
- local monitoring compose services
- local monitoring YAMLs
- OTEL Java agent binary artifacts

This makes backend generation closer to the real backend project shape in the workspace.

---

## 8. Project-Local Metadata Changes

### `.igrpstudio/baseApi.json` now preserves backend workspace identity

The project-local metadata generated inside each backend project now stores the workspace identifiers needed by the backend project itself.

### Result

Generated backend project metadata now includes:

- `workspaceId`
- `workspaceSlug`
- `authMode` when it is explicitly configured

This is useful for regeneration, project-local consistency, and future backend-aware tooling.

The alignment does **not** change workspace-root metadata. That remains outside the scope of this engine.

---

## 9. Test Suite Changes

### The old tests were modernized to validate actual generated output

The original tests relied too heavily on hardcoded paths and weak assertions. The aligned version modernized the test suite to validate generated backend artifacts more directly.

### Files updated

- [__test__/newApi.test.ts](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/__test__/newApi.test.ts)
- [__test__/addModel.test.ts](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/__test__/addModel.test.ts)
- [__test__/addModelWithRelation.test.ts](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/__test__/addModelWithRelation.test.ts)
- [__test__/addDTO.test.ts](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/__test__/addDTO.test.ts)
- [__test__/addController.test.ts](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/__test__/addController.test.ts)
- [__test__/testUtils.ts](/Users/Eder.Z.Moreno/Documents/EderTeste/spring-engine/__test__/testUtils.ts)

### Result

The tests now validate the engine in a way that is closer to real usage:

- temporary project scaffolding
- project-local file assertions
- stronger checks on generated backend artifacts
- validation of both backend auth modes:
  - default `keycloak`
  - explicit `autentika`

This was necessary so the demoteste-aligned generation could be validated safely after each change.

---

## 10. What Did Not Change

This alignment was intentionally conservative.

The following parts of the engine were not the focus of this backend infrastructure update:

- model generation semantics
- DTO generation semantics
- controller generation semantics
- Handlebars core render pipeline
- file persistence helpers
- workspace-root generation
- frontend generation
- frontend authentication provider setup
- workspace-root `igrp-compose.yaml` / `igrp-autentika-compose.yaml`
- process stack authentication compose generation

The goal was to adapt backend project scaffolding and backend infrastructure generation with the smallest practical change set.

---

## 11. Final Outcome

Compared with the original Spring Engine behavior, the new aligned version now generates Spring Boot backend projects that are much closer to the current backend projects used in the `demoteste` workspace.

The new backend output includes:

- correct standalone backend Docker artifacts
- workspace-integrated backend artifacts
- project-local backend workspace metadata
- backend auth generation with `keycloak` default and `autentika` support
- simplified backend CI
- simplified backend Dockerfile handling
- backend-only Kubernetes output
- no project-local monitoring stack

In short, the engine now better reflects the actual backend project conventions being used in practice.
