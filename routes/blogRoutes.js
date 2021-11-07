const express = require('express');
const blogController = require('../controllers/blogController');
const authController = require('../controllers/authController');
const likeRouter = require('./likeRoutes');
const commentRouter = require('./commentRoutes');

const router = express.Router();

router
  .route('/')
  .post(authController.protect, blogController.createBlog)
  .get(blogController.getAllBlogs)
  .delete(blogController.deleteAllBlogs);

router
  .route('/:id')
  .get(authController.protect, blogController.getBlog)
  .patch(authController.protect, blogController.updateBlog)
  .delete(authController.protect, blogController.deleteBlog);

router.use('/:id/likes', likeRouter);
router.use('/:id/comments', commentRouter);

module.exports = router;
