const logger = require('../Config/logger');

// Global error handling middleware
module.exports = (err, req, res, next) => {
  // Log the error with full details
  logger.error('❌ Server Error:', {
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    user: req.user?._id || 'unauthenticated',
  });

  // Determine status code
  const statusCode = err.statusCode || 500;

  // Send error response to client
  res.status(statusCode).json({
    msg: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
