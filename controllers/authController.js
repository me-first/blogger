const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const assignTokenAndSend = (user, statusCode, req, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, //now we can't manipulate cookie in header
    // secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  };

  // if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  //remove the password from the output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  const newUser = await User.create({ name, email, password, passwordConfirm });

  assignTokenAndSend(newUser, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // check if email or password exist
  if (!email || !password)
    return next(new AppError('Provide email or password', 404));

  //user exist and entered password is correct
  const user = await User.findOne({ email: email }).select('+password');
  if (!user || !(await user.checkPassword(password, user.password)))
    return next(new AppError('Either email or password is incorrect', 400));

  // now send token
  assignTokenAndSend(user, 200, req, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // console.log(req.headers.authorization);

  if (!token) return next(new AppError('Please login to get access', 401));

  // verify token
  const payload = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );

  // check if user exists
  const user = await User.findById(payload.id);
  if (!user) return next(new AppError('User might deleted its account', 404));

  // check jwt assign time is greater than password update time
  if (user.changedPasswordAfter(payload.iat)) {
    return next(
      new AppError(
        'User recently changed its password. Please login again!',
        400
      )
    );
  }

  req.user = user;
  next();
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  const { passwordCurrent, password, passwordConfirm } = req.body;
  if (!(await user.checkPassword(passwordCurrent, user.password)))
    return next(
      new AppError('current password is not same as your old password', 400)
    );

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  assignTokenAndSend(user, 203, req, res);
});
