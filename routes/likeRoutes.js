const express = require('express');
const authController = require('../controllers/authController');
const likeController = require('../controllers/likeController');
const router = express.Router({ mergeParams: true });

router.get('/getAllLikes', likeController.getAllLikes);
router
  .route('/')
  .get(authController.protect, likeController.getLike)
  .post(authController.protect, likeController.createLike);
router
  .route('/:likeId')
  .get(likeController.getLikeById)
  .delete(likeController.deleteLike);

module.exports = router;
