import axios from 'axios';
import { Dependency, SpringInitializerData } from '../interfaces/springDependencyTypes';
import { ERROR_MESSAGE } from '../utils/constants';
import path from 'path';
import fs from 'fs';

export const SPRING_BOOT_VERSION = '3.4.3';
export const SPRING_LOCAL_DEPENDENCY_FILE_DATA = 'spring-dependencies.json';
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
    console.error('Failed to fetch from the internet. Getting local dependencies', error);
    try {
      const filePath = path.resolve(__dirname, `../../${SPRING_LOCAL_DEPENDENCY_FILE_DATA}`);
      const localData = fs.readFileSync(filePath, 'utf-8');
      const springInitializerData: SpringInitializerData = JSON.parse(localData);

      return mapDependencies(springInitializerData.dependencies);
    } catch (fileError) {
      console.error('Failed to read from the local JSON file:', fileError);
      throw ERROR_MESSAGE.FAILED_TO_GET_SPRING_DEPENDENCIES;
    }
  }
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
