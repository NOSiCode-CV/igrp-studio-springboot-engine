import { OUTPUT_DIR } from "../src/utils/constants";
import { ModelConfig, ApiConfig } from '../src/interfaces/types';
import { newApi } from '../src/newApi';

const modelConfig: ModelConfig = {
  type: "model",
  name: "User",
  attributs: []
}


beforeAll(async () => {
  const apiConfig: ApiConfig ={
    type: "baseApi",
    apiName: "api-rest",
    group: "nosi",
    artifact: "igrp",
    description: "api-rest application"
  }

  await newApi(apiConfig, OUTPUT_DIR);
})

