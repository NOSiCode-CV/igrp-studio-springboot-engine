import path from 'path';
import fs from 'fs-extra';
import { addDTO, deleteDTO } from "../src";
import { ApiConfig, DTOConfig } from "../src/interfaces/types";
import { readJsonFile } from '../src/utils/readJsonFiles';
import { DIRECTORIES, EXTENSIONS } from "../src/utils/constants";
import { getMainPath } from '../src/utils/helpers';

const OUTPUT_DIR = 'generatedTest'

describe('DTO deletion', () => {
    it('should delete a dto', async () => {
        const model: DTOConfig = {
            type: 'dto',
            name: 'DTO2Delete',
            template: 'record',
            attributes: [
              { type: 'String', ns: 'java', name: 't0'},
            ]
        };

        await addDTO(model, OUTPUT_DIR);

        const configPath = path.join(OUTPUT_DIR, DIRECTORIES.BASE_API);
        const config: ApiConfig = await readJsonFile(configPath);
        const modelPath = path.join(
            OUTPUT_DIR,
            getMainPath(config.group, config.artifact),
            DIRECTORIES.DTO,
            `${model.name}${EXTENSIONS.JAVA}`
        );
        
        const pathExists = await fs.pathExists(modelPath);
        
        await deleteDTO(model, OUTPUT_DIR)
        const pathNotExists = !await fs.pathExists(modelPath);
        expect(pathExists&&pathNotExists).toBeTruthy();
    });

    it('should not delete a dto', async () => {
        const model: DTOConfig = {
            type: 'dto',
            name: 'DTO2DeleteV1',
            template: 'record',
            attributes: [
              { type: 'String', ns: 'java', name: 't0'},
              { type: 'DTO2DeleteV11', ns: 'dto', name: 't1'},
            ]
        };

        const dto11: DTOConfig = {
            type: 'dto',
            name: 'DTO2DeleteV11',
            template: 'record',
            attributes: [
              { type: 'String', ns: 'java', name: 't0'},
            ]
        };

        await addDTO(dto11, OUTPUT_DIR);
        await addDTO(model, OUTPUT_DIR);

        const configPath = path.join(OUTPUT_DIR, DIRECTORIES.BASE_API);
        const config: ApiConfig = await readJsonFile(configPath);
        const modelPath = path.join(
            OUTPUT_DIR,
            getMainPath(config.group, config.artifact),
            DIRECTORIES.DTO,
            `${model.name}${EXTENSIONS.JAVA}`
        );
        
        const pathExists = await fs.pathExists(modelPath);
        
        let errors;
        
        try {
            await deleteDTO(dto11, OUTPUT_DIR)
        } catch(e) {
            errors = e;
        }
        console.log(errors);
        const pathExists2 = await fs.pathExists(modelPath);
        expect(pathExists&&pathExists2).toBeTruthy();
    });
  
});