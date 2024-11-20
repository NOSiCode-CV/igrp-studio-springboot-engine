import { saveToFile } from '../common/saveToFile';
import { DTOConfig } from '../../interfaces/types';
import { DIRECTORIES, ERROR_MESSAGE } from '../../utils/constants';
import { getDTOConfigPath } from '../../utils/helpers';

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

  const output = getDTOConfigPath(config.module ?? DIRECTORIES.SHARED, config.name, basePath);
  await saveToFile(JSON.stringify(config), output);
};
