import { EnumConfig, } from '../../interfaces/types';
import {
    loadEnumConfig,
    loadEnumConfigs,
} from '../../utils/helpers';

export const getEnumTypes = async function (module:string, basePath: string): Promise<Map<string, EnumConfig>> {
    const configs = await loadEnumConfigs(module, basePath)
    const types: Map<string, EnumConfig> = new Map<string, EnumConfig>();
    configs.forEach(cfg => types.set(`${cfg.name}`, cfg));
    return types;
}

export const getEnumAttributes = async function (name: string, basePath: string): Promise<String[]> {
    const configs: EnumConfig = await loadEnumConfig(basePath, name)
    return configs.values.map(it => it.name)
}
