/**
 * Inspect Generation
 *
 * Generates projects to C:\demo-spring and leaves them on disk for manual inspection.
 * No assertions — just run and open the files.
 *
 * Output lives outside the repo on purpose: these write ~170 files per project (plus
 * any mvn target/ if you build them), which as untracked noise inside __test__/ is a
 * hazard for `git add .`.
 *
 * The technical/domain configs mirror the real workspace projects (same group,
 * artifact and workspaceSlug as demo-training-workspace/projects/{bibliotheque,simple})
 * so the output can be diffed folder-for-folder against them.
 *
 * Projects generated:
 *   C:\demo-spring\tec        bibliotheque  (technical, keycloak)
 *   C:\demo-spring\domain     simple        (domain, keycloak)
 *   C:\demo-spring\autentika  authservice   (technical, autentika)
 */

import fs from 'fs-extra';
import path from 'path';
import {beforeAll, it} from '@jest/globals';
import {newApi, setEngineConfiguration} from '../src';
import {BaseApiConfig} from '../src/interfaces/types';

// Override with IGRP_INSPECT_OUTPUT to generate somewhere else.
const OUTPUT_ROOT = process.env.IGRP_INSPECT_OUTPUT ?? 'C:/demo-spring';

const technicalConfig: BaseApiConfig = {
  type: 'springboot',
  workspaceId: 'ws-001',
  workspaceSlug: 'demoteste',
  name: 'bibliotheque',
  group: 'cv.igrp',
  artifact: 'conteneurisation',
  description: 'Bibliotheque backend service',
  database: 'Postgresql',
  projectStructureStyle: 'technical',
  enableObservability: true,
  enableEntityRevision: true,
  enableGraalVm: false,
};

const domainConfig: BaseApiConfig = {
  ...technicalConfig,
  name: 'simple',
  artifact: 'simple',
  description: 'Simple domain service',
  projectStructureStyle: 'domain',
};

const autentikaConfig: BaseApiConfig = {
  ...technicalConfig,
  name: 'authservice',
  artifact: 'authservice',
  description: 'Auth service (autentika)',
  authMode: 'autentika',
};

beforeAll(() => {
  setEngineConfiguration({environment: 'development'});
});

it('generate technical project (bibliotheque)', async () => {
  const projectPath = path.join(OUTPUT_ROOT, 'tec');
  await fs.remove(projectPath);
  await fs.ensureDir(projectPath);
  await newApi(technicalConfig, projectPath);
}, 30_000);

it('generate domain project (simple)', async () => {
  const projectPath = path.join(OUTPUT_ROOT, 'domain');
  await fs.remove(projectPath);
  await fs.ensureDir(projectPath);
  await newApi(domainConfig, projectPath);
}, 30_000);

it('generate autentika project (authservice)', async () => {
  const projectPath = path.join(OUTPUT_ROOT, 'autentika');
  await fs.remove(projectPath);
  await fs.ensureDir(projectPath);
  await newApi(autentikaConfig, projectPath);
}, 30_000);
