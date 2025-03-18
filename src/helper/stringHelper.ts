export function singleCapitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function capitalize(str: string): string {
  return str
    .split(/[-_,.]/)
    .map(singleCapitalize)
    .join('');
}

export function toCamelCase(str: string): string {
  if (!str) return '';
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export function concat(str1: string, str2: string): string {
  return str1 + str2;
}
