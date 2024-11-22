import fs from 'fs-extra';
import { addDTO } from '../src';
import { DTOConfig } from '../src/interfaces/types';

const OUTPUT_DIR = 'generatedTest';

beforeAll(async () => {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
});

describe('DTO generator', () => {
  /*it('should generate a classic command DTO with declared fields', async () => {
    const model: DTOConfig = {
      module: 'CarRental',
      type: 'command',
      name: 'CreateRental',
      template: 'classic',
      attributes: [
        { type: 'Long', ns: 'java', name: 'id', primaryKey: true },
        { type: 'String', ns: 'java', name: 'customerName' },
        { type: 'String', ns: 'java', name: 'carModel' },
      ],
    };

    await addDTO(model, OUTPUT_DIR);
  });*/

  /*it('should generate a record command DTO with declared fields', async () => {
    const model: DTOConfig = {
      aggregate: 'CarRental',
      type: 'command',
      name: 'CreateRental',
      template: 'record',
      attributes: [
        { type: 'Long', ns: 'java', name: 'id', primaryKey: true },
        { type: 'String', ns: 'java', name: 'customerName' },
        { type: 'String', ns: 'java', name: 'carModel' },
      ],
    };

    await addDTO(model, OUTPUT_DIR);
  });*/

  /*it('should generate a classic command DTO with declared fields', async () => {
    const model: DTOConfig = {
      module: 'CarRental',
      type: 'command',
      name: 'UpdateRental',
      template: 'classic',
      attributes: [
        { type: 'Long', ns: 'java', name: 'id', primaryKey: true },
        { type: 'String', ns: 'java', name: 'customerName' },
        { type: 'String', ns: 'java', name: 'carModel' },
      ],
    };

    await addDTO(model, OUTPUT_DIR);
  });*/

  /*it('should generate a record command DTO with declared fields', async () => {
    const model: DTOConfig = {
      aggregate: 'CarRental',
      type: 'command',
      name: 'UpdateRental',
      template: 'record',
      attributes: [
        { type: 'Long', ns: 'java', name: 'id', primaryKey: true },
        { type: 'String', ns: 'java', name: 'customerName' },
        { type: 'String', ns: 'java', name: 'carModel' },
      ],
    };

    await addDTO(model, OUTPUT_DIR);
  });*/

  it('should generate a classic event DTO with declared fields', async () => {
    const model: DTOConfig = {
      module: 'CarRental',
      type: 'event',
      name: 'RentalCreated',
      template: 'classic',
      attributes: [
        { type: 'Long', ns: 'java', name: 'id', primaryKey: true, required: false },
        { type: 'String', ns: 'java', name: 'customerName', required: false },
        { type: 'LocalDate', ns: 'java', name: 'rentalDate', required: false },
      ],
    };

    await addDTO(model, OUTPUT_DIR);
  });

  /*it('should generate a record event DTO with declared fields', async () => {
    const model: DTOConfig = {
      aggregate: 'CarRental',
      type: 'event',
      name: 'RentalCreated',
      template: 'record',
      attributes: [
        { type: 'Long', ns: 'java', name: 'id', primaryKey: true },
        { type: 'String', ns: 'java', name: 'customerName' },
        { type: 'LocalDate', ns: 'java', name: 'rentalDate' },
      ],
    };

    await addDTO(model, OUTPUT_DIR);
  });*/

  /*it('should generate a classic domain entity DTO with declared fields', async () => {
    const model: DTOConfig = {
      module: 'CarRental',
      type: 'domainentity',
      name: 'Rental',
      template: 'classic',
      attributes: [
        { type: 'Long', ns: 'java', name: 'id', primaryKey: true },
        { type: 'String', ns: 'java', name: 'customerName' },
        { type: 'String', ns: 'java', name: 'carModel' },
        { type: 'LocalDate', ns: 'java', name: 'rentalDate' },
      ],
    };

    await addDTO(model, OUTPUT_DIR);
  });*/

  /*it('should generate a record data object DTO with declared fields', async () => {
    const model: DTOConfig = {
      aggregate: 'CarRental',
      type: 'dataobject',
      name: 'Rental',
      template: 'record',
      attributes: [
        { type: 'Long', ns: 'java', name: 'id', primaryKey: true },
        { type: 'String', ns: 'java', name: 'customerName' },
        { type: 'String', ns: 'java', name: 'carModel' },
        { type: 'LocalDate', ns: 'java', name: 'rentalDate' },
      ],
    };

    await addDTO(model, OUTPUT_DIR);
  });*/

  /*it('should generate a classic domain entity DTO with declared fields', async () => {
    const model: DTOConfig = {
      module: 'CarRental',
      type: 'domainentity',
      name: 'Car',
      template: 'classic',
      attributes: [
        { type: 'Long', ns: 'java', name: 'id', primaryKey: true },
        { type: 'String', ns: 'java', name: 'carBrand' },
        { type: 'String', ns: 'java', name: 'carModel' },
        { type: 'String', ns: 'java', name: 'carPlate' },
        { type: 'String', ns: 'java', name: 'registrationDate' },
      ],
    };

    await addDTO(model, OUTPUT_DIR);
  });*/

  /*it('should generate a classic value object DTO with declared fields', async () => {
    const model: DTOConfig = {
      module: 'CarRental',
      type: 'valueobject',  // 'valueobject' type for a DDD value object
      name: 'CarRentalInfo', // Value object name that reflects the domain concept
      template: 'classic',
      attributes: [
        { type: 'String', ns: 'java', name: 'carBrand' },         // Immutable field representing car brand
        { type: 'String', ns: 'java', name: 'carModel' },         // Immutable field representing car model
        { type: 'String', ns: 'java', name: 'carPlate' },         // Immutable field for car plate
        { type: 'String', ns: 'java', name: 'registrationDate' },   // Immutable field for registration date
      ],
    };

    await addDTO(model, OUTPUT_DIR);
  });*/

  /*it('should generate a GetRental query DTO with declared fields', async () => {
    const model: DTOConfig = {
      module: 'CarRental',
      type: 'query',  // Type set to 'query' for a query DTO
      name: 'GetRental', // Query name
      template: 'classic',
      attributes: [
        { type: 'Long', ns: 'java', name: 'rentalId' },          // Field for rental ID filter
        { type: 'String', ns: 'java', name: 'carPlate' },         // Field for car plate filter
      ],
    };

    await addDTO(model, OUTPUT_DIR);
  });


  it('should generate a GetAllRentals query DTO with declared fields', async () => {
    const model: DTOConfig = {
      module: 'CarRental',
      type: 'query',  // Type set to 'query' for a query DTO
      name: 'GetAllRentals', // Query name
      template: 'classic',
      attributes: [
        { type: 'String', ns: 'java', name: 'carBrand' },        // Field for car brand filter
        { type: 'String', ns: 'java', name: 'carModel' },        // Field for car model filter
        { type: 'String', ns: 'java', name: 'carPlate' },        // Field for car plate filter
        { type: 'String', ns: 'java', name: 'registrationDate' },  // Field for registration date filter
      ],
    };

    await addDTO(model, OUTPUT_DIR);
  });*/

  it('should generate a Rental DataTransferObject with declared fields', async () => {
    const model: DTOConfig = {
      module: 'CarRental',
      type: 'dto', // Type set to 'dto' for a DTO
      name: 'Rental', // DTO name
      template: 'classic',
      attributes: [
        { type: 'Long', ns: 'java', name: 'rentalId', primaryKey: true, required: false },    // Primary key for the rental
        { type: 'Long', ns: 'java', name: 'carId', required: false },                          // Field for car ID
        { type: 'String', ns: 'java', name: 'customerName', required: false },                 // Field for the customer name
        { type: 'String', ns: 'java', name: 'rentalStartDate', required: false },                // Field for rental start date
        { type: 'String', ns: 'java', name: 'rentalEndDate', required: false },                  // Field for rental end date
        { type: 'String', ns: 'java', name: 'rentalStatus', required: false },                 // Field for rental status
        { type: 'BigDecimal', ns: 'java', name: 'rentalPrice', required: false },              // Field for rental price
      ],
    };

    await addDTO(model, OUTPUT_DIR);
  });

  it('should generate DTOs with proper Jakarta Validation annotations for various scenarios', async () => {
    const testCases: DTOConfig[] = [
      {
        module: 'CarRental',
        type: 'dto',
        name: 'Rental',
        template: 'classic',
        attributes: [
          { type: 'Long', ns: 'java', name: 'rentalId', primaryKey: true, required: true },
          { type: 'String', ns: 'java', name: 'customerName', required: true, minLength: 3, maxLength: 50 },
          { type: 'BigDecimal', ns: 'java', name: 'rentalPrice', positive: true, required: true },
          { type: 'String', ns: 'java', name: 'rentalStatus', regex: '^(ACTIVE|CANCELLED|COMPLETED)$', required: false },
        ],
      },
      {
        module: 'CarRental',
        type: 'dto',
        name: 'User',
        template: 'classic',
        attributes: [
          { type: 'String', ns: 'java', name: 'username', required: true, minLength: 5, maxLength: 20 },
          { type: 'String', ns: 'java', name: 'email', isEmail: true, required: true },
          { type: 'LocalDate', ns: 'java', name: 'dateOfBirth', before: true, required: false },
        ],
      },
      {
        module: 'CarRental',
        type: 'dto',
        name: 'Endpoint',
        template: 'classic',
        attributes: [
          { type: 'String', ns: 'java', name: 'url', isUrl: true, required: true },
          { type: 'String', ns: 'java', name: 'regexPattern', regex: '^https?://.*', required: false },
        ],
      },
      {
        module: 'CarRental',
        type: 'dto',
        name: 'Transaction',
        template: 'classic',
        attributes: [
          { type: 'Long', ns: 'java', name: 'transactionId', primaryKey: true, required: false },
          { type: 'BigDecimal', ns: 'java', name: 'amount', positive: true, required: true, minLength: 1 },
          { type: 'LocalDate', ns: 'java', name: 'transactionDate', after: true, required: false },
        ],
      },
    ];

    for (const testCase of testCases) {
      await addDTO(testCase, OUTPUT_DIR);
    }

    // Assertions for annotations can be done by reading the generated DTO files
    // and validating their content matches the expected output for each case.
  });



});