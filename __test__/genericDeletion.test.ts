import { addDTO, deleteDTO, deleteElement, deleteResponse } from '../src';
import { ApiConfig, DeleteConfig, DTOConfig, ResponseConfig } from '../src/interfaces/types';
import { readJsonFile } from '../src/utils/readJsonFiles';
import { DIRECTORIES, EXTENSIONS } from "../src/utils/constants";
import { getMainPath } from '../src/utils/helpers';
import path from 'path';
import fs from 'fs-extra';

const TECHNICAL_OUTPUT_DIR = 'C:\\spring-engine\\demoTechnical'
const DOMAIN_OUTPUT_DIR = 'C:\\spring-engine\\demoDomain'

describe('Generic deletion in domain driven design project style', () => {
    it('should delete a element', async () => {
        const element: DeleteConfig = {
          name: "TestResponseIsolated",
          type: 'response',
        };

        await deleteElement(element, DOMAIN_OUTPUT_DIR)
    });

});

describe('Generic deletion in technical style', () => {
  it('should delete a element', async () => {
    const element: DeleteConfig = {
      name: "Teste",
      type: 'dto',
    };

    await deleteElement(element, TECHNICAL_OUTPUT_DIR)
  });

});