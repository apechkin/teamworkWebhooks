const path = require('path');
const winston = require('winston');
const fileDir = path.join(__dirname, '../../logs');
require('winston-daily-rotate-file');

const transportDb = new (winston.transports.DailyRotateFile)({
  filename: path.join(fileDir, 'db_errors.log'),
  datePattern: '/yyyy/MM/dd/',
  createTree: true,
  prepend: true,
  level: 'error',
  localTime: true
});

const transportMq = new (winston.transports.DailyRotateFile)({
  filename: path.join(fileDir, 'mq_errors.log'),
  datePattern: '/yyyy/MM/dd/',
  createTree: true,
  prepend: true,
  level: 'error',
  localTime: true
});

const transportMailer = new (winston.transports.DailyRotateFile)({
  filename: path.join(fileDir, 'mailer_errors.log'),
  datePattern: "/yyyy/MM/dd/",
  createTree: true,
  prepend: true,
  level: 'error',
  localTime: true
});

const loggerDb = new (winston.Logger)({
    transports: [
      transportDb
    ]
  });

const loggerMq = new (winston.Logger)({
    transports: [
      transportMq
    ]
  });

const loogerMailer = new (winston.Logger)({
    transports: [
      transportMailer
    ]
  });

exports.dbErrors = loggerDb;
exports.mqErrors = loggerMq;
exports.mailerErrors = loogerMailer
