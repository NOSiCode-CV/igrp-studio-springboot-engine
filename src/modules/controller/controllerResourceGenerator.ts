import { ControllerConfig } from '../../interfaces/types';
import { ERROR_MESSAGE, TEMPLATES } from '../../utils/constants';
import { templateGenerator } from '../common/templateGenerator';

export const controllerGenerator = async (config: ControllerConfig) => {
  if (!config) throw ERROR_MESSAGE.INVALID_CONTROLLER_CONFIG;

  const template = await templateGenerator(TEMPLATES.DOMAIN_CONTROLLER, config);

  return template;
};
