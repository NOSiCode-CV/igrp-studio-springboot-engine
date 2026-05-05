import {GENERIC_IMPORTS, GENERIC_TYPES, GRAPHQL_SCALAR_TYPES, PROJECT_STRUCTURE_STYLE} from '../utils/constants';
import {
    ApiConfig,
    DTOConfig,
    GraphQLCollectionType,
    GraphQLMutation,
    GraphQLParam,
    GraphQLQuery,
    GraphQLReturn,
    GraphQLSchemaConfig,
    GraphQLSubscription,
} from '../interfaces/types';
import {capitalizeJavaStyle} from './stringHelper';

/**
 * Resolves a GraphQLParam to its SDL type string (e.g. `ID!`, `String`, `CreateOrderInput!`).
 */
export function resolveParamSDLType(param: GraphQLParam): string {
  const bang = param.required ? '!' : '';
  if (param.objectType === 'graphqlInput') return `${param.type}${bang}`;
  return `${resolveGraphQLScalar(param.type)}${bang}`;
}

/**
 * Resolves a GraphQLParam to the Java type used in method signatures.
 * Always returns wrapper types (Boolean not boolean) — optional params must
 * accept null, which Java primitives cannot.
 */
export function resolveParamJavaType(param: GraphQLParam): string {
  if (param.objectType === 'graphqlInput') return param.type;
  const jt = resolveJavaTypeForGraphQL(param.type);
  return jt.charAt(0).toUpperCase() + jt.slice(1);
}

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

  const allParams = [
    ...(config.queries ?? []).flatMap((q) => q.params ?? []),
    ...(config.mutations ?? []).flatMap((m) => m.params ?? []),
  ];

  // Java scalar imports (e.g. UUID)
  for (const param of allParams) {
    if (param.objectType === 'java') {
      const genType = GENERIC_TYPES.get(param.type?.toLowerCase?.() ?? '');
      if (genType?.java.namespace) {
        imports.add(`import ${genType.java.namespace}.${genType.java.name};`);
      }
    }
  }

  const allQueries = config.queries ?? [];

  if (allQueries.some((q) => q.collectionType === 'list')) {
    imports.add('import java.util.List;');
  }

  if (allQueries.some((q) => q.collectionType === 'paginated')) {
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

    const graphqlTypeAttrs = (resolvedTypeManifest.attributes ?? []).filter(
      (a) => a.objectType === 'graphqlType',
    );

    for (const attr of graphqlTypeAttrs) {
      const attrModule = attr.module ?? schemaModule;
      imports.add(graphqlTypeImport(packageSource, String(attr.type), attrModule, isDomain));
    }

    if (graphqlTypeAttrs.length > 0) {
      imports.add('import java.util.Map;');
      if (graphqlTypeAttrs.some((a) => a.collectionType === 'list')) {
        imports.add('import java.util.List;');
      }
    }
  }

  for (const input of resolvedInputManifests ?? []) {
    imports.add(graphqlTypeImport(packageSource, input.name, schemaModule, isDomain));
  }

  return [...imports].join('\n');
}

/**
 * Resolves an engine attribute type to the Java type used in GraphQL resolver
 * arguments and service method signatures.
 */
export function resolveJavaTypeForGraphQL(type: string): string {
  if (!type) return 'String';
  return GENERIC_TYPES.get(type.toLowerCase().trim())?.java.name ?? 'String';
}

/**
 * Resolves an engine attribute type to a GraphQL scalar type.
 */
export function resolveGraphQLScalar(type: string): string {
  if (!type) return 'String';
  return GRAPHQL_SCALAR_TYPES.get(type.toLowerCase().trim()) ?? 'String';
}

/**
 * Resolves a JavaAttribute to its GraphQL schema representation.
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
 */
export function hasGraphQLTypeAttributes(attributes: Array<{ objectType: string }> | undefined): boolean {
  return (attributes ?? []).some((a) => a.objectType === 'graphqlType');
}

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

  const allParams = [
    ...(config.queries ?? []).flatMap((q) => q.params ?? []),
    ...(config.mutations ?? []).flatMap((m) => m.params ?? []),
  ];

  for (const param of allParams) {
    if (param.objectType === 'java') {
      const genType = GENERIC_TYPES.get(param.type?.toLowerCase?.() ?? '');
      if (genType?.java.namespace) {
        imports.add(`import ${genType.java.namespace}.${genType.java.name};`);
      }
    }
  }

  const allQueriesSvc = config.queries ?? [];

  if (allQueriesSvc.some((q) => q.collectionType === 'list')) {
    imports.add('import java.util.List;');
  }

  if (allQueriesSvc.some((q) => q.collectionType === 'paginated')) {
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

export function graphqlRefIdFieldName(attr: { type: string; collectionType?: string }): string {
  const typeName = String(attr.type);
  const camel = typeName.charAt(0).toLowerCase() + typeName.slice(1);
  return attr.collectionType === 'list' ? `${camel}Ids` : `${camel}Id`;
}

export function graphqlRefIdType(attr: { idType?: string; collectionType?: string }): string {
  const javaType = resolveJavaTypeForGraphQL(attr.idType ?? 'uuid');
  return attr.collectionType === 'list' ? `List<${javaType}>` : javaType;
}

export function graphqlRefIdJavaType(attr: { idType?: string }): string {
  return resolveJavaTypeForGraphQL(attr.idType ?? 'uuid');
}

export function graphqlRefReturnType(attr: { type: string; collectionType?: string }): string {
  return attr.collectionType === 'list' ? `List<${attr.type}>` : String(attr.type);
}

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
 * Resolves the SDL return type for a GraphQL query or mutation from its `return` field.
 * Absent return → uses schemaName.
 * objectType 'java'       → resolves scalar (e.g. boolean → Boolean)
 * objectType 'graphqlType' → applies collectionType (list / paginated / single)
 */
export function resolveGraphQLReturnType(
  operation: GraphQLQuery | GraphQLMutation,
  schemaName: string,
): string {
  const ret = operation.return;
  if (!ret) return schemaName;
  if (ret.objectType === 'java') return resolveGraphQLScalar(ret.type);
  const collectionType: GraphQLCollectionType = (operation as GraphQLQuery).collectionType ?? 'single';
  switch (collectionType) {
    case 'list':      return `[${ret.type}!]!`;
    case 'paginated': return `${ret.type}Connection!`;
    default:          return ret.type;
  }
}

/**
 * Resolves the Java return type for a query/mutation.
 * Always returns wrapper types (Boolean not boolean) — required for generic type params.
 */
export function resolveJavaReturnType(
  operation: GraphQLQuery | GraphQLMutation,
  schemaName: string,
): string {
  const ret = operation.return;
  if (!ret) return schemaName;
  if (ret.objectType === 'java') {
    const jt = resolveJavaTypeForGraphQL(ret.type);
    return jt.charAt(0).toUpperCase() + jt.slice(1);
  }
  const collectionType: GraphQLCollectionType = (operation as GraphQLQuery).collectionType ?? 'single';
  switch (collectionType) {
    case 'list':      return `List<${ret.type}>`;
    case 'paginated': return `${ret.type}Connection`;
    default:          return ret.type;
  }
}

/**
 * Returns true if the type manifest has an 'id' attribute.
 */
export function typeImplementsNode(manifest: DTOConfig | undefined): boolean {
  if (!manifest) return false;
  return (manifest.attributes ?? []).some((a) => a.name === 'id');
}

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
 * Resolves the SDL return type for a subscription.
 */
export function resolveSubscriptionReturnType(
  sub: GraphQLSubscription,
  schemaName: string,
): string {
  const ret = sub.return;
  if (!ret) return schemaName;
  if (ret.objectType === 'java') return resolveGraphQLScalar(ret.type);
  return ret.type;
}

/**
 * Resolves the Java return type for a subscription (always single type for Flux).
 */
export function resolveSubscriptionJavaReturnType(
  sub: GraphQLSubscription,
  schemaName: string,
): string {
  const ret = sub.return;
  if (!ret) return schemaName;
  if (ret.objectType === 'java') return resolveJavaTypeForGraphQL(ret.type);
  return ret.type;
}

/** Alias kept for template compatibility. */
export function resolveGraphQLReturnTypeV2(
  operation: GraphQLQuery | GraphQLMutation,
  schemaName: string,
): string {
  return resolveGraphQLReturnType(operation, schemaName);
}
