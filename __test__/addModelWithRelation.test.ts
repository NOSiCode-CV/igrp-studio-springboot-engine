import {ModelConfig} from '../src/interfaces/types';
import {addModel, setEngineConfiguration} from '../src';
// @ts-ignore
import {DOMAIN_OUTPUT_DIR, TECHNICAL_OUTPUT_DIR, TEST_OUTPUT_DIR, TEST_OUTPUT_TEC} from './outputDirPath';


beforeEach(async () => {
  setEngineConfiguration({ environment: 'development' });
});


describe('Model generator', () => {
  it('should create model for DDD with OneToOne Mapping', async () => {
    const oneToOne: ModelConfig[] = [{
      type: "model",
      module: "shared",
      name: "TesteEntity",
      tableName: "t_teste",
      audit: true,
      crud: false,
      revision: false,
      readOnly: true,
      attributes: [
        {
          name: "id",
          type: "integer",
          length: 255,
          nullable: false,
          unique: false,
          primaryKey: true,
          generationType: "SEQUENCE",
          sequenceName: "SEQUENCE_NAME",
          skipFieldRevision: false
        },
        {
          name: "nome",
          type: "string",
          length: 255,
          nullable: false,
          unique: false,
          primaryKey: false,
          skipFieldRevision: false
        }
      ],
      id: "mtev6z191h",
      uniqueConstraints: [],
      indexes: []
    },
   /* {
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
    },*/
    ];

    for (const testCase of oneToOne) {
      //await addModel(testCase, INSS_PATH_PROJECT);
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
      //await addModel(testCase, DOMAIN_OUTPUT_DIR);
    }
  });


  it('should create model for DDD with ManyToOne Mapping', async () => {
    const ManyToOne: ModelConfig[] = [
      {
        type: 'model',
        module: 'shared',
        name: 'PresidenteEntity',
        tableName: 't_presidente',
        audit: true,
        crud: false,
        revision: false,
        attributes: [
          {
            name: 'id',
            type: 'integer',
            length: 255,
            nullable: true,
            unique: false,
            primaryKey: true,
            generationType: 'IDENTITY',
            skipFieldRevision: false
          },
          {
            name: 'nome',
            type: 'string',
            length: 255,
            nullable: false,
            unique: false,
            primaryKey: false,
            skipFieldRevision: false
          },
          {
            name: 'pais_id',
            type: 'relation',
            length: 255,
            nullable: true,
            unique: false,
            primaryKey: false,
            skipFieldRevision: false,
            relation: {
              type: 'ManyToOne',
              entity: 'PaisEntity',
              referencedColumnName: 'id',
              cardinality: 'twoWay',
              fetchType: 'lazy',
              mappedBy: 'presidentes',
              module: 'shared',
              orphanRemoval: false
            }
          }
        ],
        id: '41wm48lnrm',
        uniqueConstraints: [],
        indexes: []
      },

      {
        type: 'model',
        module: 'shared',
        name: 'PaisEntity',
        tableName: 't_pais',
        audit: true,
        crud: false,
        revision: false,
        attributes: [
          {
            name: 'id',
            type: 'integer',
            length: 255,
            nullable: true,
            unique: false,
            primaryKey: true,
            generationType: 'IDENTITY',
            skipFieldRevision: false
          },
          {
            name: 'nome',
            type: 'string',
            length: 255,
            nullable: false,
            unique: false,
            primaryKey: false,
            skipFieldRevision: false
          }
        ],
        id: '1g0zv23jpz',
        relationReference: [
          {
            type: 'ManyToOne',
            entity: 'PresidenteEntity',
            fetchType: 'lazy',
            fieldName: 'presidentes',
            mappedBy: 'pais_id',
            module: 'shared'
          }
        ],
        uniqueConstraints: [],
        indexes: []
      }
    ];

    for (const testCase of ManyToOne) {
     // await addModel(testCase, TEST_OUTPUT_DIR);
    }
  });

  it('should create bidirectional ManyToOne/OneToMany with custom columnName', async () => {

    const models: ModelConfig[] = [
      {
        "type": "model",
        "module": "shared",
        "name": "DemoEntity",
        "tableName": "t_demo",
        "audit": true,
        "crud": false,
        "revision": false,
        "attributes": [
          {
            "name": "id",
            "type": "integer",
            "length": 255,
            "nullable": true,
            "unique": false,
            "primaryKey": true,
            "generationType": "IDENTITY",
            "skipFieldRevision": false
          },
          {
            "name": "nome",
            "type": "string",
            "length": 255,
            "nullable": false,
            "unique": false,
            "primaryKey": false,
            "skipFieldRevision": false
          }
        ],
        "id": "14srrzv51e",
        "relationReference": [
          {
            "type": "ManyToOne",
            "entity": "TesteEntity",
            "fetchType": "lazy",
            "fieldName": "testes",
            "mappedBy": "demo_id",
            "module": "shared"
          }
        ],
        "uniqueConstraints": [],
        "indexes": []
      },

      {
        "type": "model",
        "module": "shared",
        "name": "TesteEntity",
        "tableName": "t_teste",
        "audit": true,
        "crud": false,
        "revision": false,
        "attributes": [
          {
            "name": "id",
            "type": "integer",
            "length": 255,
            "nullable": true,
            "unique": false,
            "primaryKey": true,
            "generationType": "IDENTITY",
            "skipFieldRevision": false
          },
          {
            "name": "demo_id",
            "type": "relation",
            "length": 255,
            "nullable": true,
            "unique": false,
            "primaryKey": false,
            "skipFieldRevision": false,
            "relation": {
              "type": "ManyToOne",
              "entity": "DemoEntity",
              "referencedColumnName": "id",
              "cardinality": "twoWay",
              "fetchType": "lazy",
              "mappedBy": "testes",
              "module": "shared",
              "cascadeType": [
                {
                  "type": "ALL"
                }
              ],
              "orphanRemoval": true
            }
          }
        ],
        "id": "umaluzndao",
        "uniqueConstraints": [],
        "indexes": []
      }
    ];

    for (const testCase of models) {
      await addModel(testCase, TECHNICAL_OUTPUT_DIR);
    }
  });

  it('should create model for DDD with ManyToMany Mapping', async () => {
    const ManyToMany: ModelConfig[] = [
      {
        type: 'model',
        module: 'shared',
        name: 'CursoEntity',
        tableName: 't_curso',
        audit: true,
        crud: false,
        revision: false,
        attributes: [
          {
            name: 'id',
            type: 'integer',
            length: 255,
            nullable: true,
            unique: false,
            primaryKey: true,
            generationType: 'IDENTITY',
            skipFieldRevision: false
          },
          {
            name: 'nome',
            type: 'string',
            length: 255,
            nullable: false,
            unique: false,
            primaryKey: false,
            skipFieldRevision: false
          }
        ],
        id: 'd7ukkb3tja',
        relationReference: [
          {
            type: 'ManyToMany',
            entity: 'AlunoEntity',
            fetchType: 'lazy',
            mappedBy: 'curso',
            module: 'shared'
          }
        ],
        uniqueConstraints: [],
        indexes: []
      },
      {
        type: 'model',
        module: 'shared',
        name: 'AlunoEntity',
        tableName: 't_aluno',
        audit: true,
        crud: false,
        revision: false,
        attributes: [
          {
            name: 'id',
            type: 'integer',
            length: 255,
            nullable: true,
            unique: false,
            primaryKey: true,
            generationType: 'IDENTITY',
            skipFieldRevision: false
          },
          {
            name: 'nome',
            type: 'string',
            length: 255,
            nullable: false,
            unique: false,
            primaryKey: false,
            skipFieldRevision: false
          },
          {
            name: 'curso',
            type: 'relation',
            length: 255,
            nullable: true,
            unique: false,
            primaryKey: false,
            skipFieldRevision: false,
            relation: {
              type: 'ManyToMany',
              entity: 'CursoEntity',
              referencedColumnName: 'id',
              cardinality: 'twoWay',
              inverseJoinColumn: 'curso_id',
              joinTable: 'aluno_curso',
              fetchType: 'lazy',
              module: 'shared',
              orphanRemoval: false
            }
          }
        ],
        id: 'v85av4ucqw',
        uniqueConstraints: [],
        indexes: []
      }



    ];

    for (const testCase of ManyToMany) {
    // await addModel(testCase, TEST_OUTPUT_DIR);
    }
  });
});
