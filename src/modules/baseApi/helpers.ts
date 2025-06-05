import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { DIRECTORIES, HELPER_FILES } from '../../utils/constants';

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
export const runJarInspector = async (basePath: string, jarPath: string) => {
  const outputJsonPath = path.join(basePath, DIRECTORIES.IGRPSTUDIO);

  const igrpSharedPath = path.join(outputJsonPath, DIRECTORIES.SHARED);

  const paths = [
    outputJsonPath,
    igrpSharedPath,
    path.join(igrpSharedPath, DIRECTORIES.CONTROLLERS),
    path.join(igrpSharedPath, DIRECTORIES.MODELS),
    path.join(igrpSharedPath, DIRECTORIES.DTO),
  ];

  const outputDir = path.dirname(igrpSharedPath);
  if (!fs.existsSync(outputDir)) {
    await Promise.all(paths.map((dir) => fs.mkdirSync(dir, { recursive: true })));
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
