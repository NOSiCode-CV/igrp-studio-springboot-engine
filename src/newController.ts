import { ControllerConfig, RenderContext } from './interfaces/types';
import { ERROR_MESSAGE } from './utils/constants';
import { generateController } from './modules/controller/generateController';
import { generateServiceInterface } from './modules/controller/generateServiceInterface';
import { getBaseApiConfig } from './modules/common/getBaseApiConfig';
import { saveControllerConfig } from './modules/controller/saveControllerConfig';

export const newController = async (config: ControllerConfig, basePath: string) => {
  if (!config || !config.name) throw ERROR_MESSAGE.INVALID_CONTROLLER_CONFIG;

  const baseConfig = await getBaseApiConfig(basePath);
  await saveControllerConfig(config, basePath);

  const context: RenderContext<ControllerConfig> = {
    resourceConfig: config,
    basePath,
    baseConfig,
  };

  await generateController(context);
  await generateServiceInterface(context);
};
