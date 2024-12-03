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
      pathVariables: [{ type: 'string', name: 'value', isRequired: true }],//[{ type: 'Long', name: 'rentalId' }],
      requestParams: [{ type: 'string', name: 'param', isRequired: false }],//[{ type: 'string', name: 'carPlate' }],
      response: 'TesteDTO',
    },
    {
      path: 'getRental',
      method: 'GET',
      actionName: 'GetRental',
      pathVariables: [{ type: 'string', name: 'value', isRequired: false }],//[{ type: 'Long', name: 'rentalId' }],
      requestParams: [{ type: 'string', name: 'param', isRequired: true }],//[{ type: 'string', name: 'carPlate' }],
      response: 'TesteDTO',
    },
    {
      path: 'getAllRentals',
      method: 'GET',
      actionName: 'GetAllRentals',
      pathVariables: [],
      modelAttribute: 'TesteDTO',
      requestParams: [
        { type: 'string', name: 'carBrand', isRequired: false },
        { type: 'string', name: 'carModel', isRequired: true },
        { type: 'string', name: 'carPlate', isRequired: false },
        { type: 'string', name: 'registrationDate', isRequired: true },
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
