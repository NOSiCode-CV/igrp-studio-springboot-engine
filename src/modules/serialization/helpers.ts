import { XMLParser } from "fast-xml-parser";

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