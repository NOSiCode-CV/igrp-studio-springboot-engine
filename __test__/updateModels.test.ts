import fs from 'fs-extra';
import path from 'path';
import { updateModel } from '../src/updateModel';
import { getMainPath } from '../src/utils/helpers';
import { ModelConfig, Relation } from '../src/interfaces/types';
import { DIRECTORIES, EXTENSIONS, OUTPUT_DIR } from '../src/utils/constants';
import { readJsonFile } from '../src/utils/readJsonFiles';


const bookModel: ModelConfig = {
  type: 'model',
  name: 'Book',
  package: 'nosi.igrp',
  attributes: [
    {
      type: 'String',
      name: 'author',
      required: true,
      unique: false,
      notNull: false,
    },
    {
      type: 'String',
      name: 'title',
      required: true,
      unique: false,
      notNull: false,
    },
    {
      type: 'String',
      name: 'editor',
      required: true,
      unique: false,
      notNull: false,
    },
  ],
};

const librayModel: ModelConfig = {
  type: 'model',
  name: 'Library',
  attributes: [
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
};

const BookRelations: Relation[] = [
  {
    relationType: 'ManyToMany',
    entity: 'Library',
    joinColumn: 'book_id',
    joinTable: 'book_library',
    inverseJoinColumn: 'library_id',
  },
];

const LibraryRelations: Relation[] = [
  {
    relationType: 'ManyToMany',
    entity: 'Book',
    mappedBy: 'library',
  },
];

describe('Model generator', () => {
  const packageName = bookModel.package?.split('.');
  const [group, artifact] = [...packageName!];

  it('should update the model configuration file in .igrpstudio and model in the api', async () => {
    await updateModel(bookModel, OUTPUT_DIR);

    const file = path.join(
      OUTPUT_DIR,
      getMainPath(group, artifact),
      DIRECTORIES.MODELS,
      bookModel.name,
      `${bookModel.name}${EXTENSIONS.JAVA}`,
    );

    const fileExists = await fs.pathExists(file)

    expect(fileExists).toBeTruthy();

  });

  it('should update adding the relations in the model configuration and the model in the api', async () => {
    bookModel.relations = BookRelations;
    librayModel.relations = LibraryRelations;

    await updateModel(bookModel, OUTPUT_DIR);
    await updateModel(librayModel, OUTPUT_DIR);

    const bookConfigPath = path.join(OUTPUT_DIR, DIRECTORIES.CONFIG_MODEL, `${bookModel.name}${EXTENSIONS.JSON}`);
    const bookModelConfig: ModelConfig = await readJsonFile(bookConfigPath);
    expect(bookModelConfig.relations).toBeTruthy();
    
    const libraryConfigPath = path.join(OUTPUT_DIR, DIRECTORIES.CONFIG_MODEL, `${librayModel.name}${EXTENSIONS.JSON}`);
    const libraryModelConfig: ModelConfig = await readJsonFile(libraryConfigPath);
    expect(libraryModelConfig.relations).toBeTruthy();

  });
});
