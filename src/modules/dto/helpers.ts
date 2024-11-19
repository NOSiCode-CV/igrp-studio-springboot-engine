import { ApiConfig, DTOConfig, JavaAttribute } from '../../interfaces/types';
import { PACKAGES } from "../../utils/constants";
import { getPackageNameFromConfig, loadConfig, loadDTOConfig, loadDTOConfigs } from '../../utils/helpers';

export const getDTOTypes = async function (basePath: string): Promise<Map<string, DTOConfig>> {
    const configs = await loadDTOConfigs(basePath)
    const types: Map<string, DTOConfig> = new Map<string, DTOConfig>();
    configs.forEach(cfg => types.set(`${cfg.name}`, cfg));
    return types;
}

export const getDTOAttributes = async function (basePath: string, name: string): Promise<JavaAttribute[]> {
    const configs: DTOConfig = await loadDTOConfig(basePath, name)
    return configs.attributes
}
