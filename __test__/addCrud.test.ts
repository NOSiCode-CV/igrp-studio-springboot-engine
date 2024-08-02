import fs from 'fs-extra';
import path from 'path';
import { ModelConfig, Crud} from '../src/interfaces/types';
import { COMMON_FILES, DIRECTORIES, EXTENSIONS, OUTPUT_DIR } from '../src/utils/constants';
import { readJsonFile } from '../src/utils/readJsonFiles';
import { addCrud } from '../src/addCrud';
import { getMainPath } from '../src/utils/helpers';



const librayModel: ModelConfig = {
  type: 'model',
  name: 'Library',
  package: 'nosi.igrp',
  attributs: [
    {
      type: 'String',
      name: 'name',
      unique: false,
      notNull: true,
    },
    {
      type: 'String',
      name: 'address',
      unique: true,
      notNull: true,
    }
  ],
  relations: [
    {
      relationType: 'ManyToMany',
      entity: 'Book',
      mappedBy: 'library',
    },
  ],
  crud: {
    enabled: true,
    path: 'users',
    disabledMethods: ['delete', 'save']
  }
};


describe('Model generator', () => {
  const packageName = librayModel.package?.split('.');
  const [group, artifact] = [...packageName!];
  const repository = path.join(
    OUTPUT_DIR,
    getMainPath(group, artifact),
    DIRECTORIES.MODELS,
    librayModel.name,
    `${librayModel.name}${COMMON_FILES.REPOSITORY}`
  )


   /**
   * should:
   * 1- update the model json file configuratio
   * 2- update the model in the api
   * 3- generate the repository interface
   */
  it('should update adding the crud in the model configuration and the model in the api', async () => {

    await addCrud(librayModel, OUTPUT_DIR);

    const libraryConfigPath = path.join(OUTPUT_DIR, DIRECTORIES.CONFIG_MODEL, `${librayModel.name}${EXTENSIONS.JSON}`);
    const libraryModelConfig: ModelConfig = await readJsonFile(libraryConfigPath);
    expect(libraryModelConfig.crud).toBeTruthy();

    const fileExists = await fs.pathExists(repository);
    expect(fileExists).toBeTruthy();

  });
});
