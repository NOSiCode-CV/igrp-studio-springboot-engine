import axios from 'axios';
import { Dependency, SpringInitializerData } from '../interfaces/springDependencyTypes';
import fs, { pathExists } from 'fs-extra';
import { getPaths } from '../index';

export const SPRING_BOOT_VERSION = '3.4.5';
export const SPRING_INITIALIZER_DEPENDENCIES_DATA_URL = `https://start.spring.io/dependencies?bootVersion=${SPRING_BOOT_VERSION}`;

export async function getSpringInitializerDependencies(): Promise<Dependency[]> {
  try {
    const response = await axios.get(`${SPRING_INITIALIZER_DEPENDENCIES_DATA_URL}`);

    const data = response.data;

    const springInitializerData: SpringInitializerData = {
      bootVersion: data.bootVersion,
      dependencies: data.dependencies,
      repositories: data.repositories,
      boms: data.boms,
    };

    return mapDependencies(springInitializerData.dependencies);
  } catch (error) {
    const SPRING_DEPENDENCY_CACHE_FILE = getPaths().springDependencies;

    console.error(`Failed to fetch from the internet`);
    console.info(`Getting local dependencies for spring boot version ${SPRING_BOOT_VERSION}`);
    try {
      console.log(SPRING_DEPENDENCY_CACHE_FILE);

      const cachedDependencies = await fs.readFile(SPRING_DEPENDENCY_CACHE_FILE, 'utf-8');
      const b = await pathExists(SPRING_DEPENDENCY_CACHE_FILE);

      console.log(`Path exists ? ${b}`);
      console.log(`${cachedDependencies}`);

      const springInitializerData: SpringInitializerData = JSON.parse(cachedDependencies);

      console.info('--------------------------------------------');
      console.log(springInitializerData.dependencies);
      console.info('--------------------------------------------');

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
