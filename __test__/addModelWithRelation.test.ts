import { ModelConfig } from '../src/interfaces/types';
import { addModel } from '../src';
// @ts-ignore
import { DOMAIN_OUTPUT_DIR } from './outputDirPath';

describe('Model generator', () => {
  it('should create model for DDD with OneToOne Mapping', async () => {
    const oneToOne: ModelConfig[] = [
      {
        id: 'mgg6olyps8',
        type: 'model',
        name: 'origem',
        tableName: 'origem',
        module: 'core',
        attributes: [
          {
            type: 'integer',
            name: 'id',
            primaryKey: true,
            generationType: 'IDENTITY',
            nullable: false,
          },
          {
            type: 'relation',
            name: 'destinof',
            relation: {
              type: 'OneToOne',
              fetchType: 'lazy',
              cardinality: 'twoWay',
              referencedColumnName: 'id',
              entity: 'destino',
            },
            nullable: true,
          },
        ],
        crud: false,
        audit: false,
      },
      {
        id: 'dspza5xl7e',
        type: 'model',
        name: 'destino',
        tableName: 'destino',
        module: 'core',
        attributes: [
          {
            type: 'integer',
            name: 'id',
            primaryKey: true,
            generationType: 'IDENTITY',
            nullable: false,
          },
        ],
        relationReference: [
          {
            type: 'OneToOne',
            fetchType: 'lazy',
            entity: 'Origem',
            fieldName: 'origemId', // nome do campo na tabela destino deve ser inserido para casos de multiplos foreign keys
            mappedBy: "destinof" // nome do campo(java) na entidade origem
          },
        ],
        crud: false,
        audit: false,
      },
    ];

    for (const testCase of oneToOne) {
      await addModel(testCase, DOMAIN_OUTPUT_DIR);
    }
  });

  it('should create model for DDD with OneToMany Mapping', async () => {
    const OneToMany: ModelConfig[] = [
      {
        id: 'mgg6olyps8',
        type: 'model',
        name: 'origem',
        tableName: 'origem',
        module: 'core',
        attributes: [
          {
            type: 'integer',
            name: 'id',
            primaryKey: true,
            generationType: 'IDENTITY',
            nullable: false,
          },
          {
            type: 'relation',
            name: 'destino',
            relation: {
              type: 'OneToMany',
              fetchType: 'lazy',
              cardinality: 'twoWay',
              referencedColumnName: 'id',
              mappedBy: 'origemf',
              entity: 'destino',
            },
            nullable: true,
          },
        ],
        crud: false,
        audit: false,
      },
      {
        id: 'dspza5xl7e',
        type: 'model',
        name: 'destino',
        tableName: 'destino',
        module: 'core',
        attributes: [
          {
            type: 'integer',
            name: 'id',
            primaryKey: true,
            generationType: 'IDENTITY',
            nullable: false,
          },
        ],
        relationReference: [
          {
            type: 'OneToMany',
            fetchType: 'lazy',
            entity: 'Origem',
            fieldName: 'origemf' // nome do campo a ser criado na tabela destino. deve ser inserido para casos de multiplos foreign keys
          },
        ],
        crud: false,
        audit: false,
      },
    ];

    for (const testCase of OneToMany) {
      await addModel(testCase, DOMAIN_OUTPUT_DIR);
    }
  });

  it('should create model for DDD with ManyToOne Mapping', async () => {
    const ManyToOne: ModelConfig[] = [
      {
        id: 'mgg6olyps8',
        type: 'model',
        name: 'origem',
        tableName: 'origem',
        module: 'core',
        attributes: [
          {
            type: 'integer',
            name: 'id',
            primaryKey: true,
            generationType: 'IDENTITY',
            nullable: false,
          },
          {
            type: 'relation',
            name: 'destino',
            relation: {
              type: 'ManyToOne',
              fetchType: 'lazy',
              cardinality: 'twoWay',
              referencedColumnName: 'id',
              mappedBy: 'origemf',
              entity: 'destino',
            },
            nullable: true,
          },
        ],
        crud: false,
        audit: false,
      },
      {
        id: 'dspza5xl7e',
        type: 'model',
        name: 'destino',
        tableName: 'destino',
        module: 'core',
        attributes: [
          {
            type: 'integer',
            name: 'id',
            primaryKey: true,
            generationType: 'IDENTITY',
            nullable: false,
          },
        ],
        relationReference: [
          {
            type: 'ManyToOne',
            fetchType: 'lazy',
            entity: 'Origem',
            mappedBy: 'destino', // same name as java attribute in source relation
            fieldName: 'origemf' // nome do campo a ser criado na tabela destino. deve ser inserido para casos de multiplos foreign keys
          },
        ],
        crud: false,
        audit: false,
      },
    ];

    for (const testCase of ManyToOne) {
      await addModel(testCase, DOMAIN_OUTPUT_DIR);
    }
  });

  it('should create model for DDD with ManyToMany Mapping', async () => {
    const ManyToOne: ModelConfig[] = [
      {
        id: 'mgg6olyps8',
        type: 'model',
        name: 'origem',
        tableName: 'origem',
        module: 'core',
        attributes: [
          {
            type: 'integer',
            name: 'id',
            primaryKey: true,
            generationType: 'IDENTITY',
            nullable: false,
          },
          {
            type: 'relation',
            name: 'destino',
            relation: {
              type: 'ManyToMany',
              fetchType: 'lazy',
              cardinality: 'twoWay',
              referencedColumnName: 'id',
              entity: 'destino',
              joinTable: 'origem_destino',
              inverseJoinColumn: 'origemId',
              fieldName: 'destinos'
            },
            nullable: true,
          },
        ],
        crud: false,
        audit: false,
      },
      {
        id: 'dspza5xl7e',
        type: 'model',
        name: 'destino',
        tableName: 'destino',
        module: 'core',
        attributes: [
          {
            type: 'integer',
            name: 'id',
            primaryKey: true,
            generationType: 'IDENTITY',
            nullable: false,
          },
        ],
        relationReference: [
          {
            type: 'ManyToMany',
            fetchType: 'lazy',
            entity: 'Origem',
            mappedBy: 'destino', // same name as java attribute in source relation
            fieldName: 'origemf' // nome do campo a ser criado na tabela destino. deve ser inserido para casos de multiplos foreign keys
          },
        ],
        crud: false,
        audit: false,
      },
    ];

    for (const testCase of ManyToOne) {
      await addModel(testCase, DOMAIN_OUTPUT_DIR);
    }
  });
});
