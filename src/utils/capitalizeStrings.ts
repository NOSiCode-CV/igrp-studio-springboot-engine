import { Body } from '../interfaces/types';
import { isResponseCollection } from './helpers';
import { type } from 'node:os';

const singleCapitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

export const capitalize = (str: string): string =>
  str
    .split(/[-_,.]/)
    .map(singleCapitalize)
    .join('');

export const processJavaClassName = (str: string): string =>
  str
    .toLowerCase()
    .split(/[-_,.]/)
    .map(singleCapitalize)
    .join('');

export const capitalizeResponse = (responses?: { [p: string]: Body }): string => {

  if (!responses || Object.keys(responses).length !== 1) return '?';

  const singleBody = responses[Object.keys(responses)[0]];
  const content = singleBody?.content['application/json'] ?? singleBody?.content['multipart/form-data'];
  const schema = content?.schema;

  if (!schema) return '?';

  const formatTypeName = (type: string | undefined): string =>
    capitalize(type?.replace(/dto$/i, '') + 'DTO');

  let resolvedType: string;

  if (schema.type === 'object') {
    resolvedType = formatTypeName(singleBody?.name);
  } else {

    let primitiveTypes: string[] = ["integer", "boolean", "string"];

    if (primitiveTypes.includes(schema.type)) {
      resolvedType = capitalize(schema.type);
    } else {
      resolvedType = formatTypeName(schema.type);
    }
  }

  const wrapCollectionType = (type: string, collectionType: string): string => {
    switch (collectionType) {
      case 'collection':
        return `Collection<${type}>`
      case 'map':
        return `Map<?, ${type}>`
      case 'pageable':
        return `Page<${type}>`
    }
    return type;
  }

  const responseCollectionType: string = schema.collectionType ?? 'none';

  return wrapCollectionType(resolvedType, responseCollectionType);
};