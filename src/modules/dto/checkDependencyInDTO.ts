import { DTOBaseConfig, JavaType, RenderContext } from "../../interfaces/types";
import { getDTOTypes } from "./helpers";

export const checkDependencyInDTO = async function(context: RenderContext<DTOBaseConfig>) {
  const types = await getDTOTypes(context.basePath);
  const cfg = context.resourceConfig;
  types.delete(cfg.name);
  const errors: Array<{message: string}> = [];
  for(const t of types.values()) {
    t.attributes.map(attr => {
      if (attr.ns === 'dto') {
        let type: JavaType;
        if (typeof attr.type === 'string') {
          type = { name: attr.type };
        } else {
          type = attr.type;
        }

        if (type.name === cfg.name) {
          errors.push({message: `'dto.${cfg.name}' is beeing used in 'dto.${t.name}' on attribute line '${attr.name}'.`});
        }

        if (type.generics) {
          for(const gt of type.generics) {
            if (gt.ns === 'dto' && gt.name === cfg.name) {
              errors.push({message: `'dto.${cfg.name}' is beeing used as generic type on 'dto.${t.name}' on attribute line '${attr.name}'.`});
            }
          }
        }
      }
    })
  }

  if (errors.length > 0) {
    throw errors;
  }
}