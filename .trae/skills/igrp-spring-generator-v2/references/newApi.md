# newApi

Initializes a complete Spring Boot project scaffold. This operation is typically run once by iGRP Studio. The `baseApi.json` manifest it writes is the **source of truth** for all subsequent operations — every other operation reads it to resolve paths, packages, and project settings.

## Schema

```typescript
interface BaseApiConfig {
  type: 'springboot';                              // required, literal
  name: string;                                    // required, [a-zA-Z][a-zA-Z0-9_]*
  group: string;                                   // required, Java group ID (e.g. "cv.igrp")
  artifact: string;                                // required, Maven artifact ID (e.g. "order-service")
  database: 'Postgresql' | 'MySQL' | 'Oracle' | 'H2'; // required
  projectStructureStyle: 'technical' | 'domain';  // required
  enableObservability: boolean;                    // required
  enableEntityRevision: boolean;                   // required — enables Hibernate Envers globally
  enableGraalVm: boolean;                          // required
  description?: string;
  package?: string;                                // overrides derived packageName
  id?: string;
  workspaceId?: string;
  version?: string;
  javaVersion?: string;
  springBootVersion?: string;
  springCloudVersion?: string;
  springDocVersion?: string;
  dependencies?: Dependency[];
}

interface Dependency {
  name: string;       // required
  groupId: string;    // required
  artifactId: string; // required
  scope: string;      // required
  version?: string;
  bom?: string;
}
```

## Manifest Output

Written to: `.igrpstudio/baseApi.json`

## Files Generated (Both Styles)

- `pom.xml` — Maven configuration with IGRP framework dependency
- `Dockerfile` — Multi-stage Docker build
- `docker-compose.yml` — Local dev stack
- `.env` — Environment variables template
- `src/main/resources/application.properties` — Main configuration
- `src/main/resources/application-development.properties` — Eureka discovery, debug logging
- `src/main/resources/application-staging.properties` — Kubernetes discovery, JWT
- `src/main/resources/application-production.properties` — Kubernetes, JWT, Swagger disabled
- `src/main/resources/banner.txt`
- `k8s/deployment.yaml`, `k8s/ingress.yaml`, `k8s/cluster.yaml`, `k8s/service.yaml`

## Directory Structure

### Technical Style

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
  controllers/
  models/
  services/
  dto/
  enum/
src/test/java/<groupPath>/<packageName>/
  repositories/
  services/
.igrpstudio/
  baseApi.json
  shared/
```

### Domain Style

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
.igrpstudio/
  baseApi.json
  shared/
```

## Key Generated Class Patterns

### Application Class

```java
@EnableJpaAuditing(auditorAwareRef = "applicationAuditorAware")
@SpringBootApplication
public class <Name>Application {
    public static void main(String[] args) {
        SpringApplication.run(<Name>Application.class, args);
    }
}
```

### application.properties (conditional blocks)

```properties
spring.application.name=<name>
spring.profiles.active=development

# Datasource — Postgresql
spring.datasource.url=${DB_URL:jdbc:postgresql://localhost:5432/<name>}
spring.datasource.username=${DB_USERNAME:postgres}
spring.datasource.password=${DB_PASSWORD:postgres}
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.hibernate.ddl-auto=update

# Datasource — MySQL (adds dialect block)
spring.datasource.url=${DB_URL:jdbc:mysql://localhost:3306/<name>}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# Entity Revision block (when enableEntityRevision=true)
spring.jpa.properties.hibernate.integration.envers.enabled=true

# Observability block (when enableObservability=true)
management.endpoints.web.exposure.include=health,info,metrics,prometheus
management.endpoint.health.show-details=always
management.metrics.export.prometheus.enabled=true
```

## Example Input

```json
{
  "type": "springboot",
  "name": "OrderService",
  "group": "cv.igrp",
  "artifact": "order-service",
  "database": "Postgresql",
  "projectStructureStyle": "domain",
  "enableObservability": true,
  "enableEntityRevision": false,
  "enableGraalVm": false
}
```
