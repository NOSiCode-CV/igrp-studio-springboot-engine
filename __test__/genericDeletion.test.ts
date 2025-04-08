import { deleteElement } from '../src';
import { DeleteConfig } from '../src/interfaces/types';
// @ts-ignore
import { DOMAIN_OUTPUT_DIR, TECHNICAL_OUTPUT_DIR } from './outputDirPath';

describe('Generic deletion in domain driven design project style', () => {
    it('should delete a element', async () => {
        const element: DeleteConfig = {
          name: "Level",
          type: 'enum',
          module: 'shared'
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