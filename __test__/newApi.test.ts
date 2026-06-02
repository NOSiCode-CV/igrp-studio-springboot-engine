import fs from 'fs-extra';
import path from 'path';
import {afterAll, afterEach, beforeAll, describe, expect, it} from '@jest/globals';
import {newApi, setEngineConfiguration} from '../src';
import {BaseApiConfig} from '../src/interfaces/types';

const TMP_ROOT = path.join(process.cwd(), '__test__', '.tmp');

const technicalApiConfig: BaseApiConfig = {
  type: 'springboot',
  workspaceId: 'workspace-123',
  workspaceSlug: 'demoteste',
  name: 'bibliotheque',
  group: 'cv.igrp.demo',
  artifact: 'bibliotheque',
  description: 'Bibliotheque backend',
  database: 'Postgresql',
  projectStructureStyle: 'technical',
  enableObservability: true,
  enableEntityRevision: false,
  enableGraalVm: false,
};

const domainApiConfig: BaseApiConfig = {
  ...technicalApiConfig,
  name: 'simple',
  artifact: 'simple',
  projectStructureStyle: 'domain',
};

const autentikaApiConfig: BaseApiConfig = {
  ...technicalApiConfig,
  name: 'autentikaapi',
  artifact: 'autentikaapi',
  authMode: 'autentika',
};

const readFile = (projectPath: string, filePath: string) =>
  fs.readFile(path.join(projectPath, filePath), 'utf-8');

beforeAll(async () => {
  setEngineConfiguration({environment: 'development'});
  await fs.ensureDir(TMP_ROOT);
});

afterEach(async () => {
  await fs.emptyDir(TMP_ROOT);
});

afterAll(async () => {
  await fs.remove(TMP_ROOT);
});

describe('New API Module', () => {
  it('should generate standalone and workspace backend artifacts aligned with the workspace pattern', async () => {
    const projectPath = path.join(TMP_ROOT, 'bibliotheque');
    await fs.ensureDir(projectPath);

    await newApi(technicalApiConfig, projectPath);

    await expect(fs.pathExists(path.join(projectPath, 'docker-compose.yml'))).resolves.toBe(true);
    await expect(
      fs.pathExists(path.join(projectPath, 'igrp-compose-bibliotheque.yaml')),
    ).resolves.toBe(true);
    await expect(fs.pathExists(path.join(projectPath, '.env'))).resolves.toBe(true);
    await expect(fs.pathExists(path.join(projectPath, '.igrp.bibliotheque.env'))).resolves.toBe(
      true,
    );
    await expect(fs.pathExists(path.join(projectPath, 'db', 'init-database.sh'))).resolves.toBe(
      true,
    );
    await expect(fs.pathExists(path.join(projectPath, 'k8s', 'deployment.yaml'))).resolves.toBe(
      true,
    );
    await expect(fs.pathExists(path.join(projectPath, 'k8s', 'service.yaml'))).resolves.toBe(
      true,
    );
    await expect(fs.pathExists(path.join(projectPath, '.gitlab-ci.yml'))).resolves.toBe(true);

    await expect(fs.pathExists(path.join(projectPath, 'monitoring'))).resolves.toBe(false);
    await expect(fs.pathExists(path.join(projectPath, 'k8s', 'ingress.yaml'))).resolves.toBe(
      false,
    );
    await expect(fs.pathExists(path.join(projectPath, 'k8s', 'cluster.yaml'))).resolves.toBe(
      false,
    );

    const dockerCompose = await readFile(projectPath, 'docker-compose.yml');
    expect(dockerCompose).toContain('bibliotheque-postgres');
    expect(dockerCompose).toContain('condition: service_healthy');
    expect(dockerCompose).toContain(
      'SPRING_DATASOURCE_URL=jdbc:postgresql://${POSTGRES_SERVICE_NAME}:5432/${POSTGRES_DATABASE}',
    );
    expect(dockerCompose).not.toContain('tempo');
    expect(dockerCompose).not.toContain('promtail');
    expect(dockerCompose).not.toContain('loki');
    expect(dockerCompose).not.toContain('prometheus');
    expect(dockerCompose).toContain('- AUTH_JWT_ISSUER=${AUTH_JWT_ISSUER}');

    const igrpCompose = await readFile(projectPath, 'igrp-compose-bibliotheque.yaml');
    expect(igrpCompose).toContain('./.igrp.bibliotheque.env');
    expect(igrpCompose).toContain('demoteste-igrp_default');
    expect(igrpCompose).toContain('bibliotheque-db-prepare');
    expect(igrpCompose).toContain('workspace.slug: "demoteste"');
    expect(igrpCompose).toContain('workspace.id: "workspace-123"');
    expect(igrpCompose).toContain('- AUTH_PROVIDER=${AUTH_PROVIDER}');
    expect(igrpCompose).toContain('- AUTH_JWT_ISSUER=${AUTH_JWT_ISSUER}');

    const igrpEnv = await readFile(projectPath, '.igrp.bibliotheque.env');
    expect(igrpEnv).not.toContain('IGRP_WORKSPACE_SLUG=');
    expect(igrpEnv).not.toContain('IGRP_WORKSPACE_ID=');
    expect(igrpEnv).toContain('AUTH_PROVIDER=keycloak');
    expect(igrpEnv).toContain(
      'AUTH_JWT_ISSUER=http://${DOCKER_IP}:${NGINX_HTTP_PORT}/auth/realms/igrp',
    );
    expect(igrpEnv).toContain('OTEL_EXPORTER_OTLP_ENDPOINT=http://demoteste-otel-collector:4318');

    expect(dockerCompose).toContain('- AUTH_JWT_ISSUER=${AUTH_JWT_ISSUER}');

    const applicationProperties = await readFile(
      projectPath,
      path.join('src', 'main', 'resources', 'application.properties'),
    );
    expect(applicationProperties).toContain(
      'otel.exporter.otlp.endpoint=${OTEL_EXPORTER_OTLP_ENDPOINT}',
    );
    expect(applicationProperties).toContain(
      'spring.profiles.active=${SPRING_PROFILES_ACTIVE:development}',
    );

    const k8sService = await readFile(projectPath, path.join('k8s', 'service.yaml'));
    expect(k8sService).toContain('gateway.name: demoteste');

    const gitlabCi = await readFile(projectPath, '.gitlab-ci.yml');
    expect(gitlabCi).toContain('REGISTRY_PROJECT: "demoteste"');
    expect(gitlabCi).toContain('IMAGE_NAME: "bibliotheque"');
  });

  it('should still generate the domain project structure with the new backend base files', async () => {
    const projectPath = path.join(TMP_ROOT, 'simple');
    await fs.ensureDir(projectPath);

    await newApi(domainApiConfig, projectPath);

    await expect(
      fs.pathExists(path.join(projectPath, 'igrp-compose-simple.yaml')),
    ).resolves.toBe(true);
    await expect(fs.pathExists(path.join(projectPath, '.igrp.simple.env'))).resolves.toBe(true);
    await expect(fs.pathExists(path.join(projectPath, 'db', 'init-database.sh'))).resolves.toBe(
      true,
    );
    await expect(fs.pathExists(path.join(projectPath, 'monitoring'))).resolves.toBe(false);
  });

  it('should generate autentika-ready backend auth configuration without adding frontend auth variables', async () => {
    const projectPath = path.join(TMP_ROOT, 'autentikaapi');
    await fs.ensureDir(projectPath);

    await newApi(autentikaApiConfig, projectPath);

    const igrpEnv = await readFile(projectPath, '.igrp.autentikaapi.env');
    expect(igrpEnv).toContain('AUTH_PROVIDER=autentika');
    expect(igrpEnv).toContain('AUTH_JWT_ISSUER=${AUTENTIKA_ISSUER}');
    expect(igrpEnv).not.toContain('AUTENTIKA_CLIENT_ID=');
    expect(igrpEnv).not.toContain('AUTENTIKA_CLIENT_SECRET=');
    expect(igrpEnv).not.toContain('AUTENTIKA_HOST=');
    expect(igrpEnv).not.toContain('AUTENTIKA_SCOPES=');

    const igrpCompose = await readFile(projectPath, 'igrp-compose-autentikaapi.yaml');
    expect(igrpCompose).toContain('- AUTH_PROVIDER=${AUTH_PROVIDER}');
    expect(igrpCompose).toContain('- AUTH_JWT_ISSUER=${AUTH_JWT_ISSUER}');
    expect(igrpCompose).not.toContain('/auth/realms/igrp');

    const standaloneEnv = await readFile(projectPath, '.env');
    expect(standaloneEnv).toContain('AUTH_PROVIDER=autentika');
    expect(standaloneEnv).toContain('AUTH_JWT_ISSUER=https://your-autentika-host/auth/realms/your-realm');
  });
});
