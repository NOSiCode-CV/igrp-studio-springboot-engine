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
        name: 'Pessoa',
        tableName: 't_pessoa',
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
            type: 'string',
            name: 'nome',
          },
          {
            type: 'relation',
            name: 'documento', // relation field name
            relation: {
              type: 'OneToOne',
              fetchType: 'lazy',
              cardinality: 'twoWay',
              referencedColumnName: 'id',
              joinColumn: 'doc_id',
              entity: 'DocumentoIdentidade',
              orphanRemoval: true,
              cascadeType: [{ type: 'ALL' }]
            },
            nullable: false,
            unique: true
          },
        ],
        crud: false,
        audit: false,
      },
      {
        id: 'dspza5xl7e',
        type: 'model',
        name: 'DocumentoIdentidade',
        tableName: 't_documentoIdentidade',
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
            type: 'string',
            name: 'numero',
          }
        ],
        relationReference: [
          {
            type: 'OneToOne',
            fetchType: 'lazy',
            entity: 'Pessoa',
            fieldName: 'pessoa',
            mappedBy: "documento" // same name as java attribute in source relation
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
        name: 'Autor',
        tableName: 't_autor',
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
            type: 'string',
            name: 'name',
            primaryKey: false,
            defaultValue: 'ASD',
            length: 255,
            nullable: false,
          },
          {
            type: 'relation',
            name: 'livro',
            relation: {
              type: 'OneToMany',
              fetchType: 'lazy',
              cardinality: 'twoWay',
              referencedColumnName: 'id',
              joinColumn: 'autor_id',
              mappedBy: 'autor', // "inverse side field name
              entity: 'Livro',
              orphanRemoval: true,
              cascadeType: [{ type: 'ALL' }]
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
        name: 'Livro',
        tableName: 't_livro',
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
            entity: 'Autor',
            fieldName: 'autor',// field name
            joinColumn: 'autor_id'
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
        name: 'TransacaoPagamento',
        tableName: 't_transacaoPagamento',
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
            type: 'integer',
            name: 'valor',
          },
          {
            type: 'relation',
            name: 'cliente', // field name
            relation: {
              type: 'ManyToOne',
              fetchType: 'lazy',
              cardinality: 'twoWay',
              referencedColumnName: 'id',
              joinColumn: 'cliente_id',
              entity: 'Cliente',

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
        name: 'Cliente',
        tableName: 't_cliente',
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
            type: 'string',
            name: 'nome',
          }
        ],
        relationReference: [
          {
            type: 'ManyToOne',
            fetchType: 'lazy',
            entity: 'TransacaoPagamento',
            mappedBy: 'cliente', // same name as java attribute in source relation
            fieldName: 'transacoes', // nome do campo a ser criado na tabela destino. deve ser inserido para casos de multiplos foreign keys
            orphanRemoval: true,
            cascadeType: [{ type: 'REMOVE' }, { type: 'PERSIST' }]
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
    const ManyToMany: ModelConfig[] = [
      {
        id: 'mgg6olyps8',
        type: 'model',
        name: 'Estudante',
        tableName: 't_estudante',
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
            type: 'string',
            name: 'nome'
          },
          {
            type: 'relation',
            name: 'disciplina', // field name
            relation: {
              type: 'ManyToMany',
              fetchType: 'lazy',
              cardinality: 'twoWay',
              referencedColumnName: 'id',
              joinColumn: 'estudante_id',
              entity: 'Disciplina',
              joinTable: 'estudante_disciplina',
              inverseJoinColumn: 'disciplina_id',
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
        name: 'Disciplina',
        tableName: 't_disciplina',
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
            type: 'string',
            name: 'nome'
          }
        ],
        relationReference: [
          {
            type: 'ManyToMany',
            fetchType: 'lazy',
            entity: 'Estudante',
            mappedBy: 'disciplina', // same name as java attribute in source relation
            fieldName: 'estudantes' // nome do campo a ser criado na tabela destino. deve ser inserido para casos de multiplos foreign keys
          },
        ],
        crud: false,
        audit: false,
      },
    ];

    for (const testCase of ManyToMany) {
      await addModel(testCase, DOMAIN_OUTPUT_DIR);
    }
  });
});
