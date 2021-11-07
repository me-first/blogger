const express = require('express');
const authController = require('../controllers/authController');
const uploadController = require('../controllers/uploadController');
const router = express.Router();

router
  .route('/')
  .post(
    authController.protect,
    uploadController.uploadSingleFile,
    uploadController.upload
  );

module.exports = router;
