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
        { type: 'Long', ns: 'java', name: 'id', primaryKey: true },
        { type: 'String', ns: 'java', name: 'customerName' },
        { type: 'LocalDate', ns: 'java', name: 'rentalDate' },
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
        { type: 'Long', ns: 'java', name: 'rentalId', primaryKey: true },    // Primary key for the rental
        { type: 'Long', ns: 'java', name: 'carId' },                          // Field for car ID
        { type: 'String', ns: 'java', name: 'customerName' },                 // Field for the customer name
        { type: 'String', ns: 'java', name: 'rentalStartDate' },                // Field for rental start date
        { type: 'String', ns: 'java', name: 'rentalEndDate' },                  // Field for rental end date
        { type: 'String', ns: 'java', name: 'rentalStatus' },                 // Field for rental status
        { type: 'BigDecimal', ns: 'java', name: 'rentalPrice' },              // Field for rental price
      ],
    };

    await addDTO(model, OUTPUT_DIR);
  });


});