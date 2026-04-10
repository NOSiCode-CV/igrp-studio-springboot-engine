import {GENERIC_IMPORTS, GENERIC_TYPES, GRAPHQL_SCALAR_TYPES, PROJECT_STRUCTURE_STYLE} from '../utils/constants';
import {
    ApiConfig,
    DTOConfig,
    GraphQLCollectionType,
    GraphQLMutation,
    GraphQLQuery,
    GraphQLSchemaConfig
} from '../interfaces/types';

/**
 * Resolves all Java import statements needed for a GraphQL resolver / service:
 *   - Standard Java type imports from query/mutation args (e.g. java.util.UUID)
 *   - java.util.List when any operation uses collectionType 'list'
 *   - graphql.types package imports for the resolved type and all input types
 *   - imports for types referenced by graphqlType attributes (needed for @SchemaMapping return types)
 */
export function graphqlImportsTypes(
  config: GraphQLSchemaConfig,
  baseConfig: ApiConfig,
  resolvedTypeManifest?: DTOConfig,
  resolvedInputManifests?: DTOConfig[],
  pageManifest?: DTOConfig,
): string {
  const imports = new Set<string>();
  const packageSource = `${baseConfig.group}.${baseConfig.packageName}`;
  const typesPackage = `${packageSource}.graphql.types`;
  const isDomain = baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN;

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

  // java.util.List if any operation returns a list (reuses GENERIC_IMPORTS 'list' entry)
  if (allOps.some((op) => op.collectionType === 'list')) {
    const listImport = GENERIC_IMPORTS(packageSource, '').get('list')?.java.technical;
    if (listImport) imports.add(listImport);
  }

  // Resolved graphqlType import
  if (resolvedTypeManifest) {
    imports.add(`import ${typesPackage}.${resolvedTypeManifest.name};`);

    // Imports for types referenced by graphqlType attributes — needed for @SchemaMapping return types
    for (const attr of resolvedTypeManifest.attributes ?? []) {
      if (attr.objectType === 'graphqlType') {
        const attrModule = attr.module ?? config.module ?? 'shared';
        if (isDomain) {
          imports.add(`import ${packageSource}.${attrModule}.interfaces.graphql.types.${attr.type};`);
        } else {
          imports.add(`import ${typesPackage}.${attr.type};`);
        }
      }
    }
  }

  // Resolved graphqlInput imports
  for (const input of resolvedInputManifests ?? []) {
    imports.add(`import ${typesPackage}.${input.name};`);
  }

  // Page type import when any operation is paginated
  if (pageManifest) {
    imports.add(`import ${typesPackage}.${pageManifest.name};`);
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
 * - otherwise                                        → resolveGraphQLScalar(type) + nullable marker
 *
 * Use {{{ }}} in Handlebars to prevent HTML-encoding of brackets.
 */
export function resolveGraphQLAttributeType(attr: { type: string; objectType: string; collectionType?: string; required: boolean }): string {
  if (attr.objectType === 'graphqlType') {
    return attr.collectionType === 'list' ? `[${attr.type}!]!` : attr.type;
  }
  const scalar = resolveGraphQLScalar(String(attr.type));
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
      return `${schemaName}Page`;
    default:
      return typeName;
  }
}
