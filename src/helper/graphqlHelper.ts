import {GENERIC_TYPES, GRAPHQL_SCALAR_TYPES} from '../utils/constants';
import {GraphQLSchemaConfig} from '../interfaces/types';

/**
 * Resolves the Java import statements needed for all query/mutation arg types.
 * Follows the same pattern as `importsTypes` for controllers:
 * checks GENERIC_TYPES.get(type)?.java.namespace and emits `import namespace.Name;`.
 *
 * Example: uuid → import java.util.UUID;
 */
export function graphqlImportsTypes(config: GraphQLSchemaConfig): string {
  const allArgs = [
    ...(config.queries ?? []).flatMap((q) => q.args ?? []),
    ...(config.mutations ?? []).flatMap((m) => m.args ?? []),
  ];

  const imports = new Set<string>();

  for (const arg of allArgs) {
    const genType = GENERIC_TYPES.get(arg.type?.toLowerCase?.() ?? '');
    if (genType?.java.namespace) {
      imports.add(`import ${genType.java.namespace}.${genType.java.name};`);
    }
  }

  return [...imports].join('\n');
}

/**
 * Resolves an engine attribute type to the Java type used in GraphQL resolver
 * arguments and service method signatures.
 *
 * Delegates to GENERIC_TYPES (the engine's single source of truth) so that
 * uuid → UUID, integer → Integer, long → Long, etc. — consistent with
 * controllers, models, and DTOs everywhere else in the engine.
 *
 * Types not in GENERIC_TYPES (date, datetime, time, instant) fall back to String.
 */
export function resolveJavaTypeForGraphQL(type: string): string {
  if (!type) return 'String';
  return GENERIC_TYPES.get(type.toLowerCase().trim())?.java.name ?? 'String';
}

/**
 * Resolves an engine attribute type to a GraphQL scalar type.
 * Delegates to GRAPHQL_SCALAR_TYPES (constants.ts) — add new mappings there.
 */
export function resolveGraphQLScalar(type: string): string {
  if (!type) return 'String';
  return GRAPHQL_SCALAR_TYPES.get(type.toLowerCase().trim()) ?? 'String';
}
