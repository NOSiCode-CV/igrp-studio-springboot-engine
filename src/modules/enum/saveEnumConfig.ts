import {saveToFile} from '../common/saveToFile';
import {EnumConfig} from '../../interfaces/types';
import {DIRECTORIES, ERROR_MESSAGE, EXTENSIONS} from '../../utils/constants';
import {getEnumConfigPath} from '../../utils/helpers';

/**
 * Generates and saves the configuration file of an enum.
 * @param config - Enum configuration.
 * @param basePath - Output directory where the enum configuration file will be saved.
 * @throws Throws an error if the enum configuration or output directory is invalid.
 */
export const saveEnumConfig = async (config: EnumConfig, basePath: string) => {
  if (config.values.length === 0) {
    throw ERROR_MESSAGE.EMPTY_ATTRIBUTE;
  }

  const output = getEnumConfigPath(basePath, config.module ?? DIRECTORIES.SHARED, config.name);

  // Override the file only if it is NOT readOnly
  await saveToFile(
    JSON.stringify(config, null, 2),
    output,
    !config.readOnly,
    DIRECTORIES.CONFIG_ENUM,
    config.id,
    config.module,
    basePath,
    EXTENSIONS.JSON,
  );
};