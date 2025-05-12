const winston = require("winston");
const { createLogger, format, transports } = winston;
const { combine, timestamp, printf, colorize } = format;
require("winston-daily-rotate-file");
const path = require("path");

// Define log format
const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}] : ${message}`;
  if (Object.keys(metadata).length > 0) {
    msg += JSON.stringify(metadata);
  }
  return msg;
});

// Create logs directory if it doesn't exist
const fs = require("fs");
const logsDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Create the logger
const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
  transports: [
    // Console transport
    new transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat
      ),
    }),
    // Daily rotate file transport for all logs
    new transports.DailyRotateFile({
      filename: path.join(logsDir, "application-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "14d",
      format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
    }),
    // Separate file for error logs
    new transports.DailyRotateFile({
      filename: path.join(logsDir, "error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "14d",
      level: "error",
      format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
    }),
  ],
});

module.exports = logger;
