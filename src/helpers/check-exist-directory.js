import fs from 'node:fs';

export function checkExistDirectory() {
  const uploadDir = 'uploads';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
}
