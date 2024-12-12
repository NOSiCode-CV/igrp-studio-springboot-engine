import path from 'path';
import os from 'os';
import AdmZip from 'adm-zip';

/**
 * Constructs the path to a dependency in the local Maven repository.
 * @param groupId - The group ID of the dependency (e.g., "org.springframework.boot").
 * @param artifactId - The artifact ID of the dependency (e.g., "spring-boot-starter-web").
 * @param version - The version of the dependency (e.g., "2.6.0").
 * @returns The full path to the `.jar` file for the specified dependency.
 */
export function getMavenJarPath(groupId: string, artifactId: string, version: string): string {
  const userHome = os.homedir(); // Get the user's home directory
  const mavenRepo = path.join(userHome, '.m2', 'repository'); // Path to the .m2 repository

  // Convert groupId to path format (e.g., "org.springframework.boot" -> "org/springframework/boot")
  const groupPath = groupId.replace(/\./g, path.sep);

  // Construct the full path to the .jar file
  const jarPath = path.join(
    mavenRepo,
    groupPath,
    artifactId,
    version,
    `${artifactId}-${version}.jar`,
  );

  return jarPath;
}

type ApiResponse = {
  classes: string[] | null;
  error?: string;
};

/**
 * Reads and filters class names from a `.jar` file based on package names.
 * @param jarPath - Path to the `.jar` file.
 * @param packagePrefixes - Array of package prefixes to filter (e.g., ["com.example.dto"]).
 * @returns An array of fully qualified class names matching the packages.
 */
export const readJarClassNames = (jarPath: string, packagePrefixes: string[]): string[] => {
  const zip = new AdmZip(jarPath);
  return zip
    .getEntries()
    .filter((entry) => entry.entryName.endsWith('.class'))
    .map((entry) => entry.entryName.replace(/\//g, '.').replace('.class', ''))
    .filter((className) => packagePrefixes.some((prefix) => className.startsWith(prefix)));
};

export function loadModuleClasses(groupId: string, artifactId: string, version: string) {
  const jarPath = getMavenJarPath(groupId, artifactId, version);
  const packagePrefixes = [
    `${groupId}.${artifactId}.dto`,
    `${groupId}.${artifactId}.model`,
    `${groupId}.${artifactId}.controller`,
  ]; // Define your target packages

  try {
    const classNames = readJarClassNames(jarPath, packagePrefixes);
    res.status(200).json({ classes: classNames });
  } catch (error) {
    console.error('Error reading .jar file:', error);
    res.status(500).json({ classes: null, error: 'Failed to read .jar file' });
  }
}
