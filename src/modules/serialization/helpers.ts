import { XMLParser } from 'fast-xml-parser';

export const parseXml = (xml: string): any => {
  const parser = new XMLParser({
    ignoreAttributes: false,
    allowBooleanAttributes: true,
  });
  return parser.parse(xml);
};

export const parseSqlCommand = (sql: string): { columns: string[]; table: string } => {
  // Extract the SELECT clause and table name
  const selectClauseMatch = sql.match(/SELECT\s+([\s\S]+?)\s+FROM\s+([^\s;]+)/i);
  if (!selectClauseMatch) {
    throw new Error(
      'Invalid or Unsupported SQL SELECT command format. Supported format: SELECT value AS column_name FROM table_name',
    );
  }

  const selectClause = selectClauseMatch[1].trim();

  // Split the SELECT clause into individual columns
  const columns = selectClause.split(',').map((col) => col.trim());

  // Extract table name (second capture group)
  const table = selectClauseMatch[2].trim();

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

// Helper function to infer the type from a SQL value
export const inferTypeFromValue = (value: string): string => {
  if (
    value.toLowerCase() === 'sysdate' ||
    value.toLowerCase().includes('timestamp') ||
    /^'?(\d{4}[-/.]\d{2}[-/.]\d{2}(\s+\d{2}:\d{2}(:\d{2})?)?)'?$/.test(value) // Matches YYYY-MM-DD or with time
  ) {
    return 'datetime'; // Date or timestamp
  }
  if (/^-?\d+$/.test(value)) {
    // Supports negative numbers too
    const num = BigInt(value); // Use BigInt to handle large numbers
    if (num >= -2147483648n && num <= 2147483647n) {
      return 'integer'; // Java Integer range
    }
    return 'long'; // Java Long range
  }
  if (/^\d+\.\d+$/.test(value)) {
    return 'double'; // Double
  }
  if (value.startsWith("'") && value.endsWith("'")) {
    return 'string'; // String
  }
  return 'string'; // Default to string
};

export const generateElementId = (): string => {
  return Math.random().toString(36).slice(2, 12);
};
