const upload = require('../utils/multer');
const cloudinary = require('../utils/cloudinary');
const catchAsync = require('../utils/catchAsync');

exports.uploadSingleFile = upload.single('file');

exports.upload = catchAsync(async (req, res, next) => {
  const result = await cloudinary.uploader.upload(req.file.path);
  if (!result)
    return next(
      new AppError('Error in uploading your profile photo to database.', 400)
    );

  res.status(200).json({
    status: 'success',
    data: {
      url: result.secure_url,
      id: result.public_id,
    },
  });
});
