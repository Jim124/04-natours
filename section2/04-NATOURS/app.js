import express from 'express';
import dotNev from 'dotenv';
import morgan from 'morgan';
import tourRouter from './routes/tourRoutes1.js';
import userRouter from './routes/userRouters.js';
import dirName from './dirName.js';
import AppError from './utils/appError.js';
import globalErrorHandler from './controllers/errorController.js';

const app = express();
// 1)Middlewares
dotNev.config({ path: './config.env' });
// console.log(process.env);
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
//to get req.body  is a json data
app.use(express.json());
// to get static file
app.use(express.static(`${dirName}/public`));
// defined middleware
app.use((req, res, next) => {
  console.log('hello from the middleware');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
// 3 ROUTERS
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// this method will match all useless handler
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server.`
  // });

  // const err = new Error(`Can't find ${req.originalUrl} on this server.`);
  // err.status = 'fail';
  // err.statusCode = 400;
  // next(err);
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

// this middleware will match all errors
app.use(globalErrorHandler);

export default app;
