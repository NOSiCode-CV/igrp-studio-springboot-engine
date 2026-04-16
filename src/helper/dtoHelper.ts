import { DTOConfig, JavaType } from '../interfaces/types';
import { GENERIC_TYPES } from '../utils/constants';

export function keyTypeDTO(config: DTOConfig): any {
  if (!config) {
    return null;
  }
  if (!config.attributes) {
    return null;
  }
  const primaryKeyAttr = config.attributes?.find((p) => p.primaryKey === true);
  if (!primaryKeyAttr) {
    return null;
  }

  const result: JavaType | string = {
    name: GENERIC_TYPES.get(primaryKeyAttr.type)?.java.name ?? '',
    namespace: GENERIC_TYPES.get(primaryKeyAttr.type)?.java.namespace,
  };
  return result.name;
}
