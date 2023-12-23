const winston = require("../lib/winston");
const morgan = require("../lib/morgan");
const httpLogger = winston.loggers.get("httplogger"); /* For Incomming Request Logs */

const srvcLogger = winston.loggers.get("srvclogger"); /* For Business Logic Logs */
const setupLogging = (app) => {
    app.use(morgan.morganMiddleware(httpLogger));
}

/*
 * In Development Write Logs To Terminal
 */
if (process.env.NODE_ENV != 'production') {
    httpLogger.add(new winston.transports.Console()); 
    // srvcLogger.add(new winston.transports.Console()); 
}

module.exports = {
    setupLogging,
    srvcLogger
};
