const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.updateMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(203).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.getAllUser = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate('myBlogs');

  if (!user) return next(new AppError('user deleted its account', 404));

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
