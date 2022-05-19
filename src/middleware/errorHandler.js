import httpStatus from 'http-status';
import mongoose from 'mongoose';

import { errorResponse } from '../helpers/message';
import * as logger from '../utils/logger';

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, next) => {

  const statusCode = error.statusCode || error instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
  const message = error.message || httpStatus[statusCode];

  if(error.stack) {
    error = error.stack;
  }
  
  logger.errorLogger(error);
  return errorResponse(req, res, message, statusCode, error);
};

export default errorHandler;
