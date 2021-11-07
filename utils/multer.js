const multer = require('multer');
const path = require('path');

const multerFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname);
  const allowedExtension = ['.jpg', '.jpeg', '.png'];
  if (!allowedExtension.includes(extension)) {
    cb(new Error('File Format is Not Supported', false));
    return;
  }
  cb(null, true);
};

module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: multerFilter,
});
