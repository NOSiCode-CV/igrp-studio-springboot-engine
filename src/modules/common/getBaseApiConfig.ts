import fs from 'fs-extra';
import path from 'path';
import { COMMON_FILES, DIRECTORIES, ERROR_MESSAGE } from '../../utils/constants';
import { ApiConfig } from '../../interfaces/types';
import { apiValidation } from '../../schema/apiConfig';

/**
 * Loads and validates the base API configuration from the `baseApi.json` file.
 *
 * @param {string} basePath - Base path where the API configuration is located.
 * @returns {Promise<ApiConfig>} - Returns a promise that resolves to the API configuration (`ApiConfig`).
 * @throws {Error} - Throws an error if the configuration file is invalid or missing required properties.
 */
export const getBaseApiConfig = async (basePath: string): Promise<ApiConfig> => {
  const apiConfig = await fs.readJSON(
    path.join(basePath, DIRECTORIES.IGRPSTUDIO, COMMON_FILES.BASE_API),
  );
  const valid = apiValidation(apiConfig);

  if (!valid && apiValidation.errors) throw apiValidation.errors;

  if (!basePath) {
    throw ERROR_MESSAGE.INVALID_OUTPUT_PATH;
  }

  // add a sanitized artifact name to be used in templates where artifact
  // may contain characters invalid for package names (e.g. hyphens)
  try {
    // create a runtime-only property that templates can use
    (apiConfig as any).artifactSanitized = (apiConfig.artifact || '').replace(/-/g, '_');
  } catch (e) {
    (apiConfig as any).artifactSanitized = apiConfig.artifact || '';
  }

  return <ApiConfig>apiConfig;
};