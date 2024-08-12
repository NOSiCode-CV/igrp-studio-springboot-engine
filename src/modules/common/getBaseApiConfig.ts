import fs from 'fs-extra';
import path from 'path';
import { COMMON_FILES, DIRECTORIES, ERROR_MESSAGE } from '../../utils/constants';
import { ApiConfig } from '../../interfaces/types';

/**
* Loads and validates the base API configuration from the `baseApi.json` file.
*
* @param {string} basePath - Base path where the API configuration is located.
* @returns {Promise<ApiConfig>} - Returns a promise that resolves to the API configuration (`ApiConfig`).
* @throws {Error} - Throws an error if the configuration file is invalid or missing required properties.
*/
export const getBaseApiConfig = async  (basePath: string): Promise<ApiConfig> => {
    const apiConfig = await fs.readJSON(path.join(basePath, DIRECTORIES.IGRPSTUDIO, COMMON_FILES.BASE_API));

    if (!apiConfig?.type || !apiConfig?.artifact || !apiConfig?.group || !apiConfig?.apiName ) {
        throw ERROR_MESSAGE.INVALID_API_CONFIG;
    }

    return <ApiConfig> apiConfig;
}