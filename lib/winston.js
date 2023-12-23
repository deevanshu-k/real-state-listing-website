const winston = require('winston');
const { combine, timestamp, json, errors } = winston.format;

winston.loggers.add('srvclogger', {
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
        errors({ stack: true }),
        timestamp(),
        json()
    ),
    transports: [
        new winston.transports.File({
            filename: 'log/combined.log',
        }),
        new winston.transports.File({
            filename: 'log/error.log',
            level: 'error',
        }),
    ],
});
winston.loggers.add('httplogger', {
    level: 'http',
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A',
        }),
        json()
    ),
    transports: [
        new winston.transports.File({
            filename: 'log/combined.log',
        }),
        new winston.transports.File({
            filename: 'log/request.log',
            level: 'http',
        }),
    ],
});

module.exports = winston;