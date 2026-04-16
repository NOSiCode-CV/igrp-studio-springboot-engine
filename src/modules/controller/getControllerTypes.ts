import { ControllerConfig } from '../../interfaces/types';
import { loadControllerConfigs } from '../../utils/helpers';

export const getControllerTypes = async function (
  module: string,
  basePath: string,
): Promise<Map<string, ControllerConfig>> {
  const configs = await loadControllerConfigs(module, basePath);
  const types: Map<string, ControllerConfig> = new Map<string, ControllerConfig>();
  configs.forEach((cfg) => types.set(`${cfg.name}`, cfg));
  return types;
};