import multer from 'multer';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    const uniqueSuffix = `${Date.now()}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/gif',
    'image/webp',
    'image/tiff',
  ];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Uncorrected format'), false);
  }
  cb(null, true);
};
export const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 },
  fileFilter,
});
