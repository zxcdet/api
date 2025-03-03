import cron from 'node-cron';
import { deleteFiles } from '../common/delete-old-file.js';

cron.schedule('*/2 * * * *', async () => {
  await deleteFiles();
});
