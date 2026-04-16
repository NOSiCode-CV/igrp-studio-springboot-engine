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

  return <ApiConfig>apiConfig;
};