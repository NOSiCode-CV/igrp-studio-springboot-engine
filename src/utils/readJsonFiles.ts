import fs from 'fs-extra';

export const readJsonFile = async (filePath: string) => {
  const fileContent = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(fileContent);
};