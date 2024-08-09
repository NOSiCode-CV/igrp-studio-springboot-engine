import { ControllerConfig } from '../../interfaces/types';
import { ERROR_MESSAGE, TEMPLATES } from "../../utils/constants";
import { renderTemplate } from "../common/renderTemplate";


export const controllerInterfaceGenerator = async (config: ControllerConfig) => {
  if (!config)
    throw ERROR_MESSAGE.INVALID_CONTROLLER_CONFIG;

  return await renderTemplate(TEMPLATES.DOMAIN_ICONTROLLER, config)
}