import { deleteElement } from '../src';
import { DeleteConfig } from '../src/interfaces/types';

const TECHNICAL_OUTPUT_DIR = 'C:\\spring-engine\\demoTechnical'
const DOMAIN_OUTPUT_DIR = 'C:\\spring-engine\\demoDomain'

describe('Generic deletion in domain driven design project style', () => {
    it('should delete a element', async () => {
        const element: DeleteConfig = {
          name: "TestResponseIsolated",
          type: 'response',
          module: 'core'
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