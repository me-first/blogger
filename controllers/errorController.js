const AppError = require('../utils/AppError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldDB = (err) => {
  const message = `Duplicate field Please use another value`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const message = Object.values(err.errors)
    .map((el) => el.message)
    .join('. ');
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please login again!', 401);
const handleJWTExpired = () =>
  new AppError('Your token has expired,Please login again', 401);

const sendDevError = (err, req, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};
const sendProdError = (err, req, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendDevError(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err }; //making hard copy of error object coming from mongoDB
    error.name = err.name;
    error.code = err.code;
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error); //get tour with invalid ID
    if (error.code === 11000) error = handleDuplicateFieldDB(error); //create Tour with same name
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error); //TourSchema
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpired();

    sendProdError(error, req, res);
  }
};
