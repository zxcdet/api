import path from 'path';
import fs from 'node:fs';
import { checkExistDirectory } from '../helpers/check-exist-directory.js';
import { __dirname } from './root-path.js';

export const deleteFiles = async () => {
  checkExistDirectory();
  const filePath = path.join(__dirname, '../', '../', 'uploads');
  const currentTime = Date.now();
  try {
    const files = await fs.promises.readdir(filePath);
    if (files.length === 0) {
      return;
    }
    const filesToDelete = files.filter(
      (file) => currentTime - file.split('-')[0] > 2 * 60 * 1000,
    );
    await Promise.all(
      filesToDelete.map(async (file) => {
        const filePathToDelete = path.join(filePath, file);
        await fs.promises.unlink(filePathToDelete);
      }),
    );
  } catch (err) {
    console.error('Cannot delete files', err);
  }
};
