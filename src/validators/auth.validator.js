import Joi from 'joi';

const AuthValidator = {

  register: Joi.object({
    firstName: Joi.string().max(35).optional(),
    lastName: Joi.string().max(35).optional(),
    email: Joi.string().email().required(),
    // password: Joi.string().min(8).required(),
    password: Joi.string().min(8).pattern(
      new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{8,}$')
    ).required().messages({
      'string.pattern.base': 'must contains atleast 1 Uppercase letter, 1 Lowercase letter, 1 Number and 1 Special Character (#?!@$%^&*-_).'     
    }),
    confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
      'any:allowOnly': 'Confirm password must be same as password.',
    }),
    mobileNumber: Joi.string().required(),
    instituteId: Joi.number().optional(),
    instituteName: Joi.string().optional(),
    userName: Joi.string().optional(),
    userType: Joi.string().valid('college','student').required(),
    country: Joi.string().optional(),
    state: Joi.string().optional(),
    zipCode: Joi.string().optional(),
    countryCode: Joi.string().optional(),
  }),  

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    userType: Joi.string().valid('college','student').required(),
  }),  
  
  socialSignup: Joi.object({
    firstName: Joi.string().max(35).required(),
    lastName: Joi.string().max(35).required(),
    email: Joi.string().email().required(),
    socialType: Joi.string().valid('facebook','google','linkedin').required(),
    socialId: Joi.string().required(),
    socialToken: Joi.string().optional(),
    userType: Joi.string().valid('college','student').required(),
  }),  

  forgotPassword: Joi.object({
    email: Joi.string().email().required(),
  }),  
  
  resetPassword: Joi.object({
    token: Joi.string().required(),
    // password: Joi.string().min(8).required(),
    password: Joi.string().min(8).pattern(
      new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{8,}$')
    ).required().messages({
      'string.pattern.base': 'must contains atleast 1 Uppercase letter, 1 Lowercase letter, 1 Number and 1 Special Character (#?!@$%^&*-_).'
    })
  }),  
}

export default AuthValidator;
