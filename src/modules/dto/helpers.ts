import { ApiConfig, DTOConfig, JavaAttribute, ObjectTypes } from '../../interfaces/types';
import { PACKAGES } from "../../utils/constants";
import { getPackageNameFromConfig, loadConfig, loadDTOConfig, loadDTOConfigs } from '../../utils/helpers';

export const getDTOTypes = async function (module:string, basePath: string): Promise<Map<string, DTOConfig>> {
    const configs = await loadDTOConfigs(module, basePath)
    const types: Map<string, DTOConfig> = new Map<string, DTOConfig>();
    configs.forEach(cfg => types.set(`${cfg.name}DTO`, cfg));
    return types;
}

export const getDTOAttributes = async function (type: ObjectTypes, basePath: string, name: string): Promise<JavaAttribute[]> {
    const configs: DTOConfig = await loadDTOConfig(type, basePath, name)
    return configs.attributes
}
