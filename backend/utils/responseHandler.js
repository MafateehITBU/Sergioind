// Success response handler
export const successResponse = (res, statusCode = 200, message = 'Success', data = null) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

// Error response handler
export const errorResponse = (res, statusCode = 500, message = 'Error occurred', error = null) => {
  const response = {
    success: false,
    message
  };

  if (error && process.env.NODE_ENV === 'development') {
    response.error = error.message;
  }

  return res.status(statusCode).json(response);
};

// Validation error response handler
export const validationErrorResponse = (res, errors) => {
  return res.status(400).json({
    success: false,
    message: 'Validation failed',
    errors: errors.map(error => ({
      field: error.path,
      message: error.msg
    }))
  });
}; 