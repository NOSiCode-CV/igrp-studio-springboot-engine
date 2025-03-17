import path from 'path';
import { DTOConfig, RenderContext } from '../../interfaces/types';
import { TEMPLATES } from '../../utils/constants';
import { renderTemplate } from '../common/renderTemplate';
import { saveToFile } from '../common/saveToFile';
import {
  getDDDCommandHandlerOutputDir,
  getDDDEventHandlerOutputDir, getDDDQueryHandlerOutputDir,
} from '../../utils/helpers';

const COMMAND_HANDLER_SUFFIX = 'CommandHandler.java';
const EVENT_HANDLER_SUFFIX = 'EventHandler.java';
const QUERY_HANDLER_SUFFIX = 'QueryHandler.java';

/**
 * 
 * @param context 
 */
export const generateHandlers = async (context: RenderContext<DTOConfig>) => {
  const handlerPath = getHandlerPath(context);
  const handler = await renderHandler(context);
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
  switch (context.resourceConfig.type) {
    case 'command': {
      const outputDir = getDDDCommandHandlerOutputDir(context)
      context.fullPath = outputDir
      return path.join(
        outputDir,
        `${context.resourceConfig.name}${COMMAND_HANDLER_SUFFIX}`,
      );
    }
    case 'event': {
      const outputDir = getDDDEventHandlerOutputDir(context)
      context.fullPath = outputDir
      return path.join(
        outputDir,
        `${context.resourceConfig.name}${EVENT_HANDLER_SUFFIX}`,
      );
    }
    case 'query': {
      const outputDir = getDDDQueryHandlerOutputDir(context)
      context.fullPath = outputDir
      return path.join(outputDir, `${context.resourceConfig.name}${QUERY_HANDLER_SUFFIX}`);
    }
    default:
      throw Error('Invalid object type');
  }
}