import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import addErrors from 'ajv-errors';

const ajvInstance = new Ajv({ allErrors: true, allowUnionTypes: true });
addFormats(ajvInstance);
addErrors(ajvInstance);

const checkUniqueActionNames = (arr: any) => {
  const names = arr.map((action: { actionName: string; }) => action.actionName);
  const hasDuplicates = names.some((name: string, index: number) => names.indexOf(name) !== index);
  return !hasDuplicates;
}

ajvInstance.addKeyword({
  keyword: 'uniqueActionNames',
  type: 'array',
  validate: checkUniqueActionNames,
});


export { ajvInstance };
