import { addDTO, deleteDTO, deleteElement, deleteResponse } from '../src';
import { ApiConfig, DeleteConfig, DTOConfig, ResponseConfig } from '../src/interfaces/types';
import { readJsonFile } from '../src/utils/readJsonFiles';
import { DIRECTORIES, EXTENSIONS } from "../src/utils/constants";
import { getMainPath } from '../src/utils/helpers';
import path from 'path';
import fs from 'fs-extra';

const OUTPUT_DIR = 'C:\\spring-engine\\generatedNewVersion'

describe('Generic deletion', () => {
    it('should delete a element', async () => {
        const element: DeleteConfig = {
          name: "TesteDTO",
          type: 'dto',
        };

        await deleteElement(element, OUTPUT_DIR)
    });

});