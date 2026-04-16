import path from 'path';
import { ApiConfig } from '../../interfaces/types';
import { saveToFile } from '../common/saveToFile';
import { COMMON_FILES, DIRECTORIES } from '../../utils/constants';

export const saveBaseApiFileConfig = async (config: ApiConfig, basePath: string) => {
  const baseApiFileOutputPah = path.join(basePath, DIRECTORIES.IGRPSTUDIO, COMMON_FILES.BASE_API);
  await saveToFile(JSON.stringify(config, null, 2), baseApiFileOutputPah);
};
