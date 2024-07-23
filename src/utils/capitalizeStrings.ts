const singleCapitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

const capitalize = (str: string): string => str.split(/[-_,.]/).map(singleCapitalize).join('');


module.exports = { capitalize };
