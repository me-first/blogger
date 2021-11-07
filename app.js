const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const AppError = require('./utils/AppError');
const globalErrorHandling = require('./controllers/errorController');
const blogRouter = require('./routes/blogRoutes');
const userRouter = require('./routes/userRoutes');
const likeRouter = require('./routes/likeRoutes');
const commentRouter = require('./routes/commentRoutes');
const uploadRouter = require('./routes/uploadRotes');

const app = express();

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(cors());

//BODY PARSER
app.use(express.json({ limit: '20kb' }));
//COOKIE PARSER
app.use(cookieParser());

//compress code
app.use(compression());

app.use('/api/v1/blogs', blogRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/likes', likeRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/upload', uploadRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`This route ${req.originalUrl} is not defined`, 404));
});

app.use(globalErrorHandling);

module.exports = app;
