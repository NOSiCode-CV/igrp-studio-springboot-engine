import path from 'path';
import fs from 'fs-extra';
import {GraphQLFieldDef, GraphQLSchemaConfig, ModelConfig, RenderContext} from '../../interfaces/types';
import {DIRECTORIES, EXTENSIONS, PROJECT_STRUCTURE_STYLE, TEMPLATES} from '../../utils/constants';
import {renderTemplate} from '../common/renderTemplate';
import {saveToFile} from '../common/saveToFile';
import {saveGraphQLConfig} from './saveGraphQLConfig';
import {getMainPath, replaceTemplate} from '../../utils/helpers';
import {capitalizeJavaStyle} from '../../helper/stringHelper';
import {resolveGraphQLScalar} from '../../helper/graphqlHelper';

// ─── Path helpers ────────────────────────────────────────────────────────────

/**
 * Returns the absolute output path for the .graphqls schema file.
 * Always goes to src/main/resources/graphql/<name>.graphqls
 */
const getGraphQLSchemaFilePath = (context: RenderContext<GraphQLSchemaConfig>): string => {
  const name = capitalizeJavaStyle(context.resourceConfig.name);
  return path.join(
    context.basePath,
    'src/main/resources/graphql',
    `${name}.graphqls`,
  );
};

/**
 * Returns the absolute output path for the Resolver Java file.
 * - Technical: <mainPath>/graphql/<name>/<Name>Resolver.java   (own subfolder per entity, like controllers/<name>/)
 * - Domain:    <mainPath>/<module>/interfaces/graphql/<Name>Resolver.java
 */
const getResolverFilePath = (context: RenderContext<GraphQLSchemaConfig>): string => {
  const name = capitalizeJavaStyle(context.resourceConfig.name);
  const mainPath = path.join(context.basePath, getMainPath(context.baseConfig.group, context.baseConfig.packageName));

  if (context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
    const module = (context.resourceConfig.module ?? DIRECTORIES.SHARED).toLowerCase();
    const dir = path.join(mainPath, module, DIRECTORIES.INTERFACE, DIRECTORIES.GRAPHQL);
    context.fullPath = dir;
    return path.join(dir, `${name}Resolver.java`);
  } else {
    const dir = path.join(mainPath, DIRECTORIES.GRAPHQL, context.resourceConfig.name.toLowerCase());
    context.fullPath = dir;
    return path.join(dir, `${name}Resolver.java`);
  }
};

/**
 * Returns the absolute output path for the GraphQL Service Interface (technical only).
 * Lives alongside the resolver in graphql/<name>/
 */
const getServiceInterfaceFilePath = (context: RenderContext<GraphQLSchemaConfig>): string => {
  const name = capitalizeJavaStyle(context.resourceConfig.name);
  const mainPath = path.join(context.basePath, getMainPath(context.baseConfig.group, context.baseConfig.packageName));
  const dir = path.join(mainPath, DIRECTORIES.GRAPHQL, context.resourceConfig.name.toLowerCase());
  return path.join(dir, `I${name}GraphQLService.java`);
};

/**
 * Returns the absolute output path for the GraphQL Service Implementation (technical only).
 * Lives alongside the resolver in graphql/<name>/
 */
const getServiceImplFilePath = (context: RenderContext<GraphQLSchemaConfig>): string => {
  const name = capitalizeJavaStyle(context.resourceConfig.name);
  const mainPath = path.join(context.basePath, getMainPath(context.baseConfig.group, context.baseConfig.packageName));
  const dir = path.join(mainPath, DIRECTORIES.GRAPHQL, context.resourceConfig.name.toLowerCase());
  return path.join(dir, `${name}GraphQLService.java`);
};

/**
 * Returns the absolute output path for the DataLoader (generated once, only when relations present).
 * - Technical: graphql/<name>/<Name>DataLoader.java
 * - Domain:    <module>/interfaces/graphql/<Name>DataLoader.java
 */
const getDataLoaderFilePath = (context: RenderContext<GraphQLSchemaConfig>): string => {
  const name = capitalizeJavaStyle(context.resourceConfig.name);
  const mainPath = path.join(context.basePath, getMainPath(context.baseConfig.group, context.baseConfig.packageName));

  if (context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
    const module = (context.resourceConfig.module ?? DIRECTORIES.SHARED).toLowerCase();
    const dir = path.join(mainPath, module, DIRECTORIES.INTERFACE, DIRECTORIES.GRAPHQL);
    return path.join(dir, `${name}DataLoader.java`);
  } else {
    const dir = path.join(mainPath, DIRECTORIES.GRAPHQL, context.resourceConfig.name.toLowerCase());
    return path.join(dir, `${name}DataLoader.java`);
  }
};

// ─── Field resolution from modelRef ──────────────────────────────────────────

/**
 * Reads the model config from .igrpstudio/<module>/models/<ModelRef>.json
 * and converts its attributes to GraphQLFieldDef.
 */
const resolveFieldsFromModelRef = async (
  modelRef: string,
  module: string,
  basePath: string,
): Promise<GraphQLFieldDef[]> => {
  const configPath = path.join(
    basePath,
    replaceTemplate(DIRECTORIES.CONFIG_MODEL, { module }),
    `${capitalizeJavaStyle(modelRef)}${EXTENSIONS.JSON}`,
  );

  if (!(await fs.pathExists(configPath))) {
    throw new Error(
      `Model config not found for modelRef '${modelRef}' in module '${module}'. Expected at: ${configPath}`,
    );
  }

  const modelConfig: ModelConfig = await fs.readJSON(configPath);

  return modelConfig.attributes
    .filter((attr) => attr.type !== 'relation') // skip relation attributes
    .map((attr) => ({
      name: attr.name,
      type: attr.type,
      nullable: attr.nullable ?? true,
    }));
};

// ─── Context enrichment ───────────────────────────────────────────────────────

/**
 * Enriches the render context with resolved fields (from modelRef or direct fields)
 * and computed properties for templates.
 */
export const enrichGraphQLContext = async (
  context: RenderContext<GraphQLSchemaConfig>,
): Promise<RenderContext<GraphQLSchemaConfig> & { resolvedFields: GraphQLFieldDef[]; graphqlScalar: (t: string) => string }> => {
  const { resourceConfig, basePath } = context;
  const module = resourceConfig.module ?? DIRECTORIES.SHARED;

  let resolvedFields: GraphQLFieldDef[] = resourceConfig.fields ?? [];

  if (resourceConfig.modelRef) {
    const modelFields = await resolveFieldsFromModelRef(resourceConfig.modelRef, module, basePath);
    // fields from config take priority (merge: modelRef fields first, then config fields override by name)
    const configFieldNames = new Set(resolvedFields.map((f) => f.name));
    const filteredModelFields = modelFields.filter((f) => !configFieldNames.has(f.name));
    resolvedFields = [...filteredModelFields, ...resolvedFields];
  }

  return {
    ...context,
    resolvedFields,
    graphqlScalar: resolveGraphQLScalar,
  };
};

// ─── Main entry ──────────────────────────────────────────────────────────────

/**
 * Generates all GraphQL-related files for a given GraphQL schema config.
 *
 * Files always regenerated:
 *   - src/main/resources/graphql/<Name>.graphqls
 *   - <package>/graphql/<Name>Resolver.java (technical)
 *   - <package>/<module>/interfaces/graphql/<Name>Resolver.java (domain)
 *
 * Files generated ONCE (skip if exists):
 *   - <package>/graphql/<Name>GraphQLService.java  (technical only)
 *   - <package>/graphql/I<Name>GraphQLService.java (technical only)
 *   - <package>/<module>/interfaces/graphql/<Name>DataLoader.java (when relations present)
 *
 * Manifest always saved:
 *   - .igrpstudio/<module>/graphql/<Name>.json
 */
export const generateGraphQLSchema = async (context: RenderContext<GraphQLSchemaConfig>): Promise<void> => {
  const enriched = await enrichGraphQLContext(context);

  // 1. Save manifest — always
  await saveGraphQLConfig(context.resourceConfig, context.basePath);

  // 2. Generate .graphqls schema file — always regenerated
  await generateSchemaFile(enriched);

  // 3. Generate Resolver — always regenerated
  await generateResolverFile(enriched);

  const isDomain = context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN;

  if (!isDomain) {
    // 4a. Technical: generate service interface (once)
    await generateServiceInterfaceFile(enriched);

    // 4b. Technical: generate service implementation (once)
    await generateServiceImplFile(enriched);
  }

  // 5. DataLoader — only when relations are defined, generated once
  const hasRelations =
    Array.isArray(context.resourceConfig.relations) &&
    context.resourceConfig.relations.length > 0;

  if (hasRelations) {
    await generateDataLoaderFile(enriched);
  }
};

// ─── Sub-generators ───────────────────────────────────────────────────────────

const generateSchemaFile = async (context: any): Promise<void> => {
  const schemaContent = await renderTemplate(TEMPLATES.GRAPHQL_SCHEMA, context);
  const outputPath = getGraphQLSchemaFilePath(context);
  await fs.ensureDir(path.dirname(outputPath));
  // Always regenerated — no duplicate check, plain write
  await fs.writeFile(outputPath, schemaContent, 'utf-8');
};

const generateResolverFile = async (context: any): Promise<void> => {
  // fullPath must be set BEFORE renderTemplate so {{resolve-package fullPath basePath}} works
  const outputPath = getResolverFilePath(context);
  const resolverContent = await renderTemplate(TEMPLATES.GRAPHQL_RESOLVER, context);
  await saveToFile(resolverContent, outputPath, true);
};

const generateServiceInterfaceFile = async (context: any): Promise<void> => {
  const outputPath = getServiceInterfaceFilePath(context);
  // Always regenerated — interface is the contract between resolver and service
  context.fullPath = path.dirname(outputPath);
  const content = await renderTemplate(TEMPLATES.GRAPHQL_SERVICE_INTERFACE, context);
  await saveToFile(content, outputPath, true);
};

const generateServiceImplFile = async (context: any): Promise<void> => {
  const outputPath = getServiceImplFilePath(context);
  const exists = await fs.pathExists(outputPath);
  if (exists) return; // generated once — skip if exists
  // Set fullPath so package-java partial resolves correctly
  context.fullPath = path.dirname(outputPath);
  const content = await renderTemplate(TEMPLATES.GRAPHQL_SERVICE, context);
  await saveToFile(content, outputPath, false);
};

const generateDataLoaderFile = async (context: any): Promise<void> => {
  const outputPath = getDataLoaderFilePath(context);
  const exists = await fs.pathExists(outputPath);
  if (exists) return; // generated once — skip if exists
  // Set fullPath so package-java partial resolves correctly
  context.fullPath = path.dirname(outputPath);
  const content = await renderTemplate(TEMPLATES.GRAPHQL_DATALOADER, context);
  await saveToFile(content, outputPath, false);
};
