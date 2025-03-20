import { getSpringDependencies } from '../src';
import { SPRING_BOOT_VERSION } from '../src/helper/springInitializerHelper';

describe('Spring initializer dependencies', () => {
  it('should print in console all dependencies from spring initializer for the version used in engine', async () => {
    console.log(`SPRING BOOT VERSION: ${SPRING_BOOT_VERSION}`);
    const dependencies = await getSpringDependencies();
    console.log(dependencies);
  });
});
