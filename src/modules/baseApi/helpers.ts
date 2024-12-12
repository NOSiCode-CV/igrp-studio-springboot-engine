import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { DIRECTORIES, EXTENSIONS, HELPER_FILES } from '../../utils/constants';

/**
 * Normalizes a given string to make it a valid folder name.
 */
function normalizeJarPath(jarPath: string): string {
  const jarName = path.basename(jarPath, '.jar');
  return jarName.replace(/\s+/g, '-');
}

/**
 * Executes the Jar Inspector Java JAR file with the given arguments.
 */
export const runJarInspector = (basePath: string, jarPath: string) => {
  const normalizedJarName = normalizeJarPath(jarPath);
  const outputJsonPath = path.join(
    basePath,
    DIRECTORIES.IGRPSTUDIO,
    DIRECTORIES.CONFIG_LIBRARIES,
    normalizedJarName,
    `${DIRECTORIES.CONFIG_LIBRARY}${EXTENSIONS.JSON}`
  );

  const outputDir = path.dirname(outputJsonPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Prepare the Java command
  const javaCommand = `java -jar ${HELPER_FILES.JAR_INSPECTOR} ${jarPath} ${outputJsonPath}`;
  console.log(`Executing command: ${javaCommand}`); // Log the full command

  exec(javaCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Execution error: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }

    if (stdout) {
      console.log(`stdout: ${stdout}`);
    }

    console.log(`Jar Inspector completed successfully. Output written to: ${outputJsonPath}`);
  });
};
