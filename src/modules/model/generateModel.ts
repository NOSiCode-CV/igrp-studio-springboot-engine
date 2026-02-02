import {Attribute, ModelConfig, RemovedRelationReference, RenderContext,} from '../../interfaces/types';
import {renderTemplate} from '../common/renderTemplate';
import {DIRECTORIES, ERROR_MESSAGE, EXTENSIONS, PROJECT_STRUCTURE_STYLE, TEMPLATES,} from '../../utils/constants';
import {saveToFile} from '../common/saveToFile';
import {getDDDModelOutputDir, getModelConfigPath, getModelOutputDir, loadModelConfig,} from '../../utils/helpers';
import path from 'path';
import fs from 'fs-extra';
import {updatePermissions} from '../permission/permissionManagement';
import {saveModelConfig} from './saveModelConfig';
import {capitalizeJavaStyle} from '../../helper/stringHelper';

export const generateModel = async (context: RenderContext<ModelConfig>) => {
  let modelOutputPath: string;

  if (context.baseConfig.projectStructureStyle == PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN)
    modelOutputPath = getDDDModelOutputPath(context);
  else modelOutputPath = getModelOutputPath(context);

  const template = await renderModel(context);

  const errorsUniqueConstraints = validarUniqueConstraints(context.resourceConfig);

  if (errorsUniqueConstraints.length > 0) {
    throw new Error(`Unique constraint errors found:\n${errorsUniqueConstraints.join('\n')}`);
  }

  if (context.baseConfig.projectStructureStyle != PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
    // Ensure the model directory exists before continuing.
    // If it already exists, nothing happens; if not, it will be created.
    const modelDirector = modelDirectory(context);
    await fs.ensureDir(modelDirector);
  }

  const { primaryKey } = context.resourceConfig;

  if (primaryKey) {
    const primaryKeyPath = getPrimaryKeyModelOutputPath(context);
    const primaryKeyTemplate = await renderPrimaryKey(context);
    await saveToFile(primaryKeyTemplate, primaryKeyPath, !context.resourceConfig.readOnly);
  }

  //finding remove relations before saving
  await findRemovedRelations(context);

  await saveToFile(
    template,
    modelOutputPath,
    !context.resourceConfig.readOnly,
    DIRECTORIES.MODELS,
    context.resourceConfig.id,
    context.resourceConfig.module,
    context.basePath,
  );

  await saveModelConfig(context.resourceConfig, context.basePath);

  // Once the model has been generated, we will assign the necessary permissions to its endpoints.
  // This ensures that the newly created model has the correct access rights configured
  // for each endpoint based on its defined permissions.
  await updatePermissions(
    context.resourceConfig.module ?? DIRECTORIES.SHARED,
    context.basePath,
    context.resourceConfig.type,
  );
};

async function findRemovedRelations(context: RenderContext<ModelConfig>) {
  const modulo = context.resourceConfig.module ?? DIRECTORIES.SHARED;
  const modelPath = getModelConfigPath(modulo, context.resourceConfig.name, context.basePath);
  const modelExists = await fs.pathExists(modelPath);
  //console.log('modelPath:: ', modelPath)
  const removedRelations: RemovedRelationReference[] = [];
  //console.log('---------------------------------------------------------------------')
  if (modelExists) {
    const modelDirPath = path.dirname(modelPath);
    const oldModel: ModelConfig = await loadModelConfig<ModelConfig>(
      modelDirPath,
      context.resourceConfig.name,
    );
    const newModel: ModelConfig = { ...context.resourceConfig }; // getting the new model

    for (const oldAttr of oldModel.attributes) {
      if (oldAttr.type === 'relation' && oldAttr.relation) {
        const matchingAttr = newModel.attributes.find((attr) => attr.name === oldAttr.name);

        if (!matchingAttr || matchingAttr.type !== 'relation' || !matchingAttr.relation) {
          const modulo = oldAttr.relation.module ?? DIRECTORIES.SHARED;
          const removedRelation: RemovedRelationReference = {
            entity: oldAttr.relation.entity,
            module: modulo,
          };
          removedRelations.push(removedRelation);
        }
      }
    }
  }

  if (removedRelations.length > 0) {
    for (const removedRelation of removedRelations) {
      await removeRelationFromModel(context, removedRelation, context.resourceConfig.name);
    }
  }
}

async function removeRelationFromModel(
  context: RenderContext<ModelConfig>,
  removedRelationReference: RemovedRelationReference,
  modelToRemoveRelation: string,
) {
  let modelOutputPath: string;
  const modelName = removedRelationReference.entity;
  const moduleName = removedRelationReference.module;

  const modelPath = getModelConfigPath(moduleName, modelName, context.basePath);
  const modelDirPath = path.dirname(modelPath);
  const modelExists = await fs.pathExists(modelPath);

  if (!modelExists) {
    throw new Error(`relation reference model '${modelName}' not found in path ${modelPath}`);
  }

  const config = await loadModelConfig<ModelConfig>(modelDirPath, modelName);

  // Remove relações com a entidade informada
  if (config.relationReference && Array.isArray(config.relationReference)) {
    config.relationReference = config.relationReference.filter(
      (rel) => rel.entity !== modelToRemoveRelation,
    );
  }

  const relationReferenceContext: RenderContext<ModelConfig> = {
    ...context,
    resourceConfig: config,
  };

  if (context.baseConfig.projectStructureStyle == PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN)
    modelOutputPath = getDDDModelOutputPath(relationReferenceContext);
  else modelOutputPath = getModelOutputPath(relationReferenceContext);

  const template = await renderModel(relationReferenceContext);

  await saveToFile(
    template,
    modelOutputPath,
    true,
    DIRECTORIES.MODELS,
    relationReferenceContext.resourceConfig.id,
    relationReferenceContext.resourceConfig.module,
    relationReferenceContext.basePath,
  );

  await saveModelConfig(relationReferenceContext.resourceConfig, relationReferenceContext.basePath);
}

/**
 * Generates the model in the API using the provided configuration.
 * @param context - The configuration of the model including the model name and attributes.
 * @returns - A string representing the model generated from the template.
 * @throws - Throws an error if the model configuration is invalid or has no attributes.
 */
const renderModel = async (context: RenderContext<ModelConfig>) => {
  context.dateTimeAttributes = dateTimeUniqueAttributes(context.resourceConfig.attributes);
  context.mathAttributes = mathUniquesAttributes(context.resourceConfig.attributes);

  if (context.resourceConfig.attributes.length === 0) {
    throw ERROR_MESSAGE.EMPTY_ATTRIBUTE;
  }

  // Validação e renderização de cada atributo com seu valor padrão
  context.resourceConfig.attributes.forEach((attribute) => {
    if (attribute.defaultValue) {
      renderColumnWithDefault(attribute);
    }
  });

  // Gerar as restrições únicas compostas
  context.uniqueConstraints = context.resourceConfig.uniqueConstraints || [];

  return await renderTemplate(TEMPLATES.DOMAIN_MODEL, context);
};

const renderPrimaryKey = async (context: RenderContext<ModelConfig>) => {
  return await renderTemplate(TEMPLATES.DOMAIN_MODEL_PRIMARY_KEY, context);
};

const dateTimeUniqueAttributes = (attributes: Attribute[]) => {
  let dateTimeAttributes: string[] = [];
  attributes.forEach((attribute) => {
    if (
      attribute.type === 'LocalTime' ||
      attribute.type === 'LocalDate' ||
      attribute.type === 'LocalDateTime' ||
      attribute.type === 'ZoneDateTime' ||
      attribute.type === 'OffsetDateTime' ||
      attribute.type === 'Instant'
    ) {
      dateTimeAttributes.push(attribute.type);
    }
  });

  return [...new Set(dateTimeAttributes)];
};

// Verefica existencia de atributos de alta precisão
const mathUniquesAttributes = (attributes: Attribute[]) => {
  let mathAttributes: string[] = [];
  attributes.forEach((attribute) => {
    if (attribute.type === 'BigInteger' || attribute.type === 'BigDecimal') {
      mathAttributes.push(attribute.type);
    }
  });

  return [...new Set(mathAttributes)];
};

const validateColumnDefault = (attribute: Attribute) => {
  const { type, defaultValue } = attribute;

  if (defaultValue) {
    // Só valida se defaultValue estiver presente
    if (
      ['integer', 'biginteger', 'bigdecimal', 'long', 'double', 'float', 'short', 'byte'].includes(
        type,
      )
    ) {
      // Verifica se o valor padrão é um número válido
      if (isNaN(Number(defaultValue))) {
        throw new Error(
          `The default value "${defaultValue}" is not valid for the numeric type ${type}.`,
        );
      }
    } else if (type === 'String') {
      // Verifica se o valor padrão é uma string válida (permite espaço no meio)
      if (!/^\S.*\S$/.test(defaultValue)) {
        throw new Error(
          `The default value "${defaultValue}" is not valid for the string type ${type}.`,
        );
      }
    } else if (type === 'Boolean') {
      // Verifica se o valor padrão é "true" ou "false"
      if (!['true', 'false'].includes(defaultValue.toLowerCase())) {
        throw new Error(
          `The default value "${defaultValue}" is not valid for the boolean type ${type}.`,
        );
      }
    } else {
      //console.warn(`No specific validation for the type ${type}.`);
    }
  }
};

const renderColumnWithDefault = (attribute: Attribute) => {
  validateColumnDefault(attribute);

  if (attribute.defaultValue) {
    return `@ColumnDefault('${attribute.defaultValue}')`;
  }

  return ''; // Caso não tenha valor padrão, não retorna a anotação
};

// Função para validar as colunas de uniqueConstraints
function validarUniqueConstraints(modelConfig: ModelConfig): string[] {
  const attributeNames = modelConfig.attributes.map((attr) => attr.name); // Pegar todos os nomes dos atributos
  const erros: string[] = [];

  // Verificar cada uniqueConstraint
  if (modelConfig.uniqueConstraints) {
    modelConfig.uniqueConstraints.forEach((constraint) => {
      constraint.columns.forEach((column) => {
        if (!attributeNames.includes(column)) {
          erros.push(
            `A coluna '${column}' definida em uniqueConstraints não corresponde a nenhum atributo.`,
          );
        }
      });
    });
  }

  return erros;
}

// Caminho onde o arquivo é salvo
const getModelOutputPath = (context: RenderContext<ModelConfig>) => {
  const outputDir = getModelOutputDir(context);
  const fileName = capitalizeJavaStyle(context.resourceConfig.name);
  context.fullPath = outputDir;
  return path.join(outputDir, `${fileName}${EXTENSIONS.JAVA}`);
};

// Caminho onde o arquivo é salvo
const getDDDModelOutputPath = (context: RenderContext<ModelConfig>) => {
  const outputDir = getDDDModelOutputDir(context);
  const fileName = capitalizeJavaStyle(context.resourceConfig.name);
  context.fullPath = outputDir;
  return path.join(outputDir, `${fileName}${EXTENSIONS.JAVA}`);
};

const getPrimaryKeyModelOutputPath = (context: RenderContext<ModelConfig>) => {
  if (context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
    const outputDir = getDDDModelOutputDir(context);
    context.fullPath = outputDir;
    return path.join(outputDir, `${context.resourceConfig.name}PrimaryKey${EXTENSIONS.JAVA}`);
  } else {
    const outputDir = getModelOutputDir(context);
    context.fullPath = outputDir;
    return path.join(outputDir, `${context.resourceConfig.name}PrimaryKey${EXTENSIONS.JAVA}`);
  }
};

const modelDirectory = (context: RenderContext<ModelConfig>) => {
  if (context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
    const outputDir = getDDDModelOutputDir(context);
    context.fullPath = outputDir;
    return path.join(outputDir);
  } else {
    const outputDir = getModelOutputDir(context);
    context.fullPath = outputDir;
    return path.join(outputDir);
  }
};
