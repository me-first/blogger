const Blog = require('../models/blogModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/ApiFeatures');

exports.createBlog = catchAsync(async (req, res, next) => {
  req.body.author = req.user.id;

  const newBlog = await Blog.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      newBlog,
    },
  });
});

exports.getAllBlogs = catchAsync(async (req, res, next) => {
  const query = Blog.find();

  const feature = new APIFeatures(query, req.query)
    .filter()
    .sort()
    .paginate()
    .limitFields();

  const blogs = await feature.query;

  res.status(200).json({
    status: 'success',
    results: blogs.length,
    data: {
      blogs,
    },
  });
});

exports.getBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) return next(new AppError('No blog found with this id', 404));

  res.status(200).json({
    status: 'success',
    data: {
      blog,
    },
  });
});
exports.getMyBlogs = catchAsync(async (req, res, next) => {
  const author = req.user._id;

  const blogs = await Blog.find({ author });

  res.status(200).json({
    status: 'success',
    data: {
      blogs,
    },
  });
});

exports.updateBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!blog) return next(new AppError('No blog found with this id', 404));

  res.status(200).json({
    status: 'success',
    data: {
      blog,
    },
  });
});

exports.deleteBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);

  if (!blog) return next(new AppError('No blog found with this id', 404));

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

exports.deleteAllBlogs = catchAsync(async (req, res, next) => {
  await Blog.deleteMany();

  res.status(200).json({
    status: 'success',
    data: null,
  });
});
