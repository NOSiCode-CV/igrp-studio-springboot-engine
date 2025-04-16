import { Body } from '../interfaces/types';
import { capitalize } from '../helper/stringHelper';

export const capitalizeResponse = (responses?: { [p: string]: Body }): string => {

  if (!responses || Object.keys(responses).length !== 1) return '?';

  const singleBody = responses[Object.keys(responses)[0]];
  const content = singleBody?.content['application/json'] ?? singleBody?.content['multipart/form-data'];
  const schema = content?.schema;

  if (!schema) return '?';

  let resolvedType: string;

  if (schema.type === 'object') {
    resolvedType = formatTypeName(singleBody?.name);
  } else {

    if (schema.objectType === 'dto') {
      resolvedType = formatTypeName(schema.type)
    } else {
      resolvedType = capitalize(schema.type);
      /*let primitiveTypes: string[] = ['integer', 'boolean', 'string'];

      if (primitiveTypes.includes(schema.type)) {
        resolvedType = capitalize(schema.type);
      } else {
        resolvedType = formatTypeName(schema.type);
      }*/
    }
  }

  const responseCollectionType: string = schema.collectionType ?? 'none';

  return wrapCollectionType(resolvedType, responseCollectionType);
};

export function formatTypeName(type: string | undefined): string {
  return capitalize((type ?? '').replace(/dto$/i, '') + 'DTO');
}


export function wrapCollectionType(type: string, collectionType: string): string {
  switch (collectionType) {
    case 'collection':
      return `Collection<${type}>`;
    case 'map':
      //return `Map<?, ${type}>`;
      return `Map<${type}, ?>`;
    case 'pageable':
      return `Page<${type}>`;
    case 'list':
      return `List<${type}>`;
    case 'set':
      return `Set<${type}>`;
    default:
      return type;
  }
}
