import { createLogger, format, transports } from 'winston';
import path from 'path';
import config from '../config';

const { combine, timestamp, label, printf } = format;

const messageFormat = printf(({ level, message, timestamp }) => {
    return `${level} - ${timestamp} : ${message}`;
});

const consoleMessageFormat = printf(({ message }) => {
    return `${message}`;
});

const customInfoLogger = createLogger({
    level: 'info',
    transports: [
        new transports.File({ 
            format: format.combine(
                timestamp({
                    format: 'MMM-DD-YYYY HH:mm:ss'
                }),
                messageFormat
            ),
            filename: path.join(__dirname,'../logs/info.log'),
        }),
    ]   
});

const customErrorLogger = createLogger({
    transports: new transports.File({ 
        // level: 'error', 
        format: format.combine(
            timestamp({
                format: 'MMM-DD-YYYY HH:mm:ss'
            }),
            messageFormat
        ),
        filename: path.join(__dirname,'../logs/error.log'),
        handleExceptions: true
    }),
});

const customConsoleLogger = createLogger({
    transports: new transports.Console({
        format: format.combine(
            consoleMessageFormat,
            format.colorize()
        ),
    }),
});

const errorLogger = (message) => {
    customErrorLogger.error(message);
}

const infoLogger = (message) => {
    if(config.app.environment !== 'production') {
        customInfoLogger.info(message);
    }
}

const consoleLogger = (message) => {
    if(config.app.environment !== 'production') {
        customConsoleLogger.info(message);
    }
}

export {
    errorLogger,
    infoLogger,
    consoleLogger
}
