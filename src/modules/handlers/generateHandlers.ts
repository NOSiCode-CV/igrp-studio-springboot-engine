import path from 'path';
import { DTOConfig, RenderContext } from '../../interfaces/types';
import { TEMPLATES } from '../../utils/constants';
import { renderTemplate } from '../common/renderTemplate';
import { saveToFile } from '../common/saveToFile';
import { getDDDAggregateElementsOutputDir } from '../../utils/helpers';

const HANDLER_SUFFIX = 'CommandHandler.java';

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
      return await renderTemplate(TEMPLATES.DDD_COMMAND_HANDLER_IMPL, context);
    default:
      throw Error("Invalid object type")
  }

};

const getHandlerPath = (context: RenderContext<DTOConfig>) => {
  switch(context.resourceConfig.type) {
    case "command":
      return path.join(getDDDAggregateElementsOutputDir(context), `${context.resourceConfig.name}${HANDLER_SUFFIX}`);
    default:
      throw Error("Invalid object type")
  }
}

