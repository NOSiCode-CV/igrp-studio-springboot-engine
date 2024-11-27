import fs from 'fs-extra';
import { addController } from '../src';
import { ControllerConfig } from '../src/interfaces/types';

const OUTPUT_DIR = 'C:\\spring-engine\\generatedNewVersion'
const controllerConfig: ControllerConfig = {
  type: 'controller',
  name: 'CarRental',
  basePath: 'rental',
  actions: [
    {
      path: 'createRental',
      method: 'POST',
      actionName: 'CreateRental',
      accepts: 'application/json',
      requestBody: 'TesteDTO',
      response: 'TesteDTO',
    },
    {
      path: 'updateRental',
      method: 'PUT',
      accepts: 'application/json',
      actionName: 'UpdateRental',
      requestBody: 'TesteDTO',
      response: 'TesteDTO',
    },
    {
      path: 'getRental',
      method: 'GET',
      actionName: 'GetRental',
      pathVariables: [],//[{ type: 'Long', name: 'rentalId' }],
      requestParams: [],//[{ type: 'string', name: 'carPlate' }],
      response: 'TesteDTO',
    },
    {
      path: 'getAllRentals',
      method: 'GET',
      actionName: 'GetAllRentals',
      pathVariables: [],
      requestParams: [
        { type: 'string', name: 'carBrand' },
        { type: 'string', name: 'carModel' },
        { type: 'string', name: 'carPlate' },
        { type: 'string', name: 'registrationDate' },
      ],
      response: 'List<TesteDTO>',
    },
  ],
};

beforeAll(async () => {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
});

afterAll(async () => {
  // await fs.rm(OUTPUT_DIR, { recursive: true });
});

describe('Controller Module', () => {
  it('should create the controller class and the service interface', async () => {
    await addController(controllerConfig, OUTPUT_DIR);
  });
});
