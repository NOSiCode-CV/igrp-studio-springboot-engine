import fs from 'fs-extra';
import { addController, addCrudController } from '../src';
import { ControllerConfig, CrudControllerConfig } from '../src/interfaces/types';
// @ts-ignore
import { DOMAIN_OUTPUT_DIR, TECHNICAL_OUTPUT_DIR, TEST_OUTPUT_DIR } from './outputDirPath';

const domainCrudControllerConfig: CrudControllerConfig | undefined = undefined

const technicalCrudControllerConfig: CrudControllerConfig = {
  id: "3aev3b5m2l",
  type: "crud-controller",
  name: "UsersCrud",
  basePath: "users_crud",
  description: "CRUD Controller for managing users",
  models: [
    {
      modelName: "sfk6hpjtcg", // User
      fields: [{ name: 'username' }, { name: 'userLevelNew' }]
    },
    {
      modelName: "ylmvzj5cuy", // Contact
      fields: [{ name: 'email' }, { name: 'phoneNumber' }]
    },
  ],
  methods: {
    create: true,
    read: true,
    update: true,
    delete: true
  }
};

beforeAll(async () => {
  await fs.mkdir(TECHNICAL_OUTPUT_DIR, { recursive: true });
  await fs.mkdir(DOMAIN_OUTPUT_DIR, { recursive: true });
});

afterAll(async () => {
  // await fs.rm(OUTPUT_DIR, { recursive: true });
});

describe('Domain Controller Module', () => {
  it('should create the controller class and the handlers in domain driven design style', async () => {
    //await addCrudController(domainCrudControllerConfig, DOMAIN_OUTPUT_DIR);
  });
});

describe('Technical Controller Module', () => {
  it('should create the controller class and the service interface in technical style', async () => {
    await addCrudController(technicalCrudControllerConfig, TECHNICAL_OUTPUT_DIR);
  });
});