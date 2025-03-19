import axios from 'axios';
import { Dependency, SpringInitializerData } from '../interfaces/springDependencyTypes';
import { ERROR_MESSAGE, SPRING_BOOT_VERSION } from '../utils/constants';

export async function getSpringInitializerDependencies(): Promise<Dependency[]> {
  try {
    const response = await axios.get(
      `https://start.spring.io/dependencies?bootVersion=${SPRING_BOOT_VERSION}`,
    );

    const springInitializerData: SpringInitializerData = {
      bootVersion: response.data.bootVersion,
      dependencies: response.data.dependencies,
      repositories: response.data.repositories,
      boms: response.data.boms,
    };

    return Object.entries(springInitializerData.dependencies).map(([name, dependency]) => ({
      name,
      groupId: dependency.groupId,
      artifactId: dependency.artifactId,
      scope: dependency.scope,
      version: dependency.version || '',
      bom: dependency.bom || '',
    }));
  } catch (error) {
    console.error(error);
    throw ERROR_MESSAGE.FAILED_TO_GET_SPRING_DEPENDENCIES;
  }
}
