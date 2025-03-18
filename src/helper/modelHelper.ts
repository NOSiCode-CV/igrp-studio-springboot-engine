import { ModelConfig } from '../interfaces/types';
import { GENERIC_TYPES } from '../utils/constants';

export function keyTypeModel(config: ModelConfig): any {
  if (config.primaryKey) {
    return `${config.name}PrimaryKey`;
  }
  const primaryKeyAttr = config.attributes?.find((p) => p.primaryKey === true);
  if (!primaryKeyAttr) {
    return null;
  }

  return GENERIC_TYPES.get(primaryKeyAttr.type)?.java.name;
}
