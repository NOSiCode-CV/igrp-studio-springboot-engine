import { Attribute, ModelConfig, RenderContext } from '../../interfaces/types';
import { renderTemplate } from '../common/renderTemplate';
import { ERROR_MESSAGE, EXTENSIONS, TEMPLATES } from '../../utils/constants';
import { saveToFile } from '../common/saveToFile';
import { getModelOutputDir } from '../../utils/helpers';
import path from 'path';

export const generateModel = async (context: RenderContext<ModelConfig>) => {
  const template = await renderModel(context);
  const modelOutputPath = getModelOutputPath(context);

 if (context.resourceConfig.primaryKey) {
  const primaryKeyTemplate = await renderPrimaryKey(context);
  const primaryKeyPath = getPrimaryKeyModelOutputPath(context);

  await saveToFile(primaryKeyTemplate, primaryKeyPath);
 }
 
  await saveToFile(template, modelOutputPath);
};

/**
 * Generates the model in the API using the provided configuration.
 * @param ontext - The configuration of the model including the model name and attributes.
 * @returns - A string representing the model generated from the template.
 * @throws - Throws an error if the model configuration is invalid or has no attributes.
 */
const renderModel = async (context: RenderContext<ModelConfig>) => {
  context.sqlAttributes = sqlUniquesAttributes(context.resourceConfig.attributes)
  context.mathAttributes = mathUniquesAttributes(context.resourceConfig.attributes)

  if (context.resourceConfig.attributes.length === 0) {
    throw ERROR_MESSAGE.EMPTY_ATTRIBUTE;
  }

    // Validação e renderização de cada atributo com seu valor padrão
    context.resourceConfig.attributes.forEach(attribute => {
      if (attribute.defaultValue) {
        const columnAnnotation = renderColumnWithDefault(attribute);
      }
    });

  return await renderTemplate(TEMPLATES.DOMAIN_MODEL, context);
};

const renderPrimaryKey = async(context: RenderContext<ModelConfig>) => {
  return await renderTemplate(TEMPLATES.DOMAIN_MODEL_PRIMARY_KEY, context);
}

const sqlUniquesAttributes = (attributes: Attribute[]) => {
  let sqlAttributes: string[] = [];
  attributes.forEach(attribute => {
    if (attribute.type === "Date" || attribute.type === "Time" || attribute.type === "Timestamp"){
      sqlAttributes.push(attribute.type)
    }
  })

  return [...new Set(sqlAttributes)]
}
// Verefica existencia de atributos de alta precisão
const mathUniquesAttributes = (attributes: Attribute[]) => {
  let mathAttributes: string[] = [];
  attributes.forEach(attribute => {
    if (attribute.type === "BigInteger" || attribute.type === "BigDecimal"){
      mathAttributes.push(attribute.type)
    }
  })

  return [...new Set(mathAttributes)]
}

const validateColumnDefault = (attribute: Attribute) => {
  const { type, defaultValue } = attribute;

  if (defaultValue) { // Só valida se defaultValue estiver presente
    if (['Integer', 'BigInteger', 'BigDecimal', 'Long', 'Double', 'Float', 'Short', 'Byte'].includes(type)) {
      // Verifica se o valor padrão é um número válido
      if (isNaN(Number(defaultValue))) {
        throw new Error(`The default value "${defaultValue}" is not valid for the numeric type ${type}.`);
      }
    } else if (type === 'String') {
      // Verifica se o valor padrão é uma string válida (permite espaço no meio)
      if (!/^\S.*\S$/.test(defaultValue)) {
        throw new Error(`The default value "${defaultValue}" is not valid for the string type ${type}.`);
      }
    } else {
      console.warn(`No specific validation for the type ${type}.`);
    }
  }
};

const renderColumnWithDefault = (attribute: Attribute) => {
  validateColumnDefault(attribute);

  if (attribute.defaultValue) {
    return `@ColumnDefault(${attribute.defaultValue})`;
  }

  return ''; // Caso não tenha valor padrão, não retorna a anotação
};

// Caminho onde o arquivo é salvo
const getModelOutputPath = (context: RenderContext<ModelConfig>) => 
  path.join(getModelOutputDir(context), `${context.resourceConfig.name}${EXTENSIONS.JAVA}`)

const getPrimaryKeyModelOutputPath = (context: RenderContext<ModelConfig>) => 
  path.join(getModelOutputDir(context), `PrimaryKey${EXTENSIONS.JAVA}`)



