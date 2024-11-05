import { Attribute, ModelConfig, RenderContext } from '../../interfaces/types';
import { renderTemplate } from '../common/renderTemplate';
import { ERROR_MESSAGE, EXTENSIONS, TEMPLATES } from '../../utils/constants';
import { saveToFile } from '../common/saveToFile';
import { getModelOutputDir } from '../../utils/helpers';
import path from 'path';
import fs from 'fs-extra';

export const generateModel = async (context: RenderContext<ModelConfig>) => {
  const template = await renderModel(context);
  const modelOutputPath = getModelOutputPath(context);

  const errosUniqueConstraints = validarUniqueConstraints(context.resourceConfig);

  if (errosUniqueConstraints.length > 0) {
    throw new Error(`Erros de uniqueConstraints encontrados:\n${errosUniqueConstraints.join('\n')}`);
  }

  // Before creating the model with the new configuration, the engine checks if a model directory already exists.
  // If it does, the old model directory will be deleted to ensure a clean setup for the new model.
  const modelDirector = modelDirectory(context);
  if (await fs.pathExists(modelDirector)) await fs.rm(modelDirector, { recursive: true });

  const {primaryKey} = context.resourceConfig

  if (primaryKey) {
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

    // Gerar as restrições únicas compostas
  context.uniqueConstraints = context.resourceConfig.uniqueConstraints || [];

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
    } else if (type === 'Boolean') {
      // Verifica se o valor padrão é "true" ou "false"
      if (!['true', 'false'].includes(defaultValue.toLowerCase())) {
        throw new Error(`The default value "${defaultValue}" is not valid for the boolean type ${type}.`);
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

// Função para validar as colunas de uniqueConstraints
function validarUniqueConstraints(modelConfig: ModelConfig): string[] {
  const attributeNames = modelConfig.attributes.map(attr => attr.name); // Pegar todos os nomes dos atributos
  const erros: string[] = [];

  // Verificar cada uniqueConstraint
  if (modelConfig.uniqueConstraints) {
    modelConfig.uniqueConstraints.forEach(constraint => {
      constraint.columns.forEach(column => {
        if (!attributeNames.includes(column)) {
          erros.push(`A coluna '${column}' definida em uniqueConstraints não corresponde a nenhum atributo.`);
        }
      });
    });
  }

  return erros;
}

// Caminho onde o arquivo é salvo
const getModelOutputPath = (context: RenderContext<ModelConfig>) => 
  path.join(getModelOutputDir(context), `${context.resourceConfig.name}${EXTENSIONS.JAVA}`)

const getPrimaryKeyModelOutputPath = (context: RenderContext<ModelConfig>) => 
  path.join(getModelOutputDir(context), `PrimaryKey${EXTENSIONS.JAVA}`)

const modelDirectory = (context: RenderContext<ModelConfig>) => 
  path.join(getModelOutputDir(context))




