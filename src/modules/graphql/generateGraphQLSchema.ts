import path from 'path';
import fs from 'fs-extra';
import {DTOConfig, GraphQLSchemaConfig, RenderContext} from '../../interfaces/types';
import {DIRECTORIES, EXTENSIONS, PROJECT_STRUCTURE_STYLE, TEMPLATES} from '../../utils/constants';
import {renderTemplate} from '../common/renderTemplate';
import {saveToFile} from '../common/saveToFile';
import {saveGraphQLConfig} from './saveGraphQLConfig';
import {getGraphQLTypeConfigPath, getMainPath, replaceTemplate} from '../../utils/helpers';
import {capitalizeJavaStyle} from '../../helper/stringHelper';
import {resolveGraphQLScalar, resolveJavaTypeForGraphQL} from '../../helper/graphqlHelper';

// ─── Manifest loaders ────────────────────────────────────────────────────────

/**
 * Loads a graphqlType or graphqlInput manifest from
 * .igrpstudio/<module>/graphql/types/<name>.json
 */
const loadGraphQLTypeManifest = async (
  name: string,
  module: string,
  basePath: string,
): Promise<DTOConfig> => {
  const configPath = path.join(
    basePath,
    replaceTemplate(DIRECTORIES.CONFIG_GRAPHQL_TYPES, { module }),
    `${name}${EXTENSIONS.JSON}`,
  );

  if (!(await fs.pathExists(configPath))) {
    throw new Error(
      `GraphQL type manifest not found for '${name}' in module '${module}'. Expected at: ${configPath}`,
    );
  }

  return fs.readJSON(configPath) as Promise<DTOConfig>;
};

/**
 * Auto-saves a Page manifest for the given type into the types folder.
 * The Page type is always derived from a typeRef, so contentTypeRef stores the reference.
 */
const savePageManifest = async (
  pageName: string,
  contentTypeRef: string,
  module: string,
  basePath: string,
): Promise<DTOConfig> => {
  const manifest: DTOConfig = {
    type: 'graphqlType',
    name: pageName,
    module,
    template: 'classic',
    attributes: [
      { name: 'content', type: contentTypeRef, required: true, objectType: 'graphqlType', collectionType: 'list' },
      { name: 'totalElements', type: 'long', required: true, objectType: 'java' },
      { name: 'totalPages', type: 'integer', required: true, objectType: 'java' },
      { name: 'pageNumber', type: 'integer', required: true, objectType: 'java' },
    ],
  };

  const configPath = getGraphQLTypeConfigPath(module, pageName, basePath);
  await fs.ensureDir(path.dirname(configPath));
  await fs.writeJSON(configPath, manifest, { spaces: 2 });

  return manifest;
};

// ─── Path helpers ────────────────────────────────────────────────────────────

const getGraphQLSchemaFilePath = (context: RenderContext<GraphQLSchemaConfig>): string => {
  const name = capitalizeJavaStyle(context.resourceConfig.name);
  return path.join(context.basePath, 'src/main/resources/graphql', `${name}.graphqls`);
};

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

const getServiceInterfaceFilePath = (context: RenderContext<GraphQLSchemaConfig>): string => {
  const name = capitalizeJavaStyle(context.resourceConfig.name);
  const mainPath = path.join(context.basePath, getMainPath(context.baseConfig.group, context.baseConfig.packageName));
  const dir = path.join(mainPath, DIRECTORIES.GRAPHQL, context.resourceConfig.name.toLowerCase());
  return path.join(dir, `I${name}GraphQLService.java`);
};

const getServiceImplFilePath = (context: RenderContext<GraphQLSchemaConfig>): string => {
  const name = capitalizeJavaStyle(context.resourceConfig.name);
  const mainPath = path.join(context.basePath, getMainPath(context.baseConfig.group, context.baseConfig.packageName));
  const dir = path.join(mainPath, DIRECTORIES.GRAPHQL, context.resourceConfig.name.toLowerCase());
  return path.join(dir, `${name}GraphQLService.java`);
};

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

const getPageTypeFilePath = (context: RenderContext<GraphQLSchemaConfig>, pageName: string): string => {
  const mainPath = path.join(context.basePath, getMainPath(context.baseConfig.group, context.baseConfig.packageName));

  if (context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
    const module = (context.resourceConfig.module ?? DIRECTORIES.SHARED).toLowerCase();
    return path.join(mainPath, module, DIRECTORIES.INTERFACE, DIRECTORIES.GRAPHQL, DIRECTORIES.GRAPHQL_TYPES, `${pageName}.java`);
  } else {
    return path.join(mainPath, DIRECTORIES.GRAPHQL, DIRECTORIES.GRAPHQL_TYPES, `${pageName}.java`);
  }
};

// ─── Context enrichment ───────────────────────────────────────────────────────

export type EnrichedGraphQLContext = RenderContext<GraphQLSchemaConfig> & {
  resolvedTypeManifest?: DTOConfig;    // graphqlType manifest (from typeRef)
  resolvedInputManifests: DTOConfig[]; // graphqlInput manifests (from inputRefs)
  pageManifest?: DTOConfig;            // auto-generated Page manifest when collectionType 'paginated' is used
  resolveGraphQLScalar: (t: string) => string;
  resolveJavaType: (t: string) => string;
};

export const enrichGraphQLContext = async (
  context: RenderContext<GraphQLSchemaConfig>,
): Promise<EnrichedGraphQLContext> => {
  const { resourceConfig, basePath } = context;
  const module = resourceConfig.module ?? DIRECTORIES.SHARED;

  // Load typeRef manifest
  let resolvedTypeManifest: DTOConfig | undefined;
  if (resourceConfig.typeRef) {
    resolvedTypeManifest = await loadGraphQLTypeManifest(resourceConfig.typeRef, module, basePath);
  }

  // Load inputRef manifests
  const resolvedInputManifests: DTOConfig[] = [];
  for (const inputRef of resourceConfig.inputRefs ?? []) {
    const manifest = await loadGraphQLTypeManifest(inputRef, module, basePath);
    resolvedInputManifests.push(manifest);
  }

  // Detect if any operation uses collectionType 'paginated' — auto-create Page manifest
  const allOps = [...(resourceConfig.queries ?? []), ...(resourceConfig.mutations ?? [])];
  const hasPaginated = allOps.some((op) => op.collectionType === 'paginated');

  let pageManifest: DTOConfig | undefined;
  if (hasPaginated && resolvedTypeManifest) {
    const pageName = `${resolvedTypeManifest.name}Page`;
    pageManifest = await savePageManifest(pageName, resolvedTypeManifest.name, module, basePath);
  }

  return {
    ...context,
    resolvedTypeManifest,
    resolvedInputManifests,
    pageManifest,
    resolveGraphQLScalar,
    resolveJavaType: resolveJavaTypeForGraphQL,
  };
};

// ─── Main entry ──────────────────────────────────────────────────────────────

export const generateGraphQLSchema = async (context: RenderContext<GraphQLSchemaConfig>): Promise<void> => {
  const enriched = await enrichGraphQLContext(context);

  // 1. Save manifest — always first
  await saveGraphQLConfig(context.resourceConfig, context.basePath);

  // 2. .graphqls schema file — always regenerated
  await generateSchemaFile(enriched);

  // 3. Resolver — always regenerated
  await generateResolverFile(enriched);

  const isDomain = context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN;

  if (!isDomain) {
    // 4a. Technical: service interface — always regenerated (it's the contract)
    await generateServiceInterfaceFile(enriched);

    // 4b. Technical: service implementation — generated once
    await generateServiceImplFile(enriched);
  }

  // 5. Page type class — always regenerated when paginated ops exist
  if (enriched.pageManifest) {
    await generatePageTypeFile(enriched);
  }

  // 6. DataLoader — only when typeRef has graphqlType attributes (relations), generated once
  const hasRelations = (enriched.resolvedTypeManifest?.attributes ?? [])
    .some((attr) => attr.objectType === 'graphqlType');

  if (hasRelations) {
    await generateDataLoaderFile(enriched);
  }
};

// ─── Sub-generators ───────────────────────────────────────────────────────────

const generateSchemaFile = async (context: EnrichedGraphQLContext): Promise<void> => {
  const schemaContent = await renderTemplate(TEMPLATES.GRAPHQL_SCHEMA, context);
  const outputPath = getGraphQLSchemaFilePath(context);
  await fs.ensureDir(path.dirname(outputPath));
  await fs.writeFile(outputPath, schemaContent, 'utf-8');
};

const generateResolverFile = async (context: EnrichedGraphQLContext): Promise<void> => {
  const outputPath = getResolverFilePath(context);
  const content = await renderTemplate(TEMPLATES.GRAPHQL_RESOLVER, context);
  await saveToFile(content, outputPath, true);
};

const generateServiceInterfaceFile = async (context: EnrichedGraphQLContext): Promise<void> => {
  const outputPath = getServiceInterfaceFilePath(context);
  context.fullPath = path.dirname(outputPath);
  const content = await renderTemplate(TEMPLATES.GRAPHQL_SERVICE_INTERFACE, context);
  await saveToFile(content, outputPath, true);
};

const generateServiceImplFile = async (context: EnrichedGraphQLContext): Promise<void> => {
  const outputPath = getServiceImplFilePath(context);
  if (await fs.pathExists(outputPath)) return;
  context.fullPath = path.dirname(outputPath);
  const content = await renderTemplate(TEMPLATES.GRAPHQL_SERVICE, context);
  await saveToFile(content, outputPath, false);
};

const generatePageTypeFile = async (context: EnrichedGraphQLContext): Promise<void> => {
  const pageName = context.pageManifest!.name;
  const outputPath = getPageTypeFilePath(context, pageName);
  context.fullPath = path.dirname(outputPath);
  const content = await renderTemplate(TEMPLATES.GRAPHQL_PAGE_TYPE, context);
  await saveToFile(content, outputPath, true);
};

const generateDataLoaderFile = async (context: EnrichedGraphQLContext): Promise<void> => {
  const outputPath = getDataLoaderFilePath(context);
  if (await fs.pathExists(outputPath)) return;
  context.fullPath = path.dirname(outputPath);
  const content = await renderTemplate(TEMPLATES.GRAPHQL_DATALOADER, context);
  await saveToFile(content, outputPath, false);
};
