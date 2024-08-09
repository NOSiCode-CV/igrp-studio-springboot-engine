import { ControllerConfig, RenderContext } from '../../interfaces/types';
import { ERROR_MESSAGE, TEMPLATES } from "../../utils/constants";
import { renderTemplate } from "../common/renderTemplate";


export const controllerInterfaceGenerator = async (context: RenderContext<ControllerConfig>) => {
  if (!context.config)
    throw ERROR_MESSAGE.INVALID_CONTROLLER_CONFIG;

  return await renderTemplate(TEMPLATES.DOMAIN_ICONTROLLER, context)
}