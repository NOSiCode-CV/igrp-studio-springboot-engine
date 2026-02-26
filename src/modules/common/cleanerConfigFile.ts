import {
  BaseApiConfig,
  ControllerConfig,
  CrudControllerConfig,
  DTOConfig,
  EnumConfig,
  ModelConfig,
  ModuleConfig,
  RequestConfig,
  ResponseConfig,
  SerializationConfig,
} from '../../interfaces/types';

export const cleaner = (config: BaseApiConfig | ModelConfig | ControllerConfig | DTOConfig | ModuleConfig | EnumConfig | RequestConfig | ResponseConfig | SerializationConfig | CrudControllerConfig) => {


  const cleanObject = (dirty: any): any => {
    if (typeof dirty !== 'object' || dirty === null) {
      return dirty;
    }

    return Object.entries(dirty).reduce((acc, [key, value]) => {

      if (value && typeof value === 'object' && !Array.isArray(value)) {
        const cleanedValue = cleanObject(value);
        if (Object.keys(cleanedValue).length > 0) {
          acc[key] = cleanedValue;
        }
      }

      else if (Array.isArray(value)) {
        const cleanedArray = value
          .map((item) => {
            if (typeof item === 'object' && item !== null) {
              return cleanObject(item);
            }
            return item;
          })
          .filter((item) => {
            if (item === null || item === undefined || item === "") {
              return false;
            }
            if (typeof item === 'object' && !Array.isArray(item) && Object.keys(item).length === 0) {
              return false;
            }
            if (Array.isArray(item) && item.length === 0) {
              return false;
            }
            return true;
          });

        if (cleanedArray.length > 0) {
          acc[key] = cleanedArray;
        }
      }

      else if (value !== "" && value !== null && value !== undefined) {
        acc[key] = value;
      }

      return acc;
    }, {} as any);
  };

  return cleanObject(config);
};
