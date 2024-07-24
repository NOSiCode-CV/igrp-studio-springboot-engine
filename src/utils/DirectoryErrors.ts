import fs from 'fs-extra';

export class DirectoryDoesNotExistError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DirectoryDoesNotExistError';
    // Ensure the stack trace is correct
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DirectoryDoesNotExistError);
    }
  }
}

// Utility function to check if a directory exists
export async function checkDirectoryExists(directoryPath: string): Promise<boolean> {
  try {
    return await fs.pathExists(directoryPath);
  } catch (error) {
    // Handle potential errors
    console.error('Error checking directory existence:', error);
    throw new Error('Error checking directory existence');
  }
}
