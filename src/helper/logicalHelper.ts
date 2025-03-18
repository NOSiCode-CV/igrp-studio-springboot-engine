export function ifNot(this: any, conditional: any, options: any): any {
  return !conditional ? options.fn(this) : options.inverse(this);
}

export function not(conditional: any): any {
  return !conditional;
}

export function ifEquals(
  this: unknown,
  arg1: any,
  arg2: any,
  options: Handlebars.HelperOptions,
): string {
  return arg1 === arg2 ? options.fn(this) : options.inverse(this);
}

export function notEquals(a: any, b: any): any {
  return a !== b;
}

export function isText(type: string): boolean {
  const textTypes = [
    'String',
    'string',
    'Text',
    'text',
    'VARCHAR',
    'CHAR',
    'TEXT',
    'CLOB',
    'LONGTEXT',
    'MEDIUMTEXT',
    'TINYTEXT',
    'NVARCHAR',
    'NCHAR',
    'NCLOB',
  ];
  return textTypes.includes(type);
}

export function isPageable(responses?: { [p: string]: any }): boolean {
  let isPageable = false;

  if (!responses || Object.keys(responses).length !== 1) return false;

  const singleBody = responses[Object.keys(responses)[0]];
  const content =
    singleBody?.content['application/json'] ?? singleBody?.content['multipart/form-data'];
  const schema = content?.schema;

  if (!schema) return false;
  const responseCollectionType: string = schema.collectionType;

  if (responseCollectionType === 'pageable') isPageable = true;

  return isPageable;
}
