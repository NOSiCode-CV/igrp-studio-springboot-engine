import fs from 'fs-extra';
import { addController } from '../src';
import { ControllerConfig } from '../src/interfaces/types';

const OUTPUT_DIR = 'generatedTest';
const controllerConfig: ControllerConfig = {
  type: 'controller',
  name: 'CarRental',
  basePath: 'rental',
  module: 'CarRental',
  actions: [
    {
      path: 'createRental',
      method: 'POST',
      actionName: 'CreateRental',
      accepts: 'application/json',
      requestBody: 'RentalDTO',
      response: 'RentalDTO',
    },
    {
      path: 'updateRental',
      method: 'PUT',
      accepts: 'application/json',
      actionName: 'UpdateRental',
      requestBody: 'RentalDTO',
      response: 'RentalDTO',
    },
    {
      path: 'getRental',
      method: 'GET',
      actionName: 'GetRental',
      pathVariables: [],//[{ type: 'Long', name: 'rentalId' }],
      requestParams: [],//[{ type: 'String', name: 'carPlate' }],
      response: 'RentalDTO',
    },
    {
      path: 'getAllRentals',
      method: 'GET',
      actionName: 'GetAllRentals',
      pathVariables: [],
      requestParams: [
        { type: 'String', name: 'carBrand' },
        { type: 'String', name: 'carModel' },
        { type: 'String', name: 'carPlate' },
        { type: 'String', name: 'registrationDate' },
      ],
      response: 'List<RentalDTO>',
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
