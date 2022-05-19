# Hied Harmony Backend

## Manual Installation

Install the dependencies:

```bash
npm install
```

Set the environment variables:

```bash
cp .env.example .env

# open .env and modify the environment variables (if needed)
```

## Environment Variables

The environment variables can be found and modified in the .env file. They come with these default values:

```bash
# Mongo DB User
MONGODB_USER = root                     
# Mongo DB Password
MONGODB_PASSWORD = root                 
# Mongo DB URL without user and password
MONGODB_URL = mongodb://localhost:27017/hied-harmony        

PORT = 3060                             # application port
NODE_ENV = development                  # application environment
APP_NAME = HiEd Harmony                 # application name    
BACKEND_URL = http://localhost:3060     # application host name
FRONTEND_URL = http://localhost:5000	# frotend application url			
SWAGGER_HOST = localhost:3060           # swagger host
TIMEZONE = +00:00                       # timezone value set to utc 

JWT_SECRET = secret                     # secret key for encrypt/decrypt JWT token
JWT_EXPIRATION_IN_MINUTES = 4320        # expiration time for JWT token    

CRYPTOJS_SECRET = TESTING123Secret_Key  # for CryptoJS Hashing

EMAIL_FROM_NAME =                       # from name
EMAIL_FROM = hiedharmonydev@gmail.com   # from email
EMAIL_HOST =                            # smtp host
EMAIL_PORT = 587                        # smtp port - 587, 25 for non-ssl and 465 for ssl connection
EMAIL_USER =                            # smtp user
EMAIL_PASSWORD =                        # smtp password            
EMAIL_IS_SECURE = false                 # true if using 465 or false if using 587, 25 in port    

EMAIL_CC = lmsuser1@yopmail.com         # cc - pass comma separated emails for multiple users
EMAIL_BCC = lmsuser2@yopmail.com        # bcc - pass comma separated emails for multiple users

EMAIL_DRIVER = sendgrid                 # available options [smtp, sendgrid]

# API key for using sendgrid or other third party email service 
SENDGRID_API_KEY =                         

# Whitelist domain array for the cors package
CORS_WHITELIST = ['http://localhost:5000','http://103.21.53.11:5000']

# Development
STRIPE_TEST_PUBLISH_KEY = 
STRIPE_TEST_SECRET_KEY = 

# Production
STRIPE_LIVE_PUBLISH_KEY = 
STRIPE_LIVE_SECRET_KEY = 
```

## Seeders

Create the below collections in the MongoDB database. Import the json files located under `src/seeders` to the respective collections.

```
- countries
- states
- cities
- majors
- features
- plans
```

## Commands

Running locally:

```bash
npm run dev
```

Running in production:

```bash

# install pm2 globally inorder to execute npm start command without any errors
npm install pm2 -g

# start the application server
cd /<path to directory>
npm run build
npm start

# restart the application server incase of any changes/new packages
cd /<path to directory>
npm run build
pm2 restart hied-harmony-api
```

## Project Structure

```
src\
 |--config\         # Environment variables and configuration related things
 |--controllers\    # Route controllers (controller layer)
 |--middlewares\    # Custom express middlewares
 |--models\         # Mongoose models (data layer)
 |--views\          # Html ejs templates for emails
 |--routes\         # Routes
 |--utils\          # Utility classes and functions
 |--validators\     # Request data validation schemas
 |--logs\           # Log files
 |--app.js          # Express app
 |--index.js        # App entry point
```

## Validators

Request data is validated using [Joi](https://joi.dev/). Check the [documentation](https://joi.dev/api/) for more details on how to write Joi validation schemas.

The validation schemas are defined in the `src/validators` directory and are used in the routes by providing them as parameters to the `validate` middleware.

```javascript
import express from 'express';
import validate from 'express-validation';

import authController from '../../controllers/auth.controller';
import * as authValidator from '../../validators/auth.validator';

const router = express.Router();

router.post('/auth/register', validate(authValidator.resgiterSchema), authController.register);
```

## Authentication

To require authentication for certain routes, you can use the `apiAuth` middleware.

```javascript
import express from 'express';
import validate from 'express-validation';
import { checkAuthentication } from '../../middleware/apiAuth';
import studentController from '../../controllers/student.controller';

const router = express.Router();

router.post('/student/profile', checkAuthentication, studentController.getStudentDetails);
```

These routes require a valid JWT access token in the Authorization request header using the Bearer schema. If the request does not contain a valid access token, an Unauthorized (401) error is thrown.

## Authorization

The `apiAuth` middleware can also be used to require certain rights/permissions to access a route.

```javascript
import express from 'express';
import validate from 'express-validation';
import { checkAuthorization } from '../../middleware/apiAuth';
import studentController from '../../controllers/student.controller';

const router = express.Router();

router.post('/student/profile', checkAuthorization, studentController.getStudentDetails);
```

If the user making the request does not have the required permissions to access this route, a Forbidden (403) error is thrown.

## Logging

Import the logger from `src/utils/logger.js`. It is using the [Winston](https://github.com/winstonjs/winston) logging library.

```javascript
import * as logger from '<path to src>/utils/logger';

logger.errorLogger('An error occured !!!');
logger.infoLogger('DB connected successfully.');
logger.consoleLogger('Testing...');
```

In development mode, log messages from `consoleLogger` will be printed to console and log messages from `errorLogger` and `infoLogger` will be stored in the error.log and info.log file respectively, which is located under `src/logs`.

In production mode, only `errorLogger` messages, will be stored in the file.

This app uses pm2 in production mode, which is already configured to store the logs in log files.

### API Documentation URL
> https://localhost:{YOUR_PORT}/api-docs

### API BASE URL
> https://localhost:{YOUR_PORT}/v1/api

### Success Response
```
{
    "success": true,
    "data": {} or null,
    "message": "Data inserted successfully."
}
```
### Error Response
```
{
    "success": false,
    "error": {},
    "data": {} or null,
    "message": "Something went wrong"
}
```