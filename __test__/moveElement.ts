import { moveElement } from '../src';
import { MoveConfig } from '../src/interfaces/types';
// @ts-ignore
import { DOMAIN_OUTPUT_DIR, TECHNICAL_OUTPUT_DIR } from './outputDirPath';

describe('Generic deletion in domain driven design project style', () => {
    it('should move a element', async () => {
        const element: MoveConfig = {
          name: "Level",
          type: 'enum',
          sourceModule: 'shared',
          destinationModule: 'core'
        };

        await moveElement(element, DOMAIN_OUTPUT_DIR)
    });

});

describe('Generic deletion in technical style', () => {
  it('should move a element', async () => {
    const element: MoveConfig = {
      name: "Teste",
      type: 'dto',
      sourceModule: 'shared',
      destinationModule: 'core'
    };

    await moveElement(element, TECHNICAL_OUTPUT_DIR)
  });

});