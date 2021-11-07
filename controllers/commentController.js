const Comment = require('../models/commentModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.createComment = catchAsync(async (req, res, next) => {
  if (!req.body.blog) req.body.blog = req.params.id;
  if (!req.body.user) req.body.user = req.user.id;

  const newComment = await Comment.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      newComment,
    },
  });
});

exports.getAllComments = catchAsync(async (req, res, next) => {
  const comments = await Comment.find();

  res.status(200).json({
    status: 'success',
    results: comments.length,
    data: {
      comments,
    },
  });
});
exports.deleteComment = catchAsync(async (req, res, next) => {
  await Comment.findByIdAndDelete(req.params.commentId);

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

exports.getComments = catchAsync(async (req, res, next) => {
  const comments = await Comment.find({ blog: req.params.id }).populate({
    path: 'user',
    select: 'name photo',
  });

  res.status(200).json({
    status: 'success',
    results: comments.length,
    data: {
      comments,
    },
  });
});
