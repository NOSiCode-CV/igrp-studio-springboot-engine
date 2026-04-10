import {saveToFile} from '../common/saveToFile';
import {DTOConfig, ObjectTypes} from '../../interfaces/types';
import {DIRECTORIES, ERROR_MESSAGE, EXTENSIONS} from '../../utils/constants';
import {getDTOConfigPath, getGraphQLTypeConfigPath} from '../../utils/helpers';

const GRAPHQL_DTO_TYPES: ReadonlySet<ObjectTypes> = new Set(['graphqlType', 'graphqlInput']);

/**
 * Generates and saves the configuration file of a DTO.
 * graphqlType/graphqlInput manifests go to .igrpstudio/<module>/graphql/types/
 * All other DTO types go to .igrpstudio/<module>/dto/
 */
export const saveDTOConfig = async (config: DTOConfig, basePath: string) => {
  if (config.attributes.length === 0) {
    throw ERROR_MESSAGE.EMPTY_ATTRIBUTE;
  }

  const module = config.module ?? DIRECTORIES.SHARED;

  if (GRAPHQL_DTO_TYPES.has(config.type)) {
    const output = getGraphQLTypeConfigPath(module, normalizeName(config.name, config.type), basePath);
    await saveToFile(
      JSON.stringify(config, null, 2),
      output,
      !config.readOnly,
      DIRECTORIES.CONFIG_GRAPHQL_TYPES,
      config.id,
      config.module,
      basePath,
      EXTENSIONS.JSON,
    );
  } else {
    const output = getDTOConfigPath(
      normalizeDTOType(config.type),
      module,
      normalizeName(config.name, config.type),
      basePath,
    );
    await saveToFile(
      JSON.stringify(config, null, 2),
      output,
      !config.readOnly,
      DIRECTORIES.CONFIG_DTO,
      config.id,
      config.module,
      basePath,
      EXTENSIONS.JSON,
    );
  }
};

export const normalizeDTOType = (type: ObjectTypes): string => {
  switch (type) {
    case 'dto':
      return 'DTO';
    case 'response':
      return 'DTO';
    case 'filter':
      return 'DTO';
    case 'command':
      return 'Command';
    case 'query':
      return 'Query';
    case 'event':
      return 'Event';
    case 'graphqlType':
      return 'GraphQLType';
    case 'graphqlInput':
      return 'GraphQLInput';
  }
};

export const normalizeName = (name: string, type: ObjectTypes): string => {
  switch (type.toLowerCase()) {
    case 'dto':
      return name.replace(/dto$/i, '');
    case 'response':
      return name.replace(/dto$/i, '');
    case 'command':
      return name.replace(/command$/i, '');
    case 'query':
      return name.replace(/query$/i, '');
    case 'event':
      return name.replace(/event$/i, '');
    case 'graphqltype':
    case 'graphqlinput':
      return name;
    default:
      return name;
  }
};
