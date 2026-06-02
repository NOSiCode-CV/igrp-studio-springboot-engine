/**
 * Inspect Generation
 *
 * Generates projects to __test__/output/ and leaves them on disk for manual inspection.
 * No assertions — just run and open the files.
 *
 * Projects generated:
 *   __test__/output/bibliotheque   (technical, keycloak)
 *   __test__/output/catalog        (domain, keycloak)
 *   __test__/output/authservice    (technical, autentika)
 */

import fs from 'fs-extra';
import path from 'path';
import {beforeAll, it} from '@jest/globals';
import {newApi, setEngineConfiguration} from '../src';
import {BaseApiConfig} from '../src/interfaces/types';

const OUTPUT_ROOT = path.join(process.cwd(), '__test__', 'output');

const technicalConfig: BaseApiConfig = {
  type: 'springboot',
  workspaceId: 'ws-001',
  workspaceSlug: 'demoteste',
  name: 'bibliotheque',
  group: 'cv.igrp.demo',
  artifact: 'bibliotheque',
  description: 'Bibliotheque backend service',
  database: 'Postgresql',
  projectStructureStyle: 'technical',
  enableObservability: true,
  enableEntityRevision: false,
  enableGraalVm: false,
};

const domainConfig: BaseApiConfig = {
  ...technicalConfig,
  name: 'catalog',
  artifact: 'catalog',
  description: 'Catalog domain service',
  projectStructureStyle: 'domain',
};

const autentikaConfig: BaseApiConfig = {
  ...technicalConfig,
  name: 'authservice',
  artifact: 'authservice',
  authMode: 'autentika',
};

beforeAll(() => {
  setEngineConfiguration({environment: 'development'});
});

it('generate technical project (bibliotheque)', async () => {
  const projectPath = path.join(OUTPUT_ROOT, 'bibliotheque');
  await fs.remove(projectPath);
  await fs.ensureDir(projectPath);
  await newApi(technicalConfig, projectPath);
}, 30_000);

it('generate domain project (catalog)', async () => {
  const projectPath = path.join(OUTPUT_ROOT, 'catalog');
  await fs.remove(projectPath);
  await fs.ensureDir(projectPath);
  await newApi(domainConfig, projectPath);
}, 30_000);

it('generate autentika project (authservice)', async () => {
  const projectPath = path.join(OUTPUT_ROOT, 'authservice');
  await fs.remove(projectPath);
  await fs.ensureDir(projectPath);
  await newApi(autentikaConfig, projectPath);
}, 30_000);
