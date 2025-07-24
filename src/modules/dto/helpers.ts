import { DTOConfig, JavaAttribute, ObjectTypes } from '../../interfaces/types';
import { loadDTOConfig, loadDTOConfigs } from '../../utils/helpers';
import { normalizeName } from './saveDTOConfig';

export const DTO_INTERFACE_VALIDATOR_SUFFIX = 'Validator';

export const getDTOTypes = async function (
  module: string,
  basePath: string,
): Promise<Map<string, DTOConfig>> {
  const configs = await loadDTOConfigs(module, basePath);
  const types: Map<string, DTOConfig> = new Map<string, DTOConfig>();
  configs.forEach((cfg) => types.set(`${normalizeName(cfg.name, 'dto')}DTO`, cfg));
  return types;
};

export const normalizeInterfaceValidatorName = (name: string): string => {
  return `I${name}DTO${DTO_INTERFACE_VALIDATOR_SUFFIX}`;
};

export const normalizeImplValidatorName = (name: string): string => {
  return `${name}DTO${DTO_INTERFACE_VALIDATOR_SUFFIX}`;
};
