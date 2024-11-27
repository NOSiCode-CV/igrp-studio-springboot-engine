import fs from 'fs-extra';
import { addDTO } from '../src';
import { DTOConfig } from '../src/interfaces/types';

const OUTPUT_DIR = 'C:\\spring-engine\\generatedTest';
const HUB_DIR = 'C:\\Users\\marcelo.monteiro\\IdeaProjects\\inss-sisgb-portal-integration-hub-service';

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

  it('should generate DTOs for integration hub', async () => {
    const testCases: DTOConfig[] = [
      {
        module: 'reembolso',
        type: 'dto',
        name: 'DadosFactura',
        template: 'record',
        attributes: [
          { type: 'String', ns: 'java', name: 'valor', required: false },
          { type: 'String', ns: 'java', name: 'medico', required: false },
          { type: 'String', ns: 'java', name: 'farmacia', required: false },
        ],
      },
      {
        module: 'shared',
        type: 'dto',
        name: 'Documento',
        template: 'record',
        attributes: [
          { type: 'String', ns: 'java', name: 'tipoDocumento', required: true },
          { type: 'String', ns: 'java', name: 'ficheiro', required: true }
        ],
      },
      {
        module: 'reembolso',
        type: 'dto',
        name: 'Refund',
        template: 'record',
        attributes: [
          { type: 'String', ns: 'java', name: 'tipoPedido', required: false },
          { type: 'String', ns: 'java', name: 'numUtente', required: false },
          { type: 'String', ns: 'java', name: 'tipoUtente', required: false },
          { type: 'DadosFacturaDTO', ns: 'dto', name: 'dadosFactura', required: false },
          { type: 'String', ns: 'java', name: 'origemPedido', required: false },
          { type: 'String', ns: 'java', name: 'dataPrescricao', required: false },
          { type: 'String', ns: 'java', name: 'observacoes', required: false },
          { type: 'DocumentoDTO', ns: 'dto', name: 'documentos', required: false, collectionType: 'list' },



        ],
      },

      {
        module: 'subsidiofuneral',
        type: 'dto',
        name: 'IdentificacaoRequerente',
        template: 'record',
        attributes: [
          { type: 'String', ns: 'java', name: 'tipo_documento_req', required: true },
          { type: 'String', ns: 'java', name: 'numero_doc_req', required: true },
          { type: 'String', ns: 'java', name: 'data_nascimento_req', required: true },
          { type: 'String', ns: 'java', name: 'nome_pai_req', required: true },
          { type: 'String', ns: 'java', name: 'nome_mae_req', required: true }
        ],
      },
      {
        module: 'subsidiofuneral',
        type: 'dto',
        name: 'IdentificacaoFalecido',
        template: 'record',
        attributes: [
          { type: 'String', ns: 'java', name: 'num_utente', required: true },
          { type: 'String', ns: 'java', name: 'nome_utente', required: true },
          { type: 'String', ns: 'java', name: 'data_nascimento', required: true },
          { type: 'String', ns: 'java', name: 'data_obito', required: true },
          { type: 'String', ns: 'java', name: 'tipo_utente', required: true }
        ],
      },

      {
        module: 'subsidiofuneral',
        type: 'dto',
        name: 'SubsidioFuneral',
        template: 'record',
        attributes: [
          { type: 'String', ns: 'java', name: 'tipo_subsidio', required: true },
          { type: 'String', ns: 'java', name: 'observacoes', required: false },
          { type: 'IdentificacaoFalecidoDTO', ns: 'dto', name: 'identificacao_falecido', required: true },
          { type: 'IdentificacaoRequerenteDTO', ns: 'dto', name: 'identificacao_requerente', required: true },
          { type: 'DocumentoDTO', ns: 'dto', name: 'documentos', required: false, collectionType: 'map', minLength: 1 },
        ],
      },

      {
        module: 'shared',
        type: 'dto',
        name: 'Utente',
        template: 'record',
        attributes: [
          { type: 'Long', ns: 'java', name: 'id', required: false },
          { type: 'Long', ns: 'java', name: 'idGeografiaNat', required: false },
          { type: 'String', ns: 'java', name: 'nome', required: false },
          { type: 'String', ns: 'java', name: 'cidnome', required: false },
          { type: 'String', ns: 'java', name: 'naturalidade', required: false },
          { type: 'String', ns: 'java', name: 'dataNascimento', required: false },
          { type: 'String', ns: 'java', name: 'nomePai', required: false },
          { type: 'String', ns: 'java', name: 'nomeMae', required: false },
          { type: 'String', ns: 'java', name: 'numSegurado', required: false },
        ],
      },

      {
        module: 'shared',
        type: 'dto',
        name: 'Empresa',
        template: 'record',
        attributes: [
          { type: 'Long', ns: 'java', name: 'id', required: false },
          { type: 'String', ns: 'java', name: 'estatutoJuridico', required: false },
          { type: 'String', ns: 'java', name: 'denominacaoSocial', required: false },
          { type: 'String', ns: 'java', name: 'cidNom', required: false },
          { type: 'String', ns: 'java', name: 'numeroContribuinte', required: false },
          { type: 'String', ns: 'java', name: 'idTipoDocumento', required: false },
        ],
      },

      {
        module: 'shared',
        type: 'dto',
        name: 'UtenteDeceased',
        template: 'record',
        attributes: [
          { type: 'Long', ns: 'java', name: 'id', required: false },
          { type: 'String', ns: 'java', name: 'cidnome', required: false },
          { type: 'String', ns: 'java', name: 'dataNascimento', required: false },
          { type: 'String', ns: 'java', name: 'dataFalecimento', required: false },
          { type: 'String', ns: 'java', name: 'numero', required: false },
          { type: 'String', ns: 'java', name: 'idtipoUtente', required: false },
        ],
      },

    ];

    for (const testCase of testCases) {
      await addDTO(testCase, HUB_DIR);
    }

    // Assertions for annotations can be done by reading the generated DTO files
    // and validating their content matches the expected output for each case.
  });

  it('should create DTO', async() => {
    const testCases: DTOConfig[] = [
      {
        "type": "dto",
        "module": "shared",
        "name": "Teste",
        "template": "classic",
        "attributes": [
          {
            "name": "id",
            "ns": "java",
            "type": "boolean",
            "required": false,
            "before": false,
            "after": false,
            "positive": false,
            "isEmail": false,
            "isUrl": false,
            "primaryKey": true
          },
          {
            "name": "teatew21",
            "ns": "java",
            "type": "long",
            "required": true
          },
          {
            "name": "qwewre",
            "ns": "java",
            "type": "biginteger",
            "required": false
          },
          {
            "name": "eweiop",
            "ns": "java",
            "type": "datetime",
            "required": true,
            "collectionType": "list"
          },
          {
            "name": "wqerwteyui",
            "ns": "java",
            "type": "date",
            "required": true,
            "collectionType": "set"
          },
          {
            "name": "wrteyruio",
            "ns": "java",
            "type": "byte",
            "isEmail": true,
            "required": true
          }
        ]
      }
    ];

    for (const testCase of testCases) {
      await addDTO(testCase, OUTPUT_DIR);
    }
  })


});