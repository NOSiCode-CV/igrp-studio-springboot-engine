import {
  ControllerAction,
  RequestParams,
  PathVariables,
  Attribute,
  JavaAttribute,
  EnumValue, SchemaContent,
} from '../../interfaces/types';

export const checkDuplicated = (attrs?: Attribute[], actions?: ControllerAction[], dto?: JavaAttribute[], values?: EnumValue[], schema?: SchemaContent): void => {
  if (actions) {

    const duplicates = findDuplicateActions(actions)
    if (duplicates.length > 0) {
      throw new Error(
        `The endpoint has the following duplicated action names: ${[...new Set(duplicates)].join(', ')}.`
      );
    }

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

  if(values) {
    const duplicates = findDuplicates(values)
    if (duplicates.length > 0) {
      throw new Error(
        `The enum has the following duplicated values: ${[...new Set(duplicates)].join(', ')}.`
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

  if(schema) {
    const duplicates = findDuplicatesSchema(
      Object.entries(schema.schema.properties ?? []).map(([key]) => key)
    );

    if (duplicates.length > 0) {
      throw new Error(
        `The dto has the following duplicated attribute names: ${[...new Set(duplicates)].join(', ')}.`
      );
    }
  }

};

const findDuplicatesSchema = (arr: string[]) : string[] => {
  const nameCount: Record<string, number> = {};
  const duplicates: string[] = [];

  arr.forEach((e) => {
    nameCount[e] = (nameCount[e] || 0) + 1;
    if (nameCount[e] === 2) {
      duplicates.push(e);
    }
  });

  return duplicates;
}

const findDuplicates = (arr: RequestParams[] | PathVariables[] | Attribute[] | JavaAttribute[] | EnumValue[]): string[] => {
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

const findDuplicateActions = (arr: ControllerAction[]): string[] => {
  const nameCount: Record<string, number> = {};
  const duplicates: string[] = [];

  arr.forEach((e) => {
    nameCount[e.actionName] = (nameCount[e.actionName] || 0) + 1;
    if (nameCount[e.actionName] === 2) {
      duplicates.push(e.actionName);
    }
  });

  return duplicates;
};
