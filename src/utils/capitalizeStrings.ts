import { Body } from '../interfaces/types';
import { isResponseCollection } from './helpers';

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
  if (!responses) return '?'; // Return empty string if responses is undefined

  const keys = Object.keys(responses);

  if (keys.length !== 1) return '?'; // Return "?" if there is more than one key

  const singleBody = responses[keys[0]];

  // Return the "name" attribute if it exists, otherwise return the type from the reference
  const response = (
    singleBody?.content['application/json'] ?? singleBody?.content['multipart/form-data']
  )?.schema.objectType
    ? capitalize(
        (
          singleBody?.content['application/json'] ?? singleBody?.content['multipart/form-data']
        )?.schema.type?.replace(/dto$/i, '') + 'DTO',
      )
    : isResponseCollection(
          (singleBody?.content['application/json'] ?? singleBody?.content['multipart/form-data'])
            ?.schema.type,
        )
      ? capitalize(
          (
            singleBody?.content['application/json'] ?? singleBody?.content['multipart/form-data']
          )?.schema.items?.type?.replace(/dto$/i, '') + 'DTO',
        )
      : capitalize(singleBody?.name.replace(/dto$/i, '') + 'DTO') || '?';

  return isResponseCollection(
    (singleBody?.content['application/json'] ?? singleBody?.content['multipart/form-data'])?.schema
      .type,
  )
    ? `List<${response}>`
    : response;
};