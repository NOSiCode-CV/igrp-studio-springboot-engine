# newApi

Produces a complete Spring Boot project scaffold. The `baseApi.json` manifest written by this operation is read by every other operation — it is the project contract.

## Manifest written to

`.igrpstudio/baseApi.json`

## Manifest fields

| Field | Required | Rules |
|---|---|---|
| `type` | Yes | Must be exactly `springboot` |
| `name` | Yes | Must start with a letter. Only letters, digits, underscores allowed. Pattern: `^[A-Za-z][A-Za-z0-9_]*$` |
| `group` | Yes | Java group ID. Only letters, digits, dots, underscores. Pattern: `^[a-zA-Z0-9._]+$` |
| `artifact` | Yes | Maven artifact ID. Letters, digits, dots, underscores, hyphens. Pattern: `^[a-zA-Z0-9._-]+$` |
| `database` | Yes | One of: `MySQL` · `Oracle` · `Postgresql` · `H2` |
| `projectStructureStyle` | Yes | One of: `technical` · `domain` |
| `enableObservability` | Yes | Boolean — adds Actuator + Prometheus config when `true` |
| `enableEntityRevision` | Yes | Boolean — adds Hibernate Envers config when `true` |
| `enableGraalVm` | Yes | Boolean — adds GraalVM build config when `true` |
| `description` | No | Free text |
| `package` | No | Overrides the derived `packageName` |
| `javaVersion` | No | String |
| `springBootVersion` | No | String |
| `springCloudVersion` | No | String |
| `springDocVersion` | No | String |
| `id` | No | String (tracking ID) |
| `workspaceId` | No | String |
| `version` | No | String |
| `dependencies` | No | Array of dependency objects (see below) |

### Dependency object fields

| Field | Required | Rules |
|---|---|---|
| `name` | Yes | String |
| `groupId` | Yes | Pattern: `^[a-zA-Z0-9._]+$` |
| `artifactId` | Yes | Pattern: `^[a-zA-Z0-9._-]+$` |
| `scope` | Yes | Pattern: `^[A-Za-z][A-Za-z0-9_]*$` |
| `version` | No | String |
| `bom` | No | String |

No fields outside those listed above are permitted in the manifest.

## Files produced

### Both styles

| File | Notes |
|---|---|
| `pom.xml` | Maven build with IGRP framework dependency |
| `Dockerfile` | Multi-stage build |
| `docker-compose.yml` | Local dev stack |
| `.env` | Environment variable template |
| `src/main/resources/application.properties` | Main configuration — datasource, JWT, Eureka |
| `src/main/resources/application-development.properties` | Eureka discovery, debug logging |
| `src/main/resources/application-staging.properties` | Kubernetes discovery, JWT |
| `src/main/resources/application-production.properties` | Kubernetes, JWT, Swagger disabled |
| `src/main/resources/banner.txt` | Spring Boot banner |
| `k8s/deployment.yaml` | Kubernetes deployment |
| `k8s/ingress.yaml` | Kubernetes ingress |
| `k8s/cluster.yaml` | Kubernetes cluster config |
| `k8s/service.yaml` | Kubernetes service |

### Technical style — Java files

```
src/main/java/<groupPath>/<packageName>/
  <Name>Application.java
  config/
    AuditEntity.java
    ApplicationAuditorAware.java
    SwaggerConfig.java
    IgrpEnumDynamicRestExposer.java
  security/
    SecurityConfig.java
  exceptions/
    GlobalExceptionHandler.java
    IgrpResponseStatusException.java
```

### Domain style — Java files

```
src/main/java/<groupPath>/<packageName>/
  <Name>Application.java
  shared/
    config/
      AuditEntity.java
      ApplicationAuditorAware.java
      SwaggerConfig.java
      IgrpEnumDynamicRestExposer.java
    security/
      SecurityConfig.java
    domain/
      events/
        EventPublisher.java
      exceptions/
        GlobalExceptionHandler.java
        IgrpResponseStatusException.java
    infrastructure/
      spring/
        SpringCommandBus.java
        SpringQueryBus.java
```

## Key class patterns

### Application class

```java
@EnableJpaAuditing(auditorAwareRef = "applicationAuditorAware")
@SpringBootApplication
public class <Name>Application {
    public static void main(String[] args) {
        SpringApplication.run(<Name>Application.class, args);
    }
}
```

### application.properties — conditional blocks

```properties
spring.application.name=<name>
spring.profiles.active=development

# Postgresql datasource block
spring.datasource.url=${DB_URL:jdbc:postgresql://localhost:5432/<name>}
spring.datasource.username=${DB_USERNAME:postgres}
spring.datasource.password=${DB_PASSWORD:postgres}
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.hibernate.ddl-auto=update

# MySQL adds dialect block
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# Oracle adds dialect block
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.OracleDialect

# enableEntityRevision=true adds
spring.jpa.properties.hibernate.integration.envers.enabled=true

# enableObservability=true adds
management.endpoints.web.exposure.include=health,info,metrics,prometheus
management.endpoint.health.show-details=always
management.metrics.export.prometheus.enabled=true
```
