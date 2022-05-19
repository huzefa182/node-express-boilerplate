import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import httpStatus from 'http-status';

import { connectDB } from '../src/models';
import routes from '../src/routes/v1';
import errorHandler from '../src/middleware/errorHandler';
import config from '../src/config';
import { errorResponse } from './helpers/message';
import * as logger from './utils/logger';

const swaggerDefinition = {
  info: {
    title: 'REST API for Hied Harmony Application',
    version: '1.0.0',
    description: 'This is the REST API for Hied Harmony Application',
  },
  host: `${config.app.swaggerHost}`,
  basePath: '/v1/api',
  securityDefinitions: {
    BearerAuth: {
      type: 'apiKey',
      description: 'JWT authorization for API(s)',
      name: 'Authorization',
      in: 'header',
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ['./api-docs/*.yaml'],
};

const swaggerSpec = swaggerJSDoc(options);

const app = express();

const whitelist = config.app.corsWhiteList;
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
    // if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

// enable cors
app.use(cors(corsOptions));

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

if (config.app.environment === 'development') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

app.use('/backend-assets', express.static(__dirname + '/uploads'));

// routes
app.use('/v1/api', routes);

// 404 Not Found handler
app.use((req, res, next) => {
  const error = new Error('Not Found');
  return errorResponse(req, res, error.message, httpStatus.NOT_FOUND, error);
});

// API Error handler
app.use(errorHandler);

// db connection
let server;
connectDB().then(data => {
  logger.consoleLogger("MongoDB connected successfully.");
  const port = config.app.port || 3000;
  server = app.listen(config.app.port, () => {
    logger.consoleLogger(`App running on port ${port}...`);
  });
}).catch(error => {
  logger.errorLogger(`MongoDB Connection Error - ${error}`);
  process.exit(1);
});

const unexpectedErrorHandler = (error) => {
  logger.errorLogger(`Exception - ${error}`);
  if (server) {
    server.close(() => {
      logger.consoleLogger('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.infoLogger(`SIGTERM - ${error}`);
});

export default app;
