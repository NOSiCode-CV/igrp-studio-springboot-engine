import path from 'path';
import { ModelConfig, RenderContext } from '../../interfaces/types';
import { TEMPLATES } from '../../utils/constants';
import { renderTemplate } from '../common/renderTemplate';
import { saveToFile } from '../common/saveToFile';
import {
  getDDDAggDomainConverterOutputDir,
  getDDDConverterOutputDir,
  getDDDDomainConverterOutputDir,
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

export const generateAggregateConverter = async (context: RenderContext<ModelConfig>) => {
    const converter = await renderAggregateConverter(context);
    const converterPath = getAggregateConverterPath(context);
    await saveToFile(converter, converterPath, false);
};

export const generateDomainConverter = async (context: RenderContext<ModelConfig>) => {
    const converter = await renderDomainConverter(context);
    const converterPath = getDomainConverterPath(context);
    await saveToFile(converter, converterPath, false);
};

export const renderConverter = async (context: RenderContext<ModelConfig>) => {
    return await renderTemplate(TEMPLATES.DDD_CONVERTER_IMPL, context);
};

export const renderAggregateConverter = async (context: RenderContext<ModelConfig>) => {
    return await renderTemplate(TEMPLATES.DDD_ASSEMBLER_AGGREGATE_IMPL, context);
};

export const renderDomainConverter = async (context: RenderContext<ModelConfig>) => {
    return await renderTemplate(TEMPLATES.DDD_ASSEMBLER_DATA_IMPL, context);
};

const getConverterPath = (context: RenderContext<ModelConfig>) => {
    return path.join(getDDDConverterOutputDir(context), `${context.resourceConfig.name}${CONVERTER_SUFFIX}`);
}

const getAggregateConverterPath = (context: RenderContext<ModelConfig>) => {
    return path.join(getDDDAggDomainConverterOutputDir(context), `${context.resourceConfig.name}${AGG_ASSEMBLER_SUFFIX}`);
}

const getDomainConverterPath = (context: RenderContext<ModelConfig>) => {
    return path.join(getDDDDomainConverterOutputDir(context), `${context.resourceConfig.name}${ASSEMBLER_SUFFIX}`);
}



