import path from 'path';
import fs from 'fs-extra';
import { addDTO, deleteDTO } from "../src";
import { ApiConfig, DTOConfig } from "../src/interfaces/types";
import { readJsonFile } from '../src/utils/readJsonFiles';
import { DIRECTORIES, EXTENSIONS } from "../src/utils/constants";
import { getMainPath } from '../src/utils/helpers';

const basePath = ''

describe('DTO generator', () => {
    it('should force delete a dto', async () => {
        const model: DTOConfig = {
            type: 'dto',
            name: 'DTO2Delete',
            template: 'record',
            attributes: [
              { type: 'String', name: 't0'},
        
              { type: { name: 'DTO1', namespace: 'cv.gov.mf.dto'}, name: 't1'},
              { type: { name: 'CTO1', namespace: 'cv.gov.mf.dto'}, name: 't2'},
        
              { type: { name: 'List', namespace: 'java.util', generics:[{name: 'Integer'}]}, name: 't3'},
              { type: { name: 'List', namespace: 'java.util', generics:[{name: 'BigDecimal', namespace: 'java.math'}]}, name: 't4'},
            ]
        };

        await addDTO(model, basePath);

        const configPath = path.join(basePath, DIRECTORIES.BASE_API);
        const config: ApiConfig = await readJsonFile(configPath);
        const modelPath = path.join(
            basePath,
            getMainPath(config.group, config.artifact),
            DIRECTORIES.DTO,
            `${model.name}${EXTENSIONS.JAVA}`
        );
        
        const pathExists = await fs.pathExists(modelPath);
        
        await deleteDTO(model, basePath, true)
        const pathNotExists = !await fs.pathExists(modelPath);
        expect(pathExists&&pathNotExists).toBeTruthy();
    });
  
});