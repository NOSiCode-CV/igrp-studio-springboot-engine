import path from 'path';
import fs from 'fs-extra';
import {ApiConfig, DTOConfig, GraphQLParam, GraphQLSchemaConfig, RenderContext} from '../../interfaces/types';
import {DIRECTORIES, EXTENSIONS, GENERIC_TYPES, PROJECT_STRUCTURE_STYLE, TEMPLATES} from '../../utils/constants';
import {renderTemplate} from '../common/renderTemplate';
import {saveToFile} from '../common/saveToFile';
import {saveGraphQLConfig} from './saveGraphQLConfig';
import {getGraphQLTypeConfigPath, getMainPath, replaceTemplate} from '../../utils/helpers';
import {capitalizeJavaStyle} from '../../helper/stringHelper';
import {normalizeName} from '../dto/saveDTOConfig';
import {
    isGraphQLDTO,
    resolveGraphQLAttributeType,
    resolveGraphQLScalar,
    resolveJavaReturnType,
    resolveJavaTypeForGraphQL,
    resolveSubscriptionJavaReturnType,
} from '../../helper/graphqlHelper';

// ─── Manifest loaders ────────────────────────────────────────────────────────

/**
 * Loads a graphqlType or graphqlInput manifest from
 * .igrpstudio/<module>/graphql/types/<name>.json
 * Tries the raw name first, then the Input-normalized form (e.g. OrderFilter → OrderFilterInput).
 */
const loadGraphQLTypeManifest = async (
  name: string,
  module: string,
  basePath: string,
): Promise<DTOConfig> => {
  const dir = path.join(basePath, replaceTemplate(DIRECTORIES.CONFIG_GRAPHQL_TYPES, { module }));

  // Try exact name (graphqlType convention)
  const directPath = path.join(dir, `${name}${EXTENSIONS.JSON}`);
  if (await fs.pathExists(directPath)) {
    return fs.readJSON(directPath) as Promise<DTOConfig>;
  }

  // Try Input-normalized name (graphqlInput convention: saveDTOConfig appends 'Input')
  const inputNormalized = normalizeName(name, 'graphqlInput');
  if (inputNormalized !== name) {
    const inputPath = path.join(dir, `${inputNormalized}${EXTENSIONS.JSON}`);
    if (await fs.pathExists(inputPath)) {
      return fs.readJSON(inputPath) as Promise<DTOConfig>;
    }
  }

  throw new Error(
    `GraphQL type manifest not found for '${name}' in module '${module}'. Expected at: ${directPath}`,
  );
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

export type ConnectionManifest = { typeName: string };

export type EnrichedGraphQLContext = RenderContext<GraphQLSchemaConfig> & {
  resolvedTypeManifest?: DTOConfig;      // graphqlType manifest (from typeRef)
  resolvedInputManifests: DTOConfig[];   // graphqlInput manifests (auto-derived from DTO params)
  pageManifest?: DTOConfig;              // kept for legacy — replaced by connectionManifest
  connectionManifest?: ConnectionManifest; // Relay Connection type info for paginated queries
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

  // Auto-derive input manifests from DTO params across all operations
  const dtoParmTypes = new Set<string>();
  const allOperations = [
    ...(resourceConfig.queries ?? []),
    ...(resourceConfig.mutations ?? []),
    ...(resourceConfig.subscriptions ?? []),
  ];
  for (const op of allOperations) {
    for (const param of op.params ?? []) {
      if (isGraphQLDTO(param.type)) {
        dtoParmTypes.add(param.type);
      }
    }
  }
  const resolvedInputManifests: DTOConfig[] = [];
  for (const typeName of dtoParmTypes) {
    try {
      const manifest = await loadGraphQLTypeManifest(typeName, module, basePath);
      if (manifest.type === 'graphqlInput') {
        resolvedInputManifests.push(manifest);
      }
    } catch {
      // skip if manifest not found (may be a return type or not registered)
    }
  }

  // Detect if any query uses collectionType 'paginated' — build Connection manifest
  const hasPaginated = (resourceConfig.queries ?? []).some((q) => q.collectionType === 'paginated');

  let connectionManifest: ConnectionManifest | undefined;
  if (hasPaginated && resolvedTypeManifest) {
    connectionManifest = { typeName: resolvedTypeManifest.name };
  }

  return {
    ...context,
    resolvedTypeManifest,
    resolvedInputManifests,
    connectionManifest,
    resolveGraphQLScalar,
    resolveJavaType: resolveJavaTypeForGraphQL,
  };
};

// ─── Main entry ──────────────────────────────────────────────────────────────

export const generateGraphQLSchema = async (context: RenderContext<GraphQLSchemaConfig>): Promise<void> => {
  const enriched = await enrichGraphQLContext(context);

  // 1. Save manifest — always first
  await saveGraphQLConfig(context.resourceConfig, context.basePath);

  // 1b. common.graphqls — generated once per project (scalars, Node, PageInfo, SortInput, PageInput)
  await generateCommonSchema(enriched);

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

    // 4c. Infrastructure one-time files (GraphQLConfig + GraphQLExceptionHandler)
    await generateGraphQLConfig(enriched);
    await generateExceptionHandler(enriched);
  } else {
    // Domain: infrastructure one-time files at project root (different paths)
    await generateGraphQLConfig(enriched);
    await generateExceptionHandler(enriched);
  }

  // 5. Connection + Edge classes — always regenerated when paginated ops exist
  if (enriched.connectionManifest) {
    await generatePageInfoClass(enriched);
    await generateSortInputClass(enriched);
    await generatePageInputClass(enriched);
    await generateConnectionFile(enriched);
    await generateEdgeFile(enriched);
    await generateCursorUtils(enriched);
    await generatePaginationUtils(enriched);
  }

  // 6. DDD handlers — only for domain-driven projects
  if (isDomain) {
    await generateDDDHandlers(enriched);
  }

  // 7. Subscription files — when subscriptions declared
  if ((context.resourceConfig.subscriptions ?? []).length > 0) {
    await generateSubscriptionController(enriched);
    await generateEventService(enriched);
    await generateEventServiceImpl(enriched);
  }
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

// ─── DDD handler generation (Query + QueryHandler / Command + CommandHandler) ─

/**
 * For each GraphQL query/mutation in a DDD project, generates the corresponding
 * Query/QueryHandler and Command/CommandHandler classes under
 * <module>/application/queries/ and <module>/application/commands/.
 *
 * Query/Command classes are always regenerated (they carry no user logic).
 * Handler classes are generated once and never overwritten.
 */
const generateDDDHandlers = async (context: EnrichedGraphQLContext): Promise<void> => {
  const { resourceConfig, basePath, baseConfig } = context;
  const module = (resourceConfig.module ?? DIRECTORIES.SHARED).toLowerCase();
  const schemaName = capitalizeJavaStyle(resourceConfig.name);

  const queryDir = path.join(
    basePath,
    getMainPath(baseConfig.group, baseConfig.packageName),
    module,
    DIRECTORIES.APPLICATION,
    DIRECTORIES.QUERIES,
  );

  const commandDir = path.join(
    basePath,
    getMainPath(baseConfig.group, baseConfig.packageName),
    module,
    DIRECTORIES.APPLICATION,
    DIRECTORIES.COMMANDS,
  );

  for (const query of resourceConfig.queries ?? []) {
    const operationName = capitalizeJavaStyle(query.name);
    const returnJavaType = resolveJavaReturnType(query, schemaName);
    const argsImports = buildParamsImports(query.params ?? [], module, baseConfig);
    const returnTypeImport = buildReturnTypeImport(returnJavaType, module, baseConfig);

    const paginatedImports = query.collectionType === 'paginated'
      ? `import ${baseConfig.group}.${baseConfig.packageName}.graphql.connection.SortInput;\nimport ${baseConfig.group}.${baseConfig.packageName}.graphql.connection.PageInput;`
      : '';

    await fs.ensureDir(queryDir);

    const queryCtx = {
      ...context, fullPath: queryDir, operationName,
      params: query.params ?? [], argsImports,
      collectionType: query.collectionType,
      paginatedImports,
    };
    const queryContent = await renderTemplate(TEMPLATES.GRAPHQL_DDD_QUERY, queryCtx);
    await saveToFile(queryContent, path.join(queryDir, `${operationName}Query.java`), true);

    const handlerCtx = { ...context, fullPath: queryDir, operationName, returnJavaType, returnTypeImport };
    const handlerContent = await renderTemplate(TEMPLATES.GRAPHQL_DDD_QUERY_HANDLER, handlerCtx);
    await saveToFile(handlerContent, path.join(queryDir, `${operationName}QueryHandler.java`), false);
  }

  for (const mutation of resourceConfig.mutations ?? []) {
    const operationName = capitalizeJavaStyle(mutation.name);
    const returnJavaType = resolveJavaReturnType(mutation, schemaName);
    const argsImports = buildParamsImports(mutation.params ?? [], module, baseConfig);
    const returnTypeImport = buildReturnTypeImport(returnJavaType, module, baseConfig);

    await fs.ensureDir(commandDir);

    const commandCtx = {
      ...context, fullPath: commandDir, operationName,
      params: mutation.params ?? [], argsImports,
    };
    const commandContent = await renderTemplate(TEMPLATES.GRAPHQL_DDD_COMMAND, commandCtx);
    await saveToFile(commandContent, path.join(commandDir, `${operationName}Command.java`), true);

    const handlerCtx = {
      ...context, fullPath: commandDir, operationName,
      returnJavaType, returnTypeImport,
    };
    const handlerContent = await renderTemplate(TEMPLATES.GRAPHQL_DDD_COMMAND_HANDLER, handlerCtx);
    await saveToFile(handlerContent, path.join(commandDir, `${operationName}CommandHandler.java`), false);
  }
};

/** Import statements for GraphQL operation params — scalar types get java imports, DTOs get graphqlType imports. */
const buildParamsImports = (params: GraphQLParam[], module: string, baseConfig: ApiConfig): string => {
  const imports = new Set<string>();
  for (const param of params) {
    if (isGraphQLDTO(param.type)) {
      imports.add(`import ${baseConfig.group}.${baseConfig.packageName}.${module}.interfaces.graphql.types.${param.type};`);
    } else {
      const genType = GENERIC_TYPES.get((param.type ?? '').toLowerCase());
      if (genType?.java.namespace) {
        imports.add(`import ${genType.java.namespace}.${genType.java.name};`);
      }
    }
  }
  return [...imports].join('\n');
};

/** DDD-style import for a graphqlType / graphqlInput class. */
const buildGraphQLTypeImport = (typeName: string, module: string, baseConfig: ApiConfig): string => {
  const pkg = `${baseConfig.group}.${baseConfig.packageName}`;
  return `import ${pkg}.${module}.interfaces.graphql.types.${typeName};`;
};

/**
 * Import statement(s) for the Java return type of an operation.
 * Handles List<X> (adds java.util.List + X import), UUID, and custom graphql type classes.
 */
const buildReturnTypeImport = (returnJavaType: string, module: string, baseConfig: ApiConfig): string => {
  const javaBuiltins = new Set(['String', 'Boolean', 'Integer', 'Long', 'Double', 'Float', 'Void']);

  // List<X> — extract the inner type, not 'List' itself
  if (returnJavaType.startsWith('List<')) {
    const inner = returnJavaType.match(/^List<([A-Z][A-Za-z0-9]+)>/)?.[1];
    if (!inner || javaBuiltins.has(inner)) return 'import java.util.List;';
    return [
      'import java.util.List;',
      buildGraphQLTypeImport(inner, module, baseConfig),
    ].join('\n');
  }

  if (javaBuiltins.has(returnJavaType)) return '';
  if (returnJavaType === 'UUID') return 'import java.util.UUID;';

  // *Connection types live in .interfaces.graphql.connection, not .types
  if (returnJavaType.endsWith('Connection')) {
    const pkg = `${baseConfig.group}.${baseConfig.packageName}`;
    return `import ${pkg}.${module}.interfaces.graphql.connection.${returnJavaType};`;
  }

  return buildGraphQLTypeImport(returnJavaType, module, baseConfig);
};

// ─── common.graphqls (one-time) ──────────────────────────────────────────────

const generateCommonSchema = async (context: EnrichedGraphQLContext): Promise<void> => {
  const outputPath = path.join(context.basePath, 'src/main/resources/graphql', 'common.graphqls');
  if (await fs.pathExists(outputPath)) return;
  const content = await renderTemplate(TEMPLATES.GRAPHQL_COMMON, context);
  await fs.ensureDir(path.dirname(outputPath));
  await fs.writeFile(outputPath, content, 'utf-8');
};

// ─── Infrastructure one-time files ───────────────────────────────────────────

const getGraphQLConfigFilePath = (context: EnrichedGraphQLContext): string => {
  const mainPath = path.join(context.basePath, getMainPath(context.baseConfig.group, context.baseConfig.packageName));
  if (context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
    return path.join(mainPath, DIRECTORIES.GRAPHQL_CONFIG, 'GraphQLConfig.java');
  }
  return path.join(mainPath, DIRECTORIES.GRAPHQL, DIRECTORIES.GRAPHQL_CONFIG, 'GraphQLConfig.java');
};

const getExceptionHandlerFilePath = (context: EnrichedGraphQLContext): string => {
  const mainPath = path.join(context.basePath, getMainPath(context.baseConfig.group, context.baseConfig.packageName));
  if (context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
    return path.join(mainPath, DIRECTORIES.GRAPHQL, DIRECTORIES.GRAPHQL_EXCEPTION, 'GraphQLExceptionHandler.java');
  }
  return path.join(mainPath, DIRECTORIES.GRAPHQL, DIRECTORIES.GRAPHQL_CONFIG, 'GraphQLExceptionHandler.java');
};

const generateGraphQLConfig = async (context: EnrichedGraphQLContext): Promise<void> => {
  const outputPath = getGraphQLConfigFilePath(context);
  if (await fs.pathExists(outputPath)) return;
  context.fullPath = path.dirname(outputPath);
  const content = await renderTemplate(TEMPLATES.GRAPHQL_CONFIG, context);
  await saveToFile(content, outputPath, false);
};

const generateExceptionHandler = async (context: EnrichedGraphQLContext): Promise<void> => {
  const outputPath = getExceptionHandlerFilePath(context);
  if (await fs.pathExists(outputPath)) return;
  context.fullPath = path.dirname(outputPath);
  const content = await renderTemplate(TEMPLATES.GRAPHQL_EXCEPTION_HANDLER, context);
  await saveToFile(content, outputPath, false);
};

// ─── Relay Cursor Pagination ──────────────────────────────────────────────────

const getConnectionDir = (context: EnrichedGraphQLContext): string => {
  const mainPath = path.join(context.basePath, getMainPath(context.baseConfig.group, context.baseConfig.packageName));
  if (context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
    const module = (context.resourceConfig.module ?? DIRECTORIES.SHARED).toLowerCase();
    return path.join(mainPath, module, DIRECTORIES.INTERFACE, DIRECTORIES.GRAPHQL, DIRECTORIES.GRAPHQL_CONNECTION);
  }
  return path.join(mainPath, DIRECTORIES.GRAPHQL, DIRECTORIES.GRAPHQL_CONNECTION);
};

const getSharedGraphQLDir = (context: EnrichedGraphQLContext): string => {
  // CursorUtils + PaginationUtils go to shared graphql/connection regardless of style
  const mainPath = path.join(context.basePath, getMainPath(context.baseConfig.group, context.baseConfig.packageName));
  return path.join(mainPath, DIRECTORIES.GRAPHQL, DIRECTORIES.GRAPHQL_CONNECTION);
};

const generateConnectionFile = async (context: EnrichedGraphQLContext): Promise<void> => {
  const typeName = context.connectionManifest!.typeName;
  const dir = getConnectionDir(context);
  await fs.ensureDir(dir);
  const isDomain = context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN;
  const pkg = `${context.baseConfig.group}.${context.baseConfig.packageName}`;
  // PageInfo lives in the shared graphql.connection package — import needed only when connection is in a different package (domain style)
  const pageInfoImport = isDomain ? `import ${pkg}.graphql.connection.PageInfo;` : '';
  const ctx = { ...context, fullPath: dir, connectionTypeName: typeName, pageInfoImport };
  const content = await renderTemplate(TEMPLATES.GRAPHQL_CONNECTION, ctx);
  await saveToFile(content, path.join(dir, `${typeName}Connection.java`), true);
};

const generateEdgeFile = async (context: EnrichedGraphQLContext): Promise<void> => {
  const typeName = context.connectionManifest!.typeName;
  const dir = getConnectionDir(context);
  await fs.ensureDir(dir);
  const isDomain = context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN;
  const pkg = `${context.baseConfig.group}.${context.baseConfig.packageName}`;
  const module = (context.resourceConfig.module ?? DIRECTORIES.SHARED).toLowerCase();
  const nodeTypeImport = isDomain
    ? `import ${pkg}.${module}.interfaces.graphql.types.${typeName};`
    : `import ${pkg}.graphql.types.${typeName};`;
  const ctx = { ...context, fullPath: dir, connectionTypeName: typeName, nodeTypeImport };
  const content = await renderTemplate(TEMPLATES.GRAPHQL_EDGE, ctx);
  await saveToFile(content, path.join(dir, `${typeName}Edge.java`), true);
};

const generateCursorUtils = async (context: EnrichedGraphQLContext): Promise<void> => {
  const dir = getSharedGraphQLDir(context);
  const outputPath = path.join(dir, 'CursorUtils.java');
  if (await fs.pathExists(outputPath)) return;
  await fs.ensureDir(dir);
  const content = await renderTemplate(TEMPLATES.GRAPHQL_CURSOR_UTILS, { ...context, fullPath: dir });
  await saveToFile(content, outputPath, false);
};

const generatePaginationUtils = async (context: EnrichedGraphQLContext): Promise<void> => {
  const dir = getSharedGraphQLDir(context);
  const outputPath = path.join(dir, 'PaginationUtils.java');
  if (await fs.pathExists(outputPath)) return;
  await fs.ensureDir(dir);
  const content = await renderTemplate(TEMPLATES.GRAPHQL_PAGINATION_UTILS, { ...context, fullPath: dir });
  await saveToFile(content, outputPath, false);
};

const generatePageInfoClass = async (context: EnrichedGraphQLContext): Promise<void> => {
  const dir = getSharedGraphQLDir(context);
  const outputPath = path.join(dir, 'PageInfo.java');
  if (await fs.pathExists(outputPath)) return;
  await fs.ensureDir(dir);
  const content = await renderTemplate(TEMPLATES.GRAPHQL_PAGE_INFO, { ...context, fullPath: dir });
  await saveToFile(content, outputPath, false);
};

const generateSortInputClass = async (context: EnrichedGraphQLContext): Promise<void> => {
  const dir = getSharedGraphQLDir(context);
  const outputPath = path.join(dir, 'SortInput.java');
  if (await fs.pathExists(outputPath)) return;
  await fs.ensureDir(dir);
  const content = await renderTemplate(TEMPLATES.GRAPHQL_SORT_INPUT, { ...context, fullPath: dir });
  await saveToFile(content, outputPath, false);
};

const generatePageInputClass = async (context: EnrichedGraphQLContext): Promise<void> => {
  const dir = getSharedGraphQLDir(context);
  const outputPath = path.join(dir, 'PageInput.java');
  if (await fs.pathExists(outputPath)) return;
  await fs.ensureDir(dir);
  const content = await renderTemplate(TEMPLATES.GRAPHQL_PAGE_INPUT, { ...context, fullPath: dir });
  await saveToFile(content, outputPath, false);
};

// ─── Subscriptions ────────────────────────────────────────────────────────────

const getSubscriptionDir = (context: EnrichedGraphQLContext): string => {
  const name = capitalizeJavaStyle(context.resourceConfig.name);
  const mainPath = path.join(context.basePath, getMainPath(context.baseConfig.group, context.baseConfig.packageName));
  if (context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
    const module = (context.resourceConfig.module ?? DIRECTORIES.SHARED).toLowerCase();
    return path.join(mainPath, module, DIRECTORIES.INTERFACE, DIRECTORIES.GRAPHQL, DIRECTORIES.GRAPHQL_SUBSCRIPTION);
  }
  return path.join(mainPath, DIRECTORIES.GRAPHQL, context.resourceConfig.name.toLowerCase(), DIRECTORIES.GRAPHQL_SUBSCRIPTION);
};

const getEventServiceDir = (context: EnrichedGraphQLContext): string => {
  const mainPath = path.join(context.basePath, getMainPath(context.baseConfig.group, context.baseConfig.packageName));
  if (context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
    const module = (context.resourceConfig.module ?? DIRECTORIES.SHARED).toLowerCase();
    return path.join(mainPath, module, DIRECTORIES.APPLICATION, 'event');
  }
  return path.join(mainPath, DIRECTORIES.GRAPHQL, context.resourceConfig.name.toLowerCase(), DIRECTORIES.GRAPHQL_SUBSCRIPTION);
};

const buildSubscriptionImportContext = (context: EnrichedGraphQLContext): { typeClassImport: string; argsImports: string; eventServiceImport: string } => {
  const typeName = context.resolvedTypeManifest?.name ?? capitalizeJavaStyle(context.resourceConfig.name);
  const name = capitalizeJavaStyle(context.resourceConfig.name);
  const pkg = `${context.baseConfig.group}.${context.baseConfig.packageName}`;
  const isDomain = context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN;
  const module = (context.resourceConfig.module ?? DIRECTORIES.SHARED).toLowerCase();

  const typeClassImport = isDomain
    ? `import ${pkg}.${module}.interfaces.graphql.types.${typeName};`
    : `import ${pkg}.graphql.types.${typeName};`;

  // Impl always needs import (it's in a .impl sub-package). Controller needs it only for domain (different package from interface).
  const eventServiceImport = isDomain
    ? `import ${pkg}.${module}.application.event.${name}EventService;`
    : `import ${pkg}.graphql.${context.resourceConfig.name.toLowerCase()}.subscription.${name}EventService;`;

  const allSubParams = (context.resourceConfig.subscriptions ?? []).flatMap((s) => s.params ?? []);
  const argsImports = buildParamsImports(allSubParams, module, context.baseConfig);
  return { typeClassImport, argsImports, eventServiceImport };
};

const generateSubscriptionController = async (context: EnrichedGraphQLContext): Promise<void> => {
  const name = capitalizeJavaStyle(context.resourceConfig.name);
  const dir = getSubscriptionDir(context);
  await fs.ensureDir(dir);
  const ctx = { ...context, fullPath: dir, ...buildSubscriptionImportContext(context) };
  const content = await renderTemplate(TEMPLATES.GRAPHQL_SUBSCRIPTION_CONTROLLER, ctx);
  await saveToFile(content, path.join(dir, `${name}SubscriptionController.java`), true);
};

const generateEventService = async (context: EnrichedGraphQLContext): Promise<void> => {
  const name = capitalizeJavaStyle(context.resourceConfig.name);
  const dir = getEventServiceDir(context);
  await fs.ensureDir(dir);
  const ctx = { ...context, fullPath: dir, ...buildSubscriptionImportContext(context) };
  const content = await renderTemplate(TEMPLATES.GRAPHQL_EVENT_SERVICE, ctx);
  await saveToFile(content, path.join(dir, `${name}EventService.java`), true);
};

const generateEventServiceImpl = async (context: EnrichedGraphQLContext): Promise<void> => {
  const name = capitalizeJavaStyle(context.resourceConfig.name);
  const implDir = path.join(getEventServiceDir(context), 'impl');
  const outputPath = path.join(implDir, `${name}EventServiceImpl.java`);
  if (await fs.pathExists(outputPath)) return;
  await fs.ensureDir(implDir);
  const ctx = { ...context, fullPath: implDir, ...buildSubscriptionImportContext(context) };
  const content = await renderTemplate(TEMPLATES.GRAPHQL_EVENT_SERVICE_IMPL, ctx);
  await saveToFile(content, outputPath, false);
};
