import {saveToFile} from '../common/saveToFile';
import {DTOConfig, ObjectTypes} from '../../interfaces/types';
import {DIRECTORIES, ERROR_MESSAGE, EXTENSIONS} from '../../utils/constants';
import {getDTOConfigPath} from '../../utils/helpers';

/**
 * Generates and saves the configuration file of a DTO.
 * @param config - DTO configuration.
 * @param basePath - Output directory where the DTO configuration file will be saved.
 * @throws Throws an error if the DTO configuration or output directory is invalid.
 */
export const saveDTOConfig = async (config: DTOConfig, basePath: string) => {
  if (config.attributes.length === 0) {
    throw ERROR_MESSAGE.EMPTY_ATTRIBUTE;
  }

  const output = getDTOConfigPath(
    normalizeDTOType(config.type),
    config.module ?? DIRECTORIES.SHARED,
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
    default:
      return name;
  }
};