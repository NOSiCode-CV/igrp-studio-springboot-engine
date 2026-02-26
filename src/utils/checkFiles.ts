import fs from 'fs-extra';

export const checkIfDirectoryIsEmpty = async (directoryPath: string) =>
  (await fs.readdir(directoryPath)).length === 0;

export const checkIfDirectoryExists = async (directoryPath: string): Promise<boolean> => {
  return fs.existsSync(directoryPath);
};
