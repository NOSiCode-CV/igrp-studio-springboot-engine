import { EnumConfig, } from '../../interfaces/types';
import {
    loadEnumConfig,
    loadEnumConfigs,
} from '../../utils/helpers';

export const getEnumTypes = async function (module: string, basePath: string): Promise<Map<string, EnumConfig>> {
    const configs = await loadEnumConfigs(module, basePath)
    const types: Map<string, EnumConfig> = new Map<string, EnumConfig>();
    configs.forEach(cfg => types.set(`${cfg.name}`, cfg));
    return types;
}

export const getEnumAttributes = async function (name: string, basePath: string): Promise<String[]> {
    const configs: EnumConfig = await loadEnumConfig(basePath, name)
    return configs.values.map(it => it.name)
}

export const verifyEnumAttributes = async function (config: EnumConfig): Promise<EnumConfig> {
    // this is a Temporary fix to remove enum props

    if (config.values) {
        // Verificar se todos os valores têm 'attributes' vazios
        const allAttributesEmpty = config.values.every(value => !value.attributes || value.attributes.length === 0);

        // Se todos os 'attributes' estão vazios, define 'config.attributes' como um array vazio
        if (allAttributesEmpty) {
            config.attributes = [];
        } else {
            // Verificar se todos os valores têm apenas um atributo ou um atributo vazio
            const allHaveOneAttributeOrEmpty = config.values.every(value =>
                value.attributes && (value.attributes.length === 1 || value.attributes.length === 0)
            );

            if (allHaveOneAttributeOrEmpty) {
                // Remover o atributo 'description' se existir
                config.attributes = config.attributes?.filter(attribute => attribute.name !== 'description');
            }
        }
    }

    return config;
};

