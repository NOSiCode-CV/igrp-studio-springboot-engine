import { ApiConfig, DTOConfig } from "../../interfaces/types"
import { PACKAGES } from "../../utils/constants";
import { getPackageNameFromConfig, loadDTOConfigs } from "../../utils/helpers"

export const getDTOTypes = async function (basePath: string): Promise<Map<string, DTOConfig>> {
    const configs = await loadDTOConfigs(basePath)
    const types: Map<string, DTOConfig> = new Map<string, DTOConfig>();
    configs.forEach(cfg => types.set(`${cfg.name}`, cfg));
    return types;
}