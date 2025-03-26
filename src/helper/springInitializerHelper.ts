import axios from 'axios';
import { Dependency, SpringInitializerData } from '../interfaces/springDependencyTypes';
import { SPRING_DEPENDENCY_CACHE_FILE } from '../utils/constants';
import fs from 'fs';

export const SPRING_BOOT_VERSION = '3.4.3';
export const SPRING_INITIALIZER_DEPENDENCIES_DATA_URL = 'https://start.spring.io/dependencies?bootVersion=';

export async function getSpringInitializerDependencies(): Promise<Dependency[]> {
  try {
    const response = await axios.get(
      `${SPRING_INITIALIZER_DEPENDENCIES_DATA_URL}${SPRING_BOOT_VERSION}`,
    );

    const springInitializerData: SpringInitializerData = {
      bootVersion: response.data.bootVersion,
      dependencies: response.data.dependencies,
      repositories: response.data.repositories,
      boms: response.data.boms,
    };

    return mapDependencies(springInitializerData.dependencies);

  } catch (error) {
    console.error(`Failed to fetch from the internet`);
    console.info(`Getting local dependencies for spring boot version ${SPRING_BOOT_VERSION}`);
    try {

      const cachedDependencies: string = await fs.promises.readFile(SPRING_DEPENDENCY_CACHE_FILE, 'utf-8');
      const springInitializerData: SpringInitializerData = JSON.parse(cachedDependencies);

      return mapDependencies(springInitializerData.dependencies);
    } catch (error) {
      console.error('Failed to read from the local dependency JSON file:', error);
    }
  }
  return Promise.resolve<Dependency[]>([]);
}

const mapDependencies = (dependencies: SpringInitializerData['dependencies']): Dependency[] => {
  return Object.entries(dependencies).map(([name, dependency]) => ({
    name,
    groupId: dependency.groupId,
    artifactId: dependency.artifactId,
    scope: dependency.scope,
    version: dependency.version || '',
    bom: dependency.bom || '',
  }));
};
