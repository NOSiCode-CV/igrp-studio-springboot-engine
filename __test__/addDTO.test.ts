import { DTOConfig, RenderContext } from '../src/interfaces/types';
import { generateDTO, renderDTO } from '../src/modules/dto/generateDTO';


describe('DTO generator', () => {

    it('should generate a classica dto with declared fields', async () => {
        const model: DTOConfig = {
            type: 'dto',
            name: 'TPessoa',
            template: 'classic',
            attributes: [
              { type: 'String', name: 't0'},
        
              { type: { name: 'DTO1', namespace: 'cv.gov.mf.dto'}, name: 't1'},
              { type: { name: 'CTO1', namespace: 'cv.gov.mf.dto'}, name: 't2'},
        
              { type: { name: 'List', namespace: 'java.util', generics:[{name: 'Integer'}]}, name: 't3'},
              { type: { name: 'List', namespace: 'java.util', generics:[{name: 'BigDecimal', namespace: 'java.math'}]}, name: 't4'},
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
        const dto = await renderDTO(context);
        console.log(dto);
        const result = [
            /package cv.gov.dto_test.dto.TPessoa;/,
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
              { type: 'String', name: 't0'},
        
              { type: { name: 'DTO1', namespace: 'cv.gov.mf.dto'}, name: 't1'},
              { type: { name: 'CTO1', namespace: 'cv.gov.mf.dto'}, name: 't2'},
        
              { type: { name: 'List', namespace: 'java.util', generics:[{name: 'Integer'}]}, name: 't3'},
              { type: { name: 'List', namespace: 'java.util', generics:[{name: 'BigDecimal', namespace: 'java.math'}]}, name: 't4'},
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
        const dto = await renderDTO(context);
        console.log(dto);
        const result = [
            /package cv.gov.dto_test.dto.TPessoa;/,
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
});