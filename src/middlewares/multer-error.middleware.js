import multer from 'multer';

export function multerErrorMiddleware() {
  return (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: 'Error file' });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  };
}
