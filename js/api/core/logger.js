const winston = require('winston');
const path = require('path');

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: 'app.log' })
  ]
});

module.exports = {
  log: msg => logger.log(msg),
  info: msg => logger.info(msg),
  warn: msg => logger.warn(msg),
  error: msg => logger.error(msg)
};
