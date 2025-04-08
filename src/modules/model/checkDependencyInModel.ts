import { DeleteConfig, EnumConfig, JavaType, ModelConfig, RenderContext } from '../../interfaces/types';
import { DIRECTORIES } from '../../utils/constants';
import { getModelTypes } from '../model/helpers';

export const checkDependencyInModel = async function (context: RenderContext<ModelConfig> | RenderContext<DeleteConfig>) {
  const types = await getModelTypes(context.resourceConfig.module ?? DIRECTORIES.SHARED, context.basePath);
  const cfg = context.resourceConfig;
  types.delete(cfg.name)
  const errors: Array<{ message: string }> = [];
  for (const t of types.values()) {
    t.attributes.map(attr => {
      if (attr.type === 'relation' && attr.relation?.entity) {

        let type: JavaType;
        type = { name: attr.relation.entity };

        if (type.name === cfg.name) {
          errors.push({ message: `'model.${cfg.name}' is being used in 'model.${t.name}' on attribute line '${attr.name}'.` });
        }

      }
    })
  }

  if (errors.length > 0) {
    throw errors;
  }
}

export const checkRelationReferences = async function (
  context: RenderContext<ModelConfig> | RenderContext<DeleteConfig>
) {
  const types = await getModelTypes(context.resourceConfig.module ?? DIRECTORIES.SHARED, context.basePath);

  const cfg = context.resourceConfig;
  types.delete(cfg.name);

  console.log(types);

  const errors: Array<{ message: string }> = [];

  for (const t of types.values()) {
    if (!t.relationReference) continue;

    for (const ref of t.relationReference) {
      if (ref.entity === cfg.name) {
        errors.push({
          message: `'model.${cfg.name}' is referenced in 'model.${t.name}' through a reverse relation`,
        });
      }
    }
  }

  if (errors.length > 0) {
    throw errors;
  }
};
