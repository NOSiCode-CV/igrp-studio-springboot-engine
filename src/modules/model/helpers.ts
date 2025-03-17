import { DatabaseTypes, ModelConfig } from '../../interfaces/types';
import { loadModelConfigs } from '../../utils/helpers';

export const getModelTypes = async function (
  module: string,
  basePath: string,
): Promise<Map<string, ModelConfig>> {
  const configs = await loadModelConfigs(module, basePath);
  const types: Map<string, ModelConfig> = new Map<string, ModelConfig>();
  configs.forEach((cfg) => types.set(`${cfg.name}`, cfg));
  return types;
};

export function processTableName(rowTableName: string, dbType: DatabaseTypes): string {
  switch (dbType) {
    case 'MySQL':
    case 'Postgresql':
      return rowTableName.toLowerCase();
    case 'Oracle':
      return rowTableName.toUpperCase();
    default:
      return dbType;
  }
}
