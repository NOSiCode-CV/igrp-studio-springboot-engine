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

  const getTypeName = (type: string | undefined): string =>
    capitalize(type?.replace(/dto$/i, '') + 'DTO');

  const processResponseCollection = (type: string): string => {
    switch (type) {
      case 'collection':
        return `Collection<${type}>`
      case 'map':
        return `Map<?, ${type}>`
      case 'pageable':
        return `Page<${type}>`
    }
    return type;
  }

  let response: string;

  if (schema.type === 'object') {
    response = getTypeName(singleBody?.name);
  } else {

    let primitiveTypes: string[] = ["integer", "boolean", "string"];

    if (primitiveTypes.includes(schema.type)) {
      response = capitalize(schema.type);
    } else {
      response = getTypeName(schema.type);
    }
  }

  return processResponseCollection(response);
};