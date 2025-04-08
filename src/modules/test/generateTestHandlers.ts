import path from 'path';
import { DTOConfig, RenderContext } from '../../interfaces/types';
import { TEMPLATES } from '../../utils/constants';
import { renderTemplate } from '../common/renderTemplate';
import { saveToFile } from '../common/saveToFile';
import {
  getDDDTestCommandHandlerOutputDir,
  getDDDTestEventHandlerOutputDir, getDDDTestQueryHandlerOutputDir,
} from '../../utils/helpers';

const COMMAND_HANDLER_SUFFIX = 'CommandHandlerTest.java';
const EVENT_HANDLER_SUFFIX = 'EventHandlerTest.java';
const QUERY_HANDLER_SUFFIX = 'QueryHandlerTest.java';

/**
 * 
 * @param context 
 */
export const generateTestHandlers = async (context: RenderContext<DTOConfig>) => {
  const handlerPath = getTestHandlerPath(context);
  const handler = await renderTestHandler(context);
  await saveToFile(handler, handlerPath, false);
};

export const renderTestHandler = async (context: RenderContext<DTOConfig>) => {
  switch(context.resourceConfig.type) {
    case "command":
      return await renderTemplate(TEMPLATES.DDD_LITE_TEST_COMMAND_HANDLER, context);
    case "event":
      return await renderTemplate(TEMPLATES.DDD_LITE_TEST_EVENT_HANDLER, context);
    case "query":
      return await renderTemplate(TEMPLATES.DDD_LITE_TEST_QUERY_HANDLER, context);
    default:
      throw Error("Invalid object type")
  }

};

const getTestHandlerPath = (context: RenderContext<DTOConfig>) => {
  switch (context.resourceConfig.type) {
    case 'command': {
      const outputDir = getDDDTestCommandHandlerOutputDir(context)
      context.fullPath = outputDir
      return path.join(
        outputDir,
        `${context.resourceConfig.name}${COMMAND_HANDLER_SUFFIX}`,
      );
    }
    case 'event': {
      const outputDir = getDDDTestEventHandlerOutputDir(context)
      context.fullPath = outputDir
      return path.join(
        outputDir,
        `${context.resourceConfig.name}${EVENT_HANDLER_SUFFIX}`,
      );
    }
    case 'query': {
      const outputDir = getDDDTestQueryHandlerOutputDir(context)
      context.fullPath = outputDir
      return path.join(outputDir, `${context.resourceConfig.name}${QUERY_HANDLER_SUFFIX}`);
    }
    default:
      throw Error('Invalid object type');
  }
}