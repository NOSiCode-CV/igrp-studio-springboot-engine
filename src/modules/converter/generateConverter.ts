import path from 'path';
import { ControllerConfig, ModelConfig, RenderContext } from '../../interfaces/types';
import { TEMPLATES } from '../../utils/constants';
import { renderTemplate } from '../common/renderTemplate';
import { saveToFile } from '../common/saveToFile';
import {
  getDDDAggDomainConverterOutputDir,
  getDDDConverterOutputDir,
  getDDDDomainConverterOutputDir,
  getServiceDir,
} from '../../utils/helpers';

const AGG_ASSEMBLER_SUFFIX = 'AggregateAssembler.java';
const ASSEMBLER_SUFFIX = 'Assembler.java';
const CONVERTER_SUFFIX = 'Converter.java';

/**
 * 
 * @param context 
 */
export const generateConverter = async (context: RenderContext<ModelConfig>) => {
  const converter = await renderConverter(context);
  const converterPath = getConverterPath(context);
  await saveToFile(converter, converterPath, false);
};

export const renderConverter = async (context: RenderContext<ModelConfig>) => {
  switch(context.resourceConfig.type) {
    case "model":
      return await renderTemplate(TEMPLATES.DDD_CONVERTER_IMPL, context);
    case "domain":
      return await renderTemplate(TEMPLATES.DDD_ASSEMBLER_AGGREGATE_IMPL, context);
    case "domainimpl":
      return await renderTemplate(TEMPLATES.DDD_ASSEMBLER_DATA_IMPL, context);
  }

};

const getConverterPath = (context: RenderContext<ModelConfig>) => {
  switch(context.resourceConfig.type) {
    case "model":
      return path.join(getDDDConverterOutputDir(context), `${context.resourceConfig.name}${CONVERTER_SUFFIX}`);
    case "domain":
      return path.join(getDDDAggDomainConverterOutputDir(context), `${context.resourceConfig.name}${AGG_ASSEMBLER_SUFFIX}`);
    case "domainimpl":
      return path.join(getDDDDomainConverterOutputDir(context), `${context.resourceConfig.name}${ASSEMBLER_SUFFIX}`);
  }
}

