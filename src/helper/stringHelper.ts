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

export function toFullCamelCaseFromSnakeCase(str: string): string {
  if (!str) return '';

  const noSnake = str
    .split('_')
    .map((word, index) => (index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join('');

  return noSnake.charAt(0).toLowerCase() + noSnake.slice(1);
}

export function toTitleCase(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function toLowerCase(str: string): string {
  return (str || '').toLowerCase();
}

export function toUpperCase(str: string): string {
  return (str || '').toUpperCase();
}

export function lowercaseAndPluralize(str: string): string {
  const lowerStr = str.toLowerCase();

  if (lowerStr.endsWith('y') && !/[aeiou]y$/.test(lowerStr)) {
    return lowerStr.replace(/y$/, 'ies');
  }

  if (/[sxz]$/.test(lowerStr) || /[ch]$/.test(lowerStr)) {
    return lowerStr + 'es';
  }

  return lowerStr + 's';
}

export function fullCamelCaseAndPluralize(str: string): string {
  if (!str) return '';

  const lowerStr = str
    .toLowerCase()
    .split('_')
    .map((word, index) => (index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join('');

  if (lowerStr.endsWith('y') && !/[aeiou]y$/.test(lowerStr)) {
    return lowerStr.replace(/y$/, 'ies');
  }

  if (/[sxz]$/.test(lowerStr) || /[ch]$/.test(lowerStr)) {
    return lowerStr + 'es';
  }

  return lowerStr + 's';
}
