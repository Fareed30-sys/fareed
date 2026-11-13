/**
 * Standardized API Response Utilities
 * Conforms to AgroAI API Response Standard
 */

export const successResponse = (res, message, data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    error: null,
  });
};

export const errorResponse = (
  res,
  message,
  errorCode = 'INTERNAL_ERROR',
  details = [],
  statusCode = 500
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    data: null,
    error: {
      code: errorCode,
      details: Array.isArray(details) ? details : [details],
    },
  });
};

