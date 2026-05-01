import {GENERIC_IMPORTS, GENERIC_TYPES, GRAPHQL_SCALAR_TYPES, PROJECT_STRUCTURE_STYLE} from '../utils/constants';
import {
    ApiConfig,
    DTOConfig,
    GraphQLCollectionType,
    GraphQLMutation,
    GraphQLQuery,
    GraphQLSchemaConfig,
    GraphQLSubscription,
} from '../interfaces/types';
import {capitalizeJavaStyle} from './stringHelper';

/**
 * Resolves all Java import statements needed for a GraphQL resolver / service:
 *   - Standard Java type imports from query/mutation args (e.g. java.util.UUID)
 *   - java.util.List when any operation uses collectionType 'list'
 *   - graphql.types package imports for the resolved type and all input types
 *   - imports for types referenced by graphqlType attributes (needed for @SchemaMapping return types)
 */
/** Resolves a graphqlType import for either technical or domain style. */
function graphqlTypeImport(
  packageSource: string,
  typeName: string,
  module: string,
  isDomain: boolean,
): string {
  const entry = GENERIC_IMPORTS(packageSource, typeName, module).get('graphqlType')?.java;
  return isDomain ? (entry?.domain ?? '') : (entry?.technical ?? '');
}

export function graphqlImportsTypes(
  config: GraphQLSchemaConfig,
  baseConfig: ApiConfig,
  resolvedTypeManifest?: DTOConfig,
  resolvedInputManifests?: DTOConfig[],
): string {
  const imports = new Set<string>();
  const packageSource = `${baseConfig.group}.${baseConfig.packageName}`;
  const isDomain = baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN;
  const schemaModule = config.module ?? 'shared';

  const allArgs = [
    ...(config.queries ?? []).flatMap((q) => q.args ?? []),
    ...(config.mutations ?? []).flatMap((m) => m.args ?? []),
  ];

  // Standard arg type imports (e.g. UUID)
  for (const arg of allArgs) {
    const genType = GENERIC_TYPES.get(arg.type?.toLowerCase?.() ?? '');
    if (genType?.java.namespace) {
      imports.add(`import ${genType.java.namespace}.${genType.java.name};`);
    }
  }

  const allOps = [...(config.queries ?? []), ...(config.mutations ?? [])];

  // java.util.List if any operation returns a list
  if (allOps.some((op) => op.collectionType === 'list')) {
    imports.add('import java.util.List;');
  }

  // Paginated operations — import Connection, SortInput, PageInput
  if (allOps.some((op) => op.collectionType === 'paginated')) {
    const sharedPkg = `${packageSource}.graphql.connection`;
    imports.add(`import ${sharedPkg}.SortInput;`);
    imports.add(`import ${sharedPkg}.PageInput;`);
    if (resolvedTypeManifest) {
      const connPkg = isDomain
        ? `${packageSource}.${schemaModule}.interfaces.graphql.connection`
        : sharedPkg;
      imports.add(`import ${connPkg}.${resolvedTypeManifest.name}Connection;`);
    }
  }

  // Main type import
  if (resolvedTypeManifest) {
    imports.add(graphqlTypeImport(packageSource, resolvedTypeManifest.name, schemaModule, isDomain));

    const graphqlTypeAttrs = (resolvedTypeManifest.attributes ?? []).filter(
      (a) => a.objectType === 'graphqlType',
    );

    for (const attr of graphqlTypeAttrs) {
      // Import the referenced type class (for @SchemaMapping return type) — uses attr.module
      const attrModule = attr.module ?? schemaModule;
      imports.add(graphqlTypeImport(packageSource, String(attr.type), attrModule, isDomain));
    }

    // Map + List imports for @BatchMapping return types
    if (graphqlTypeAttrs.length > 0) {
      imports.add('import java.util.Map;');
      if (graphqlTypeAttrs.some((a) => a.collectionType === 'list')) {
        imports.add('import java.util.List;');
      }
    }
  }

  // Input type imports
  for (const input of resolvedInputManifests ?? []) {
    imports.add(graphqlTypeImport(packageSource, input.name, schemaModule, isDomain));
  }

  return [...imports].join('\n');
}

/**
 * Resolves an engine attribute type to the Java type used in GraphQL resolver
 * arguments and service method signatures.
 * uuid → UUID, integer → Integer, etc. — consistent with controllers and DTOs.
 */
export function resolveJavaTypeForGraphQL(type: string): string {
  if (!type) return 'String';
  return GENERIC_TYPES.get(type.toLowerCase().trim())?.java.name ?? 'String';
}

/**
 * Resolves an engine attribute type to a GraphQL scalar type.
 * Delegates to GRAPHQL_SCALAR_TYPES (constants.ts).
 */
export function resolveGraphQLScalar(type: string): string {
  if (!type) return 'String';
  return GRAPHQL_SCALAR_TYPES.get(type.toLowerCase().trim()) ?? 'String';
}

/**
 * Resolves a JavaAttribute to its GraphQL schema representation.
 * - objectType 'graphqlType' + collectionType 'list' → [TypeName!]!
 * - objectType 'graphqlType'                         → TypeName
 * - scalar     + collectionType 'list' + required    → [Scalar!]!
 * - scalar     + collectionType 'list' + optional    → [Scalar]
 * - scalar                                           → Scalar! / Scalar
 *
 * Use {{{ }}} in Handlebars to prevent HTML-encoding of brackets.
 */
export function resolveGraphQLAttributeType(attr: { type: string; objectType: string; collectionType?: string; required: boolean }): string {
  if (attr.objectType === 'graphqlType') {
    return attr.collectionType === 'list' ? `[${attr.type}!]!` : attr.type;
  }
  const scalar = resolveGraphQLScalar(String(attr.type));
  if (attr.collectionType === 'list') {
    return attr.required ? `[${scalar}!]!` : `[${scalar}]`;
  }
  return attr.required ? `${scalar}!` : scalar;
}

/**
 * Returns true if any attribute in the list has objectType 'graphqlType'.
 * Used in templates to conditionally import @SchemaMapping and generate relation methods.
 */
export function hasGraphQLTypeAttributes(attributes: Array<{ objectType: string }> | undefined): boolean {
  return (attributes ?? []).some((a) => a.objectType === 'graphqlType');
}

/**
 * Resolves Java imports for the service interface and service implementation.
 * Subset of graphqlImportsTypes — excludes CompletableFuture, DataLoader, and
 * referenced-type classes (those are resolver concerns only).
 */
export function graphqlImportsTypesService(
  config: GraphQLSchemaConfig,
  baseConfig: ApiConfig,
  resolvedTypeManifest?: DTOConfig,
  resolvedInputManifests?: DTOConfig[],
): string {
  const imports = new Set<string>();
  const packageSource = `${baseConfig.group}.${baseConfig.packageName}`;
  const isDomain = baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN;
  const schemaModule = config.module ?? 'shared';

  const allArgs = [
    ...(config.queries ?? []).flatMap((q) => q.args ?? []),
    ...(config.mutations ?? []).flatMap((m) => m.args ?? []),
  ];

  for (const arg of allArgs) {
    const genType = GENERIC_TYPES.get(arg.type?.toLowerCase?.() ?? '');
    if (genType?.java.namespace) {
      imports.add(`import ${genType.java.namespace}.${genType.java.name};`);
    }
  }

  const allOps = [...(config.queries ?? []), ...(config.mutations ?? [])];

  if (allOps.some((op) => op.collectionType === 'list')) {
    imports.add('import java.util.List;');
  }

  // Paginated operations — import Connection, SortInput, PageInput
  if (allOps.some((op) => op.collectionType === 'paginated')) {
    const sharedPkg = `${packageSource}.graphql.connection`;
    imports.add(`import ${sharedPkg}.SortInput;`);
    imports.add(`import ${sharedPkg}.PageInput;`);
    if (resolvedTypeManifest) {
      const connPkg = isDomain
        ? `${packageSource}.${schemaModule}.interfaces.graphql.connection`
        : sharedPkg;
      imports.add(`import ${connPkg}.${resolvedTypeManifest.name}Connection;`);
    }
  }

  if (resolvedTypeManifest) {
    imports.add(graphqlTypeImport(packageSource, resolvedTypeManifest.name, schemaModule, isDomain));
  }

  for (const input of resolvedInputManifests ?? []) {
    imports.add(graphqlTypeImport(packageSource, input.name, schemaModule, isDomain));
  }

  return [...imports].join('\n');
}

/**
 * Returns the Java field name for a graphqlType attribute's ID reference.
 * Derived from the referenced TYPE name (not the attribute name):
 *   single:  Category  → categoryId
 *   list:    Product   → productIds
 */
export function graphqlRefIdFieldName(attr: { type: string; collectionType?: string }): string {
  const typeName = String(attr.type);
  const camel = typeName.charAt(0).toLowerCase() + typeName.slice(1);
  return attr.collectionType === 'list' ? `${camel}Ids` : `${camel}Id`;
}

/**
 * Returns the Java type for a graphqlType attribute's ID field (using attr.idType).
 *   single: uuid → UUID
 *   list:   uuid → List<UUID>
 */
export function graphqlRefIdType(attr: { idType?: string; collectionType?: string }): string {
  const javaType = resolveJavaTypeForGraphQL(attr.idType ?? 'uuid');
  return attr.collectionType === 'list' ? `List<${javaType}>` : javaType;
}

/**
 * Returns the scalar Java ID type for a graphqlType attribute (no List wrapping).
 * Used as the DataLoader key type: DataLoader<UUID, Product>.
 */
export function graphqlRefIdJavaType(attr: { idType?: string }): string {
  return resolveJavaTypeForGraphQL(attr.idType ?? 'uuid');
}

/**
 * Returns the return type of a @SchemaMapping method for a graphqlType attribute.
 *   single: Category  → Category
 *   list:   Product   → List<Product>
 */
export function graphqlRefReturnType(attr: { type: string; collectionType?: string }): string {
  return attr.collectionType === 'list' ? `List<${attr.type}>` : String(attr.type);
}

/**
 * Generates import statements for the Query and Command classes referenced by
 * a DDD-style resolver (e.g. FindProductByIdQuery, CreateProductCommand).
 * Only relevant when projectStructureStyle === 'domain'.
 */
export function graphqlDDDOperationImports(
  config: GraphQLSchemaConfig,
  baseConfig: ApiConfig,
): string {
  const imports = new Set<string>();
  const pkg = `${baseConfig.group}.${baseConfig.packageName}`;
  const module = (config.module ?? 'shared').toLowerCase();

  for (const query of config.queries ?? []) {
    const name = capitalizeJavaStyle(query.name);
    imports.add(`import ${pkg}.${module}.application.queries.${name}Query;`);
  }
  for (const mutation of config.mutations ?? []) {
    const name = capitalizeJavaStyle(mutation.name);
    imports.add(`import ${pkg}.${module}.application.commands.${name}Command;`);
  }

  return [...imports].join('\n');
}

/**
 * Resolves the return type string for a GraphQL query or mutation in the .graphqls file.
 * collectionType: 'single' (default) → Type, 'list' → [Type!]!, 'paginated' → TypePage
 * Priority: returnType (primitive) > returnTypeRef + collectionType > schemaName (fallback)
 */
export function resolveGraphQLReturnType(
  operation: GraphQLQuery | GraphQLMutation,
  schemaName: string,
): string {
  // Primitive explicit return (Boolean, String, Int, etc.)
  if (operation.returnType) return operation.returnType;

  const typeName = operation.returnTypeRef ?? schemaName;
  const collectionType: GraphQLCollectionType = operation.collectionType ?? 'single';

  switch (collectionType) {
    case 'list':
      return `[${typeName}!]!`;
    case 'paginated':
      return `${typeName}Page`;
    default:
      return typeName;
  }
}

/**
 * Resolves the Java return type for a query/mutation in Resolver and ServiceInterface.
 * list → List<Type>, paginated → <SchemaName>Page, single → Type
 */
export function resolveJavaReturnType(
  operation: GraphQLQuery | GraphQLMutation,
  schemaName: string,
): string {
  if (operation.returnType) return operation.returnType;

  const typeName = operation.returnTypeRef ?? schemaName;
  const collectionType: GraphQLCollectionType = operation.collectionType ?? 'single';

  switch (collectionType) {
    case 'list':
      return `List<${typeName}>`;
    case 'paginated':
      return `${schemaName}Connection`;
    default:
      return typeName;
  }
}

/**
 * Returns true if the type manifest has an 'id' attribute — used to add `implements Node` in SDL.
 */
export function typeImplementsNode(manifest: DTOConfig | undefined): boolean {
  if (!manifest) return false;
  return (manifest.attributes ?? []).some((a) => a.name === 'id');
}

/**
 * Maps a security role string to a Spring @PreAuthorize expression.
 */
export function resolvePreAuthorize(security: string): string {
  switch (security) {
    case 'ADMIN':
      return `@org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")`;
    case 'EDITOR':
      return `@org.springframework.security.access.prepost.PreAuthorize("hasRole('EDITOR') or hasRole('ADMIN')")`;
    case 'USER':
      return `@org.springframework.security.access.prepost.PreAuthorize("isAuthenticated()")`;
    default:
      return '';
  }
}

/**
 * Resolves the return type string for a subscription in the .graphqls file.
 */
export function resolveSubscriptionReturnType(
  sub: GraphQLSubscription,
  schemaName: string,
): string {
  return sub.returnTypeRef ?? schemaName;
}

/**
 * Resolves the Java return type for a subscription (always single type for Flux).
 */
export function resolveSubscriptionJavaReturnType(
  sub: GraphQLSubscription,
  schemaName: string,
): string {
  return sub.returnTypeRef ?? schemaName;
}

/**
 * Resolves the SDL return type for a GraphQL query or mutation, now using Connection for paginated.
 */
export function resolveGraphQLReturnTypeV2(
  operation: GraphQLQuery | GraphQLMutation,
  schemaName: string,
): string {
  if (operation.returnType) return operation.returnType;
  const typeName = operation.returnTypeRef ?? schemaName;
  const collectionType: GraphQLCollectionType = operation.collectionType ?? 'single';
  switch (collectionType) {
    case 'list':      return `[${typeName}!]!`;
    case 'paginated': return `${typeName}Connection!`;
    default:          return typeName;
  }
}
