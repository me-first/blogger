const express = require('express');
const authController = require('../controllers/authController');
const commentController = require('../controllers/commentController');
const router = express.Router({ mergeParams: true });

router.delete('/:commentId', commentController.deleteComment);
router
  .route('/')
  .get(authController.protect, commentController.getComments)
  .post(authController.protect, commentController.createComment);

router.route('/getAllComments').get(commentController.getAllComments);

module.exports = router;
