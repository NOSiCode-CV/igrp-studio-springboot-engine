import path from 'path';
import fs from 'fs-extra';
import { addDTO } from '../src';
import { ApiConfig, DTOConfig, RenderContext } from '../src/interfaces/types';
import { generateDTO, _renderDTO } from '../src/modules/dto/generateDTO';
import { DIRECTORIES, EXTENSIONS } from '../src/utils/constants';
import { readJsonFile } from '../src/utils/readJsonFiles';
import { getMainPath } from '../src/utils/helpers';

const OUTPUT_DIR = ''

/*beforeAll(async () =>{
    await fs.mkdir(OUTPUT_DIR, {recursive: true});
});*/

describe('DTO generator', () => {

    it('should generate a classic dto with declared fields', async () => {
        const model: DTOConfig = {
            type: 'dto',
            name: 'TPessoa',
            template: 'classic',
            attributes: [
              { type: 'String', ns: 'java', name: 't0'},
              //{ type: { name: 'String' }, name: 't0'},
              { type: { name: 'DTO1', namespace: 'cv.gov.mf.dto'}, ns: 'dto', name: 't1'},
              { type: { name: 'CTO1', namespace: 'cv.gov.mf.dto'}, ns: 'dto', name: 't2'},
        
              { type: { name: 'List', namespace: 'java.util', generics:[{name: 'Integer', ns: 'java'}]}, ns: 'java', name: 't3'},
              { type: { name: 'List', namespace: 'java.util', generics:[{name: 'BigDecimal', ns: 'java', namespace: 'java.math'}]}, ns: 'dto', name: 't4'},
            ]
        };

        const context: RenderContext<DTOConfig> = {
            resourceConfig: model,
            basePath: '/',
            baseConfig: {
                type: 'baseApi',
                apiName: 'dt_test',
                group: 'cv.gov',
                artifact: 'dto_test',
                database: 'Oracle'
            },
        };
        const dto = await _renderDTO(context);
        console.log(dto);
        const result = [
            /package cv.gov.dto_test.dto;/,
            /import cv.gov.mf.dto.DTO1;/,
            /import cv.gov.mf.dto.CTO1;/,
            /import java.util.List;/,
            /import java.math.BigDecimal;/,
            /public class TPessoa/,
            /private String t0;/,
            /private DTO1 t1;/,
            /private CTO1 t2;/,
            /private List<Integer> t3;/,
            /private List<BigDecimal> t4;/
        ].map(p => p.test(dto)).reduce((a, b)=> a&&b);

        expect(result).toBeTruthy();
  
    });


    it('should generate a record dto with declared fields', async () => {
        const model: DTOConfig = {
            type: 'dto',
            name: 'TPessoa',
            template: 'record',
            attributes: [
                { type: 'String', ns: 'java', name: 't0'},
                //{ type: { name: 'String' }, name: 't0'},
                { type: { name: 'DTO1', namespace: 'cv.gov.mf.dto'}, ns: 'dto', name: 't1'},
                { type: { name: 'CTO1', namespace: 'cv.gov.mf.dto'}, ns: 'dto', name: 't2'},
          
                { type: { name: 'List', namespace: 'java.util', generics:[{name: 'Integer', ns: 'java'}]}, ns: 'java', name: 't3'},
                { type: { name: 'List', namespace: 'java.util', generics:[{name: 'BigDecimal', ns: 'java', namespace: 'java.math'}]}, ns: 'java', name: 't4'},
            ]
        };

        const context: RenderContext<DTOConfig> = {
            resourceConfig: model,
            basePath: '/',
            baseConfig: {
                type: 'baseApi',
                apiName: 'dt_test',
                group: 'cv.gov',
                artifact: 'dto_test',
                database: 'Oracle'
            },
        };
        const dto = await _renderDTO(context);
        console.log(dto);
        const result = [
            /package cv.gov.dto_test.dto;/,
            /import cv.gov.mf.dto.DTO1;/,
            /import cv.gov.mf.dto.CTO1;/,
            /import java.util.List;/,
            /import java.math.BigDecimal;/,
            /public record TPessoa\(/,
            /String t0,/,
            /DTO1 t1,/,
            /CTO1 t2,/,
            /List<Integer> t3,/,
            /List<BigDecimal> t4/
        ].map(p => p.test(dto)).reduce((a, b)=> a&&b);

        expect(result).toBeTruthy();
  
    });


    it('should generate a classic dto with generic types', async () => {
        const model: DTOConfig = {
            type: 'dto',
            name: 'TPessoa',
            template: 'classic',
            generics:['K','V'],
            attributes: [
              { type: 'String', ns: 'java', name: 't0'},
            ]
        };

        const context: RenderContext<DTOConfig> = {
            resourceConfig: model,
            basePath: '/',
            baseConfig: {
                type: 'baseApi',
                apiName: 'dt_test',
                group: 'cv.gov',
                artifact: 'dto_test',
                database: 'Oracle'
            },
        };
        const dto = await _renderDTO(context);
        console.log(dto);
        const result = [
            /package cv.gov.dto_test.dto;/,
            /public class TPessoa<K, V>/,
            /private String t0;/
        ].map(p => p.test(dto)).reduce((a, b)=> a&&b);

        expect(result).toBeTruthy();
  
    });


    it('should generate a record dto with generic types', async () => {
        const model: DTOConfig = {
            type: 'dto',
            name: 'TPessoa',
            template: 'record',
            generics:['K','V'],
            attributes: [
                { type: 'String', ns: 'java', name: 't0'}
            ]
        };

        const context: RenderContext<DTOConfig> = {
            resourceConfig: model,
            basePath: '/',
            baseConfig: {
                type: 'baseApi',
                apiName: 'dt_test',
                group: 'cv.gov',
                artifact: 'dto_test',
                database: 'Oracle'
            },
        };
        const dto = await _renderDTO(context);
        console.log(dto);
        const result = [
            /package cv.gov.dto_test.dto;/,
            /public record TPessoa<K, V>\(/,
            /String t0/
        ].map(p => p.test(dto)).reduce((a, b)=> a&&b);

        expect(result).toBeTruthy();
  
    });


    it('should add a classic dto with declared fields', async () => {
        const model: DTOConfig = {
            type: 'dto',
            name: 'TPessoa',
            template: 'classic',
            attributes: [
                { type: 'String', ns: 'java', name: 't0'},
                //{ type: { name: 'String' }, name: 't0'},
                { type: 'DTO1', ns: 'dto', name: 't1'},
                { type: 'CTO1', ns: 'dto', name: 't2'},
          
                { type: { name: 'List', generics:[{name: 'Integer', ns: 'java'}]}, ns: 'java', name: 't3'},
                { type: { name: 'List', generics:[{name: 'BigDecimal', ns: 'java'}]}, ns: 'java', name: 't4'},
            ]
        };

        const dto1: DTOConfig = {
            type: 'dto',
            name: 'DTO1',
            template: 'classic',
            attributes: [
                { type: 'String', ns: 'java', name: 't0'}
            ]
        };

        const cto1: DTOConfig = {
            type: 'dto',
            name: 'CTO1',
            template: 'record',
            attributes: [
                { type: 'String', ns: 'java', name: 't0'}
            ]
        };

        await addDTO(dto1, OUTPUT_DIR);
        await addDTO(cto1, OUTPUT_DIR);

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

        expect(pathExists).toBeTruthy();
  
    });

    it('should add a record dto with declared fields', async () => {
        const model: DTOConfig = {
            type: 'dto',
            name: 'TPessoaRecord',
            template: 'record',
            attributes: [
                { type: 'String', ns: 'java', name: 't0'},
                //{ type: { name: 'String' }, name: 't0'},
                { type: 'DTO1', ns: 'dto', name: 't1'},
                { type: 'CTO1', ns: 'dto', name: 't2'},
          
                { type: { name: 'List', generics:[{name: 'Integer', ns: 'java'}]}, ns: 'java', name: 't3'},
                { type: { name: 'List', generics:[{name: 'BigDecimal', ns: 'java'}]}, ns: 'java', name: 't4'},
            ]
        };

        const dto1: DTOConfig = {
            type: 'dto',
            name: 'DTO1',
            template: 'classic',
            attributes: [
                { type: 'String', ns: 'java', name: 't0'}
            ]
        };

        const cto1: DTOConfig = {
            type: 'dto',
            name: 'CTO1',
            template: 'record',
            attributes: [
                { type: 'String', ns: 'java', name: 't0'}
            ]
        };

        await addDTO(dto1, OUTPUT_DIR);
        await addDTO(cto1, OUTPUT_DIR);

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

        expect(pathExists).toBeTruthy();
  
    });
});