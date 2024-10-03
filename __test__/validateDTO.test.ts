import { DTOConfig } from "../src/interfaces/types";
import { validateDeleteDTOConfig, validateDTOConfig } from "../src/schema/dtoConfig";

describe('DTO Validator', () => {

    it('all fields should be valid', async () => {
        const model: DTOConfig = {
            type: 'dto',
            name: 'TPessoa',
            template: 'classic',
            attributes: [
              { type: 'String', name: 't0'},
              //{ type: { name: 'String' }, name: 't0'},
              { type: { name: 'DTO1', namespace: 'cv.gov.mf.dto'}, name: 't1'},
              { type: { name: 'CTO1', namespace: 'cv.gov.mf.dto'}, name: 't2'},
        
              { type: { name: 'List', namespace: 'java.util', generics:[{name: 'Integer'}]}, name: 't3'},
              { type: { name: 'List', namespace: 'java.util', generics:[{name: 'BigDecimal', namespace: 'java.math'}]}, name: 't4'},
            ]
        };

        const result = validateDTOConfig(model);
        expect(result).toBeTruthy();
    })

    it('all fields should be not valid', async () => {
        const model: DTOConfig = {
            type: 'dto',
            name: 'TPessoa',
            template: 'record',
            attributes: [
              { type: 'String', name: 't0'},
              //{ type: { name: 'String' }, name: 't0'},
              { type: { name: 'DT O1', namespace: 'cv.gov.mf .dto'}, name: 't 1'},
              { type: { name: 'CTO1', namespace: 'cv.gov.mf .dto'}, name: 't 2'},
        
              { type: { name: 'Li st', namespace: 'java. util', generics:[{name: 'Integer'}]}, name: 't3'},
              { type: { name: 'List', namespace: 'java. util', generics:[{name: 'BigDecimal', namespace: 'java.math'}]}, name: 't4'},
            ]
        };

        const result = validateDTOConfig(model);
        console.log(validateDTOConfig.errors)
        expect(result).toBeFalsy();
    })


    it('all fields should be valid for deletion', async () => {
        const model: DTOConfig = {
            type: 'dto',
            name: 'TPessoa',
            template: 'record',
            attributes: [
              { type: 'String', name: 't0'},
              //{ type: { name: 'String' }, name: 't0'},
              { type: { name: 'DT O1', namespace: 'cv.gov.mf .dto'}, name: 't 1'},
              { type: { name: 'CTO1', namespace: 'cv.gov.mf .dto'}, name: 't 2'},
        
              { type: { name: 'Li st', namespace: 'java. util', generics:[{name: 'Integer'}]}, name: 't3'},
              { type: { name: 'List', namespace: 'java. util', generics:[{name: 'BigDecimal', namespace: 'java.math'}]}, name: 't4'},
            ]
        };

        const result = validateDeleteDTOConfig(model);
        expect(result).toBeTruthy();
    })

    it('all fields should not be valid for deletion', async () => {
        const model: DTOConfig = {
            type: 'dto',
            name: '../../usr',
            template: 'record',
            attributes: [
              { type: 'String', name: 't0'},
              //{ type: { name: 'String' }, name: 't0'},
              { type: { name: 'DT O1', namespace: 'cv.gov.mf .dto'}, name: 't 1'},
              { type: { name: 'CTO1', namespace: 'cv.gov.mf .dto'}, name: 't 2'},
        
              { type: { name: 'Li st', namespace: 'java. util', generics:[{name: 'Integer'}]}, name: 't3'},
              { type: { name: 'List', namespace: 'java. util', generics:[{name: 'BigDecimal', namespace: 'java.math'}]}, name: 't4'},
            ]
        };

        const result = validateDeleteDTOConfig(model);
        console.log(validateDeleteDTOConfig.errors)
        expect(result).toBeFalsy();
    })
})