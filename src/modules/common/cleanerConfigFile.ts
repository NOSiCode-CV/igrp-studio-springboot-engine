import {
  ApiConfig,
  ModelConfig,
  ControllerConfig,
  DTOConfig,
  ModuleConfig,
  BaseApiConfig, EnumConfig, RequestConfig, ResponseConfig,
} from '../../interfaces/types';

export const cleaner = (config: BaseApiConfig | ModelConfig | ControllerConfig | DTOConfig | ModuleConfig | EnumConfig | RequestConfig | ResponseConfig) => {
  
  const cleanObject = (dirty: any): any => {
    return Object.entries(dirty).reduce((acc, [key, value]) => {

      if (value && typeof value === 'object' && !Array.isArray(value)) {
        const cleanedValue = cleanObject(value);
        if (Object.keys(cleanedValue).length > 0) {
          acc[key] = cleanedValue;
        }
      } 
      
      else if (Array.isArray(value)) {
        const cleanedArray = value.map((item) => cleanObject(item)).filter((item) => Object.keys(item).length > 0);
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
