import { controllerConfigGenerator } from '../src/modules/controller/controllerConfigGenrator';
import { ControllerConfig } from '../src/interfaces/types';
import { newControllerConfig } from '../src/newControllerConfig';
import { DIRECTORIES, OUTPUT_DIR } from '../src/utils/constants';
import fs from 'fs-extra'
import path from 'path';

const config: ControllerConfig = {
  type: 'controller',
  name: "Person",
  basePath: "/people",
  actions: [
    {
      path: "getPerson",
      name: "helloWorld",
      pathParams: [],
      response: "String"
    },
    {
      path: "getAge",
      name: "helloWorld",
      pathParams: [],
      response: "String"
    }
  ],
};

beforeAll(async () => {
  await fs.mkdir(path.join(OUTPUT_DIR, DIRECTORIES.CONFIG_CONTROLLER), {recursive: true});
});

it('should create a new controller configuration json file', async () =>{
  await newControllerConfig(config, OUTPUT_DIR);
});