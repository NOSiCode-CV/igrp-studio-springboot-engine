import { ModelConfig } from "../../interfaces/types";
import { templateGenerator } from "../common/templateGenerator";
import { ERROR_MESSAGE, TEMPLATES } from "../../utils/constants";

export const modelGenerator = async (config: ModelConfig) =>{
  if (!config || !config.name || !config.attributes) {
    throw ERROR_MESSAGE.INVALID_MODEL_CONFIG
  }

  if (config.attributes.length === 0 ) {
    throw ERROR_MESSAGE.EMPTY_ATTRIBUTE
  }

  const templateModel = await templateGenerator(TEMPLATES.DOMAIN_MODEL, config);

  return templateModel
}