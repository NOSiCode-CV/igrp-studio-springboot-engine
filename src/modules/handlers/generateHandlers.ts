import path from 'path';
import { DTOConfig, RenderContext } from '../../interfaces/types';
import { TEMPLATES } from '../../utils/constants';
import { renderTemplate } from '../common/renderTemplate';
import { saveToFile } from '../common/saveToFile';
import {
  getDDDAggregateElementsOutputDir,
  getDDDCommandHandlerOutputDir,
  getDDDCommandOutputDir, getDDDEventHandlerOutputDir, getDDDQueryHandlerOutputDir,
} from '../../utils/helpers';

const COMMAND_HANDLER_SUFFIX = 'CommandHandler.java';
const EVENT_HANDLER_SUFFIX = 'EventHandler.java';
const QUERY_HANDLER_SUFFIX = 'QueryHandler.java';

/**
 * 
 * @param context 
 */
export const generateHandlers = async (context: RenderContext<DTOConfig>) => {
  const handler = await renderHandler(context);
  const handlerPath = getHandlerPath(context);
  await saveToFile(handler, handlerPath, false);
};

export const renderHandler = async (context: RenderContext<DTOConfig>) => {
  switch(context.resourceConfig.type) {
    case "command":
      return await renderTemplate(TEMPLATES.DDD_LITE_COMMAND_HANDLER, context);
    case "event":
      return await renderTemplate(TEMPLATES.DDD_LITE_EVENT_HANDLER, context);
    case "query":
      return await renderTemplate(TEMPLATES.DDD_LITE_QUERY_HANDLER, context);
    default:
      throw Error("Invalid object type")
  }

};

const getHandlerPath = (context: RenderContext<DTOConfig>) => {
  switch(context.resourceConfig.type) {
    case "command":
      return path.join(getDDDCommandHandlerOutputDir(context), `${context.resourceConfig.name}${COMMAND_HANDLER_SUFFIX}`);
    case "event":
      return path.join(getDDDEventHandlerOutputDir(context), `${context.resourceConfig.name}${EVENT_HANDLER_SUFFIX}`);
    case "query":
      return path.join(getDDDQueryHandlerOutputDir(context), `${context.resourceConfig.name}${EVENT_HANDLER_SUFFIX}`);
    default:
      throw Error("Invalid object type")
  }
}

