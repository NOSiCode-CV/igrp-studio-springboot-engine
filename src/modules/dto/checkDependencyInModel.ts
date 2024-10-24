import { DTOBaseConfig, RenderContext, JavaType } from "../../interfaces/types";
import { getModelTypes } from "../model/helpers";
import { getDTOTypes } from "./helpers";

export const checkDependencyInModel = async function(context: RenderContext<DTOBaseConfig>) {
  const dtoTypes = await getDTOTypes(context.basePath);  
  const modelTypes = await getModelTypes(context.basePath);  
  const cfg = context.resourceConfig;  
  dtoTypes.delete(cfg.name);  

  const errors: Array<{ message: string }> = [];

  for (const dto of dtoTypes.values()) {
    dto.attributes.map(attr => {
      
      if (attr.ns === 'model') {
        let type: JavaType;
        if (typeof attr.type === 'string') {
          type = { name: attr.type };
        } else {
          type = attr.type;
        }
        
        if (modelTypes.has(type.name)) {
          errors.push({ message: `'model.${type.name}' is being used in 'dto.${dto.name}' on attribute '${attr.name}'` });
        }

        // if (type.generics) {
        //   for (const gt of type.generics) {
        //     if (gt.ns === 'model' && modelTypes.has(gt.name)) {
        //       errors.push({ message: `'model.${gt.name}' is being used as generic type in 'dto.${dto.name}' on attribute '${attr.name}'` });
        //     }
        //   }
        // }
      }
    });
  }

  if (errors.length > 0) {
    throw errors;
  }
};
