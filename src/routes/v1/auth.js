import express from 'express';
import { checkAuthentication } from '../../middleware/apiAuth';

import { apiValidate } from '../../middleware/apiValidate';
import AuthController from '../../controllers/auth.controller';
import AuthValidator from '../../validators/auth.validator';

const router = express.Router();

router.post(
  '/register',
  apiValidate(AuthValidator.register),
  AuthController.register
);

router.post(
  '/login',
  apiValidate(AuthValidator.login),
  AuthController.login
);

router.post(
  '/social-signup',
  apiValidate(AuthValidator.socialSignup),
  AuthController.socialSignup
);

router.post(
  '/forgot-password',
  apiValidate(AuthValidator.forgotPassword),
  AuthController.forgotPassword
);

router.post(
  '/reset-password',
  apiValidate(AuthValidator.resetPassword),
  AuthController.resetPassword
);

router.post(
  '/logout',
  checkAuthentication,
  AuthController.logout
);

router.post(
  '/email/test-mail',
  AuthController.testEmail
);

export default router;
