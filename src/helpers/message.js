import httpStatus from 'http-status';

export const successResponse = (req, res, data, message, code = httpStatus.OK) => res.status(code).json({
    success: true,
    data,
    message
});
  
export const errorResponse = (
    req,
    res,
    errorMessage = 'Something went wrong',
    code = httpStatus.OK,
    error,
) => res.status(code).json({
    success: false,
    data: {},
    error,
    message: errorMessage,
});
  