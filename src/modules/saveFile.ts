import { isApiConfig, isModelConfig, isControllerConfig } from '../utils/checkFiles';
import { ApiConfig, ControllerConfig, ModelConfig } from '../interfaces/types';
import { saveFileConfig } from './saveBaseApiFiles';
import { OUTPUT_DIR } from '../utils/constants';
import { saveModelFiles } from './saveModelFiles';


export const saveFiles = async (config: ApiConfig | ModelConfig | ControllerConfig, outputDir: string) => {
  if (isApiConfig(config)) {
    await saveFileConfig(config, outputDir)
  }

  if (isModelConfig(config)) {
    await saveModelFiles(config, outputDir)
  }

  if (isControllerConfig(config)) {}

};

const config: ModelConfig = {
  type: "model",
  name: "Studant",
  attributs: [
    {name: "id", primary: true, type: "String"},
    {name: "name", type: "String"},
    {name: "lastName", type: "String"}
  ]
}

saveFiles(config, OUTPUT_DIR);