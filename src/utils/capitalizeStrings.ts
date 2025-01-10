import { Body } from '../interfaces/types';

const singleCapitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

export const capitalize = (str: string): string => str.split(/[-_,.]/).map(singleCapitalize).join('');

export const capitalizeResponse = (responses?: { [p: string]: Body }): string => {
  if (!responses) return "?"; // Return empty string if responses is undefined

  const keys = Object.keys(responses);

  if (keys.length !== 1) return "?"; // Return "?" if there is more than one key

  const singleBody = responses[keys[0]];

  // Return the "name" attribute if it exists, otherwise return an empty string
  return capitalize(singleBody?.name.replace(/dto$/i, '') + "DTO") || "?";
};
