import { XMLParser } from 'fast-xml-parser';

export const parseXml = (xml: string): any => {
  const parser = new XMLParser({
    ignoreAttributes: false,
    allowBooleanAttributes: true,
  });
  return parser.parse(xml);
};

export const parseSqlCommand = (sql: string): { columns: string[]; table: string } => {
  const match = sql.match(/SELECT\s+(.*?)\s+FROM\s+(\w+)/i);
  if (!match) {
    throw new Error('Invalid SQL command');
  }

  const columns = match[1].split(',').map((col) => col.trim());
  const table = match[2];

  return { columns, table };
};

export const parseDdlScript = (ddl: string): { columns: string; table: string } => {
  // Extract table name
  const tableNameMatch = ddl.match(/create table (\w+)/i);
  if (!tableNameMatch) {
    throw new Error('Invalid DDL: Table name not found');
  }
  const tableName = tableNameMatch[1];

  // Extract column definitions
  const columnDefinitions = ddl.match(/\(([\s\S]*?)\);/)?.[1];
  if (!columnDefinitions) {
    throw new Error('Invalid DDL: Column definitions not found');
  }

  return { columns: columnDefinitions, table: tableName };
};

// Helper function to map SQL types to generic types
export const mapSqlTypeToGenericType = (sqlType: string): string => {
  const typeMapping: { [key: string]: string } = {
    bigint: 'long',
    varchar: 'string',
    text: 'string',
    timestamp: 'datetime',
    boolean: 'boolean',
    jsonb: 'object',
    integer: 'integer',
    float: 'float',
    double: 'double',
    date: 'date',
    time: 'time',
  };

  return typeMapping[sqlType.toLowerCase()] || 'string'; // Default to 'string' if type is not recognized
};

export const generateElementId = (): string => {
  return Math.random().toString(36).slice(2, 12);
};
