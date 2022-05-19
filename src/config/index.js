import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export default {
  app: {
    name: process.env.APP_NAME || 'HiEd Harmony',
    port: process.env.PORT,
    environment: process.env.NODE_ENV,
    timezone: process.env.TIMEZONE,
    swaggerHost: process.env.SWAGGER_HOST,
    corsWhiteList: process.env.CORS_WHITELIST,
    backendUrl: process.env.BACKEND_URL,
    frontendUrl : process.env.FRONTEND_URL
  },
  database: {
    mongo: {
      user: process.env.MONGODB_USER,
      password: process.env.MONGODB_PASSWORD,
      port: 27017,
      url: process.env.MONGODB_URL
    },
    mysql: {

    }
  },
  google: {
    
  },
  jwt: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiration: process.env.JWT_EXPIRATION_IN_MINUTES,
    jwtSessionSecret: process.env.SESSION_SECRET
  },
  cryptojs: {
    secret: process.env.CRYPTOJS_SECRET,
  },
  mail: {
    driver: process.env.EMAIL_DRIVER,
    fromName: process.env.EMAIL_FROM_NAME,
    fromEmail: process.env.EMAIL_FROM,
    cc: process.env.EMAIL_CC,
    bcc: process.env.EMAIL_BCC,
    smtp: {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      user: process.env.EMAIL_USER,
      password: process.env.EMAIL_PASSWORD,
      isSecure: process.env.EMAIL_IS_SECURE
    },
    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY
    }
  },
  payment: {
    stripe: {
      test: {
        publishKey: process.env.STRIPE_TEST_PUBLISH_KEY,
        secretKey: process.env.STRIPE_TEST_SECRET_KEY
      },
      live: {
        publishKey: process.env.STRIPE_LIVE_PUBLISH_KEY,
        secretKey: process.env.STRIPE_LIVE_SECRET_KEY
      }
    }
  }
};
