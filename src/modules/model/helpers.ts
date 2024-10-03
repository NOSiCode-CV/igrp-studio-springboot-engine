import { ModelConfig } from "../../interfaces/types";
import { loadModelConfigs } from "../../utils/helpers";

export const getModelTypes = async function (basePath: string): Promise<Map<string, ModelConfig>> {
    const configs = await loadModelConfigs(basePath)
    const types: Map<string, ModelConfig> = new Map<string, ModelConfig>();
    configs.forEach(cfg => types.set(`${cfg.name}`, cfg));
    return types;
}