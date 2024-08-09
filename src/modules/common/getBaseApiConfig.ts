import fs from 'fs-extra';
import path from 'path';
import { COMMON_FILES, DIRECTORIES, ERROR_MESSAGE } from '../../utils/constants';
import { ApiConfig } from '../../interfaces/types';

export const getBaseApiConfig = async  (basePath: string): Promise<ApiConfig> => {
    const apiConfig = await fs.readJSON(path.join(basePath, DIRECTORIES.IGRPSTUDIO, COMMON_FILES.BASE_API));

    if (!apiConfig?.type || !apiConfig?.artifact || !apiConfig?.group || !apiConfig?.name ) {
        throw ERROR_MESSAGE.INVALID_API_CONFIG;
    }
    return <ApiConfig> apiConfig;
}