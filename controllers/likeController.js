const Like = require('../models/likeModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.createLike = catchAsync(async (req, res, next) => {
  if (!req.body.blog) req.body.blog = req.params.id;
  if (!req.body.user) req.body.user = req.user.id;

  const newLike = await Like.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      newLike,
    },
  });
});

exports.getAllLikes = catchAsync(async (req, res, next) => {
  const likes = await Like.find();

  res.status(200).json({
    status: 'success',
    results: likes.length,
    data: {
      likes,
    },
  });
});
exports.getLikeById = catchAsync(async (req, res, next) => {
  const like = await Like.findById(req.params.likeId);

  res.status(200).json({
    status: 'success',
    data: {
      like,
    },
  });
});

exports.getLike = catchAsync(async (req, res, next) => {
  const user = req.user.id;
  const blog = req.params.id;
  console.log(user, blog);
  const likedBlog = await Like.findOne({ user, blog });

  res.status(200).json({
    status: 'success',
    data: {
      likedBlog,
    },
  });
});

exports.deleteLike = catchAsync(async (req, res, next) => {
  await Like.findByIdAndDelete(req.params.likeId);

  res.status(200).json({
    status: 'success',
    data: null,
  });
});
