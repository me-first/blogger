const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const blogController = require('../controllers/blogController');

const router = express.Router();
router.route('/').get(userController.getAllUser);
router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post(
  '/updatePassword',
  authController.protect,
  authController.updatePassword
);

router.patch('/updateMe', authController.protect, userController.updateMe);
router.get('/getMe', authController.protect, userController.getMe);
router.get('/myBlogs', authController.protect, blogController.getMyBlogs);

module.exports = router;
