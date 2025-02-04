import {
  JsonConfig,
  SqlConfig,
  XmlConfig,
  DTOConfig,
  ModelConfig,
  ResponseConfig,
  JavaAttribute, PropertySchemaField, Attribute,
} from '../../interfaces/types';
import { DIRECTORIES, TYPESCRIPT_TYPES } from '../../utils/constants';
import { parseSqlCommand, parseXml } from './helpers';

export const serializeData = async (config: JsonConfig | XmlConfig | SqlConfig) => {
  if (!config) return;

  if ('json' in config && config.json) {
    const jsonData = JSON.parse(config.json);

    if (config.type === 'dto') {
      return mapJsonToDtoConfig(jsonData, config);
    }

    if (config.type === 'model') {
      return mapJsonToModelConfig(jsonData, config);
    }

    if (config.type === 'response') {
      return mapJsonToResponseConfig(jsonData, config);
    }
  }

  if ('sql' in config && config.sql) {
    const sqlData = parseSqlCommand(config.sql);

    if (config.type === 'dto') {
      return mapSqlToDtoConfig(sqlData, config);
    }

    if (config.type === 'model') {
      return mapSqlToModelConfig(sqlData, config);
    }

    if (config.type === 'response') {
      return mapSqlToResponseConfig(sqlData, config);
    }
  }

  if ('xml' in config && config.xml) {
    const xmlData = parseXml(config.xml);

    if (config.type === 'dto') {
      return mapXmlToDtoConfig(xmlData, config);
    }

    if (config.type === 'model') {
      return mapXmlToModelConfig(xmlData, config);
    }

    if (config.type === 'response') {
      return mapXmlToResponseConfig(xmlData, config);
    }
  }
};

const mapJsonToDtoConfig = (jsonData: any, config: JsonConfig): DTOConfig => {
  const attributes: JavaAttribute[] = Object.keys(jsonData).map((key) => ({
    name: key,
    type: TYPESCRIPT_TYPES.get(typeof jsonData[key])?.generic.name ?? 'object',
    objectType: 'java', // Default to 'java'; adjust based on actual data
    required: true, // Default to true; adjust based on actual data
  }));

  return {
    type: 'dto',
    name: config.name,
    module: config.module ?? DIRECTORIES.SHARED,
    template: config.template,
    attributes,
  };
};

const mapJsonToModelConfig = (jsonData: any, config: JsonConfig): ModelConfig => {
  const attributes: Attribute[] = Object.keys(jsonData).map((key) => (key.toLowerCase() === 'id' ?
    {
      name: key,
      type: typeof jsonData[key] == 'number' ? 'long' : 'string',
      primaryKey: true,
      generationType: 'AUTO',
      nullable: false
    }
    : {
    name: key,
    type: TYPESCRIPT_TYPES.get(typeof jsonData[key])?.generic.name ?? 'object',
    nullable: true, // Default to true; adjust based on actual data
  }));

  if(attributes.filter(it => it.name.toLowerCase() == "id").length == 0)
    attributes.push(
      {
        name: "id",
        type: 'integer',
        primaryKey: true,
        generationType: 'IDENTITY',
        nullable: false
      }
    )

  return {
    type: 'model',
    module: config.module ?? DIRECTORIES.SHARED,
    name: config.name, // Replace with a meaningful name if available
    tableName: config.name, // Replace with a meaningful table name if available
    attributes,
    crud: false,
    audit: false,
  };
};

const mapJsonToResponseConfig = (jsonData: any, config: JsonConfig): ResponseConfig => {
  const properties: { [key: string]: PropertySchemaField } = {};

  // Map each property in the JSON object to a PropertySchemaField
  Object.keys(jsonData).forEach((key) => {
    const value = jsonData[key];
    const type = typeof value;

    properties[key] = {
      type: type === 'object' ? (Array.isArray(value) ? 'array' : 'object') : type,
      objectType: type === 'object' ? 'dto' : 'java',
      required: true, // Default to true; adjust based on actual data
      properties: type === 'object' && !Array.isArray(value) ? mapJsonToProperties(value) : undefined,
      items: Array.isArray(value) ? { type: typeof value[0] } : undefined,
    };
  });

  return {
    name: config.name,
    statusCode: '200',
    template: config.template,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties,
        },
      },
    },
  };
};

// Helper function to map nested objects to properties
const mapJsonToProperties = (obj: any): { [key: string]: PropertySchemaField } => {
  const properties: { [key: string]: PropertySchemaField } = {};

  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    const type = typeof value;

    properties[key] = {
      type: type === 'object' ? (Array.isArray(value) ? 'array' : 'object') : type,
      objectType: type === 'object' ? 'dto' : 'java',
      required: true, // Default to true; adjust based on actual data
      properties: type === 'object' && !Array.isArray(value) ? mapJsonToProperties(value) : undefined,
      items: Array.isArray(value) ? { type: typeof value[0] } : undefined,
    };
  });

  return properties;
};

const mapSqlToDtoConfig = (sqlData: { columns: string[]; table: string }, config: SqlConfig): DTOConfig => {
  const attributes: JavaAttribute[] = sqlData.columns.map((column) => ({
    name: column,
    type: 'string', // Default to 'string'; adjust based on actual data
    objectType: 'java',
    required: true,
  }));

  return {
    type: 'dto',
    name: config.name,
    module: config.module ?? DIRECTORIES.SHARED,
    template: config.template,
    attributes,
  };
};

const mapSqlToModelConfig = (sqlData: { columns: string[]; table: string }, config: SqlConfig): ModelConfig => {

  const attributes: Attribute[] = sqlData.columns.map((column) => (column.toLowerCase() === 'id' ?
    {
      name: column,
      type: 'integer',
      primaryKey: true,
      generationType: 'AUTO',
      nullable: false
    }
    : {
    name: column,
    type: 'string', // Default to 'string'; adjust based on actual data
    nullable: true,
  }));

  if(attributes.filter(it => it.name.toLowerCase() == "id").length == 0)
    attributes.push(
      {
        name: "id",
        type: 'integer',
        primaryKey: true,
        generationType: 'IDENTITY',
        nullable: false
      }
    )

  return {
    type: 'model',
    module: config.module ?? DIRECTORIES.SHARED,
    name: config.name,
    tableName: sqlData.table,
    attributes,
    crud: false,
    audit: false,
  };

};

const mapSqlToResponseConfig = (sqlData: { columns: string[]; table: string }, config: SqlConfig): ResponseConfig => {
  const properties: { [key: string]: PropertySchemaField } = {};

  // Map each column to a PropertySchemaField
  sqlData.columns.forEach((column) => {
    properties[column] = {
      type: 'string', // Default to 'string'; adjust based on actual data
      objectType: 'java',
      required: true, // Default to true; adjust based on actual data
    };
  });

  return {
    name: config.name,
    statusCode: '200',
    template: config.template,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties,
        },
      },
    },
  };
};

const mapXmlToDtoConfig = (xmlData: any, config: XmlConfig): DTOConfig => {
  const attributes: JavaAttribute[] = Object.keys(xmlData).map((key) => ({
    name: key,
    type: TYPESCRIPT_TYPES.get(typeof xmlData[key])?.generic.name ?? 'object',
    objectType: 'java',
    required: true,
  }));

  return {
    type: 'dto',
    name: config.name,
    module: config.module ?? DIRECTORIES.SHARED,
    template: config.template,
    attributes,
  };
};

const mapXmlToModelConfig = (xmlData: any, config: XmlConfig): ModelConfig => {
  const attributes: Attribute[] = Object.keys(xmlData).map((key) => (key.toLowerCase() === 'id' ?
    {
      name: key,
      type: typeof xmlData[key] == 'number' ? 'long' : 'string',
      primaryKey: true,
      generationType: 'AUTO',
      nullable: false,
    }
    : {
    name: key,
    type: TYPESCRIPT_TYPES.get(typeof xmlData[key])?.generic.name ?? 'object',
    nullable: true,
  }));

  if(attributes.filter(it => it.name.toLowerCase() == "id").length == 0)
    attributes.push(
      {
        name: "id",
        type: 'integer',
        primaryKey: true,
        generationType: 'IDENTITY',
        nullable: false
      }
    )

  return {
    type: 'model',
    name: config.name,
    module: config.module ?? DIRECTORIES.SHARED,
    tableName: config.name,
    attributes,
    crud: false,
    audit: false,
  };
};

const mapXmlToResponseConfig = (xmlData: any, config: XmlConfig): ResponseConfig => {
  const properties: { [key: string]: PropertySchemaField } = {};

  // Map each property in the XML object to a PropertySchemaField
  Object.keys(xmlData).forEach((key) => {
    const value = xmlData[key];
    const type = typeof value;

    properties[key] = {
      type: type === 'object' ? (Array.isArray(value) ? 'array' : 'object') : type,
      objectType: type === 'object' ? 'dto' : 'java',
      required: true, // Default to true; adjust based on actual data
      properties: type === 'object' && !Array.isArray(value) ? mapXmlToProperties(value) : undefined,
      items: Array.isArray(value) ? { type: typeof value[0] } : undefined,
    };
  });

  return {
    name: config.name,
    statusCode: '200',
    template: config.template,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties,
        },
      },
    },
  };
};

// Helper function to map nested XML objects to properties
const mapXmlToProperties = (obj: any): { [key: string]: PropertySchemaField } => {
  const properties: { [key: string]: PropertySchemaField } = {};

  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    const type = typeof value;

    properties[key] = {
      type: type === 'object' ? (Array.isArray(value) ? 'array' : 'object') : type,
      objectType: type === 'object' ? 'dto' : 'java',
      required: true, // Default to true; adjust based on actual data
      properties: type === 'object' && !Array.isArray(value) ? mapXmlToProperties(value) : undefined,
      items: Array.isArray(value) ? { type: typeof value[0] } : undefined,
    };
  });

  return properties;
};