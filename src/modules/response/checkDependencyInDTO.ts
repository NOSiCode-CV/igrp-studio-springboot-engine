import { DeleteConfig, JavaType, RenderContext, ResponseConfig } from '../../interfaces/types';
import { getDTOTypes } from '../dto/helpers';
import { DIRECTORIES } from '../../utils/constants';

export const checkDependencyInDTO = async function (
  context: RenderContext<ResponseConfig> | RenderContext<DeleteConfig>,
) {
  const types = await getDTOTypes(
    context.resourceConfig.module ?? DIRECTORIES.SHARED,
    context.basePath,
  );
  const cfg = context.resourceConfig;
  if (cfg.name != null) {
    types.delete(cfg.name);
  }
  const errors: Array<{ message: string }> = [];
  for (const t of types.values()) {
    t.attributes.map((attr) => {
      if (attr.objectType === 'dto') {
        let type: JavaType;
        type = { name: attr.type };

        if (type.name === cfg.name) {
          errors.push({
            message: `'dto.${cfg.name}' is being used in 'dto.${t.name}' on attribute line '${attr.name}'.`,
          });
        }
      }
    });
  }

  if (errors.length > 0) {
    throw errors;
  }
};