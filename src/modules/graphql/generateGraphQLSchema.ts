import path from 'path';
import fs from 'fs-extra';
import {DTOConfig, GraphQLSchemaConfig, RenderContext} from '../../interfaces/types';
import {DIRECTORIES, EXTENSIONS, PROJECT_STRUCTURE_STYLE, TEMPLATES} from '../../utils/constants';
import {renderTemplate} from '../common/renderTemplate';
import {saveToFile} from '../common/saveToFile';
import {saveGraphQLConfig} from './saveGraphQLConfig';
import {getGraphQLTypeConfigPath, getMainPath, replaceTemplate} from '../../utils/helpers';
import {capitalizeJavaStyle} from '../../helper/stringHelper';
import {resolveGraphQLAttributeType, resolveGraphQLScalar, resolveJavaTypeForGraphQL} from '../../helper/graphqlHelper';

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

  // 2b. Minimal type-only .graphqls for referenced types (only if absent)
  await generateReferencedTypeFragments(enriched);

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

  // DataLoader class generation intentionally omitted — the DataLoader pattern is
  // embedded directly in the resolver's @SchemaMapping methods using loadMany/load.
};

// ─── Sub-generators ───────────────────────────────────────────────────────────

/**
 * For each graphqlType attribute on the resolved type manifest, auto-generates a
 * minimal type-only .graphqls file for the referenced type if one doesn't exist yet.
 *
 * This ensures Spring GraphQL can resolve the type even when addGraphQLSchema has
 * never been called for it (e.g. Category is used as a relation on Product but has
 * no queries/mutations of its own).
 *
 * The file is only written when absent — a subsequent addGraphQLSchema call for the
 * referenced type will overwrite it with the full schema (queries, mutations, etc.).
 */
const generateReferencedTypeFragments = async (context: EnrichedGraphQLContext): Promise<void> => {
  const attrs = context.resolvedTypeManifest?.attributes ?? [];
  for (const attr of attrs) {
    if (attr.objectType !== 'graphqlType') continue;

    const refModule = attr.module ?? context.resourceConfig.module ?? DIRECTORIES.SHARED;
    const refName = String(attr.type);

    const outputPath = path.join(context.basePath, 'src/main/resources/graphql', `${refName}.graphqls`);
    if (await fs.pathExists(outputPath)) continue;

    const refManifest = await loadGraphQLTypeManifest(refName, refModule, context.basePath);
    const content = buildTypeFragment(refManifest);
    await fs.ensureDir(path.dirname(outputPath));
    await fs.writeFile(outputPath, content, 'utf-8');
  }
};

const buildTypeFragment = (manifest: DTOConfig): string => {
  const fields = (manifest.attributes ?? [])
    .map((attr) => `  ${attr.name}: ${resolveGraphQLAttributeType(attr)}`)
    .join('\n');
  return `# GraphQL Type — ${manifest.name}\n# Generated by iGRP Studio\n\ntype ${manifest.name} {\n${fields}\n}\n`;
};

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
