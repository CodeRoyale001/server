const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

// Define custom formats
const { combine, timestamp, printf, colorize } = format;

// Custom format for logs
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Create a logger
const Logger = createLogger({
  level: 'info',  // Set the minimum log level (e.g., 'info', 'debug', 'error')
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),  // Add timestamp
    logFormat  // Use custom log format
  ),
  transports: [
    // Console log with colorized output
    new transports.Console({
      format: combine(
        colorize(),  // Add color to console logs
        logFormat
      ),
    }),
    // Daily rotate file for all logs
    new DailyRotateFile({
      filename: 'logs/codeRoyaleJsBackend-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',  // Keep logs for 14 days
    }),
    // Daily rotate file for error logs
    new DailyRotateFile({
      filename: 'logs/codeRoyaleJsBackendError-%DATE%.log',
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',  // Keep logs for 14 days
    }),
  ],
});

// Export the logger
module.exports = Logger;