const logger = require("../config/logger");

const requestLogger = (req, res, next) => {
  // Log request start
  const start = Date.now();

  // Log request details
  logger.info("Incoming Request", {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    body: req.body,
    query: req.query,
    params: req.params,
  });

  // Log response
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info("Request Completed", {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
    });
  });

  // Log errors
  res.on("error", (error) => {
    logger.error("Request Error", {
      method: req.method,
      url: req.originalUrl,
      error: error.message,
      stack: error.stack,
    });
  });

  next();
};

module.exports = requestLogger;
