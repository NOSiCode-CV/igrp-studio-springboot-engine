import { ControllerAction, RequestParams, PathVariables, Attribute, JavaAttribute } from "../../interfaces/types";

export const checkDuplicated = (attrs?: Attribute[], actions?: ControllerAction[], dto?: JavaAttribute[]): void => {
  if (actions) {
    actions.forEach((action) => {
      const { requestParams, pathVariables } = action;
  
      if (requestParams) {
        const duplicates = findDuplicates(requestParams);
        if (duplicates.length > 0) {
          throw new Error(
            `Action '${action.actionName}' has the following duplicated names in requestParams: ${[...new Set(duplicates)].join(', ')}.`
          );
        }
      }
  
      if (pathVariables) {
        const duplicates = findDuplicates(pathVariables);
        if (duplicates.length > 0) {
          throw new Error(
            `Action '${action.actionName}' has the following duplicated names in pathVariables: ${[...new Set(duplicates)].join(', ')}.`
          );
        }
      }
    });
  }

  if(attrs) {
    const duplicates = findDuplicates(attrs)
    if (duplicates.length > 0) {
      throw new Error(
        `The model has the following duplicated attribute names: ${[...new Set(duplicates)].join(', ')}.`
      );
    }
  }
  if(dto) {
    const duplicates = findDuplicates(dto)
    if (duplicates.length > 0) {
      throw new Error(
        `The dto has the following duplicated attribute names: ${[...new Set(duplicates)].join(', ')}.`
      );
    }
  }

};

const findDuplicates = (arr: RequestParams[] | PathVariables[] | Attribute[] | JavaAttribute[]): string[] => {
  const nameCount: Record<string, number> = {};
  const duplicates: string[] = [];

  arr.forEach((e) => {
    nameCount[e.name] = (nameCount[e.name] || 0) + 1;
    if (nameCount[e.name] === 2) {
      duplicates.push(e.name);
    }
  });

  return duplicates;
};
