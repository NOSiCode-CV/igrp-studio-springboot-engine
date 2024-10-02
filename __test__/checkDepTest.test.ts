import { addDTO, deleteDTO } from "../src"
import { DTOConfig } from "../src/interfaces/types"


const basePath = 'C:/Users/Eduardo\ Fernando/Downloads/apiTest'

beforeEach(() => {
  
})

describe("delete DTO", () => {
  
  it('should print the model types', async ()=> {
   
    const model: DTOConfig = {
      type: 'dto',
      name: 'TPessoaRecord',
      template: 'record',
      attributes: [
          { type: 'String', ns: 'java', name: 't0'},
          { type: 'DTO1', ns: 'dto', name: 't1'},    
          { type: { name: 'List', generics:[{name: 'Integer', ns: 'java'}]}, ns: 'java', name: 't3'},
          { type: { name: 'List', generics:[{name: 'BigDecimal', ns: 'java'}]}, ns: 'java', name: 't4'},
      ]
    };
    const model2: DTOConfig = {
      type: 'dto',
      name: 'TPessoa2Record',
      template: 'record',
      attributes: [
          { type: 'String', ns: 'java', name: 't0'},
          { type: 'DTO1', ns: 'dto', name: 't1'},    
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


    // await addDTO(dto1, basePath)
    // await addDTO(model2, basePath)
    // await addDTO(model, basePath)
    await deleteDTO(model, basePath);
  })
})
