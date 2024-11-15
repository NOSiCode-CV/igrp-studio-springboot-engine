import path from 'path';
import { DTOConfig, RenderContext } from '../../interfaces/types';
import { TEMPLATES } from '../../utils/constants';
import { renderTemplate } from '../common/renderTemplate';
import { saveToFile } from '../common/saveToFile';
import { getDDDCommandOutputDir, getDDDEventOutputDir } from '../../utils/helpers';

const COMMAND_LISTENER_SUFFIX = 'CommandListener.java';
const EVENT_LISTENER_SUFFIX = 'EventListener.java';

/**
 * 
 * @param context 
 */
export const generateListeners = async (context: RenderContext<DTOConfig>) => {
  const listener = await renderListener(context);
  const listenerPath = getListenerPath(context);
  await saveToFile(listener, listenerPath, false);
};

export const renderListener = async (context: RenderContext<DTOConfig>) => {
  switch (context.resourceConfig.type) {
    case 'command':
      return await renderTemplate(TEMPLATES.DDD_COMMAND_LISTENER_IMPL, context);
    case 'event':
      return await renderTemplate(TEMPLATES.DDD_EVENT_LISTENER_IMPL, context);
    default:
      throw Error('Invalid object type');
  }

};

const getListenerPath = (context: RenderContext<DTOConfig>) => {
  switch (context.resourceConfig.type) {
    case 'command':
      return path.join(
        getDDDCommandOutputDir(context),
        `${context.resourceConfig.name}${COMMAND_LISTENER_SUFFIX}`,
      );
    case 'event':
      return path.join(
        getDDDEventOutputDir(context),
        `${context.resourceConfig.name}${EVENT_LISTENER_SUFFIX}`,
      );
    default:
      throw Error('Invalid object type');
  }
}

