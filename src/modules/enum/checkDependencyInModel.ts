import { DeleteConfig, EnumConfig, JavaType, RenderContext } from '../../interfaces/types';
import { DIRECTORIES } from '../../utils/constants';
import { getModelTypes } from '../model/helpers';

export const checkDependencyInModel = async function (
  context: RenderContext<EnumConfig> | RenderContext<DeleteConfig>,
) {
  const types = await getModelTypes(
    context.resourceConfig.module ?? DIRECTORIES.SHARED,
    context.basePath,
  );
  const cfg = context.resourceConfig;
  const errors: Array<{ message: string }> = [];
  for (const t of types.values()) {
    t.attributes.map((attr) => {
      if (attr.objectType === 'enum') {
        let type: JavaType;
        type = { name: attr.type };

        if (type.name === cfg.name) {
          errors.push({
            message: `'enum.${cfg.name}' is being used in 'model.${t.name}' on attribute line '${attr.name}'.`,
          });
        }
      }
    });
  }

  if (errors.length > 0) {
    throw errors;
  }
};