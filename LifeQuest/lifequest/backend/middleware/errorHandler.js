/**
 * Central error handler. Never leaks stack traces, DB errors, or secrets to the client.
 */
class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

function notFoundHandler(req, res) {
  res.status(404).json({ success: false, error: 'Resource not found.' });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode && err.isOperational ? err.statusCode : 500;

  if (!err.isOperational) {
    console.error('[Unhandled error]', err);
  }

  res.status(statusCode).json({
    success: false,
    error: err.isOperational ? err.message : 'Something went wrong. Please try again.',
  });
}

module.exports = { AppError, notFoundHandler, errorHandler };
