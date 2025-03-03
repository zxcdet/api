import https from 'https';
import { upload } from '../middlewares/multer-resolver.middleware.js';
import fs from 'node:fs';
import path from 'path';
import { checkExistDirectory } from '../helpers/check-exist-directory.js';
import { __dirname } from '../common/root-path.js';
import express from 'express';
import status from 'http-status';

const router = express.Router();
const uploadsFilePath = path.join(__dirname, '../', '../', 'uploads');
router.get('/', (req, res) => {
  res.send('Hello World!');
});

router.get('/proxy', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res
        .status(status.BAD_REQUEST)
        .json({ error: `URL is required: ${status['400_MESSAGE']}` });
    }

    https
      .get(url, (response) => {
        if (response.statusCode !== status.OK) {
          res
            .status(status.INTERNAL_SERVER_ERROR)
            .json({ error: `Failed to fetch image: ${status['500_MESSAGE']}` });
          return;
        }
        res.setHeader('Content-Type', response.headers['content-type']);
        response.pipe(res);
      })
      .on('error', () => {
        res
          .status(status.INTERNAL_SERVER_ERROR)
          .json({ error: `Failed to fetch image: ${status['500_MESSAGE']}` });
      });
  } catch (error) {
    console.error(error);
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ error: `${status['500_MESSAGE']}` });
  }
});

router.post('/save-image', upload.single('image'), (req, res) => {
  res.send({
    url: `http://localhost:3000/image?path=${req.file.path}&timestamp=${req.file.path.split('-')[0]}`,
  });
});

router.post('/save-files', upload.array('files', 20), (req, res) => {
  const result = [];
  if (!req.files || req.files.length === 0) {
    return res
      .status(status.BAD_REQUEST)
      .json({ message: `Uncorrected format: ${status['400_MESSAGE']}` });
  }
  req.files.forEach((file) => {
    result.push(
      `http://localhost:3000/image?path=${file.path}&timestamp=${file.path.split('-')[0]}`,
    );
  });
  res.send(result);
});

router.get('/image-urls', async (req, res) => {
  try {
    checkExistDirectory();
    const files = await fs.promises.readdir(path.join(uploadsFilePath));
    const result = files.map(
      (file) =>
        `http://localhost:3000/image?path=uploads/${file}&timestamp=${file.split('-')[0]}`,
    );
    res.json(result);
  } catch (error) {
    console.error(error);
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ error: `${status['500_MESSAGE']}` });
  }
});

router.get('/image', (req, res) => {
  const filePath = req.query.path;
  const timestamp = req.query.timestamp;
  const currentTime = Date.now();
  if (isNaN(timestamp) || currentTime - timestamp > 2 * 60 * 1000) {
    return res
      .status(status.FORBIDDEN)
      .json({ error: `Link expired: ${status['403_MESSAGE']}` });
  }
  if (filePath) {
    res.sendFile(path.join(__dirname, '../', '../', filePath));
  }
});

const mainRouter = router;
export { mainRouter };
