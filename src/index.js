import express from 'express';
import cors from 'cors';
import { checkExistDirectory } from './helpers/check-exist-directory.js';
import './crons/delete-file.cron.js';
import { multerErrorMiddleware } from './middlewares/multer-error.middleware.js';
import { mainRouter } from './resources/main.route.js';

const app = express();

app.use(cors());
app.use(express.json());
checkExistDirectory();
app.use(mainRouter);
app.use(multerErrorMiddleware());

export { app };
