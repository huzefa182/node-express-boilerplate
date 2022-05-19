import CryptoJS from 'crypto-js';
import bcrypt from 'bcryptjs';
import moment from 'moment';
import UserModel from '../models/User';
import LoginTokenModel from '../models/LoginToken'
import { successResponse, errorResponse } from '../helpers/message';
import jwtHelper from '../helpers/jwt';
import httpStatus from 'http-status';
import config from '../config';
import emailHelper from '../helpers/email';
import Utils from '../utils';
import * as logger from '../utils/logger';

let AuthController = {

  /**
   * function to register student/college
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   * @returns 
   */
  async register(req, res, next) {
    try {
      
      const reqData = req.body;

      if(await UserModel.findOne({ email: reqData.email })) {
        return errorResponse(req, res, 'Email Address already exist.');  
      }
      
      if(reqData.userType === 'student'){
        if(await UserModel.findOne({ mobileNumber: reqData.mobileNumber})){
          return errorResponse(req, res, 'Mobile Number already in use.');  
        }
      }

      const userPayload = {
        firstName: reqData.firstName || '',
        lastName: reqData.lastName || '',
        email: reqData.email,
        mobileNumber: reqData.mobileNumber,
        countryCode: reqData.countryCode || 91,
        country: reqData.country || '',
        state: reqData.state || '',
        city: reqData.city || '',
        zipCode: reqData.zipCode,
        userType: (reqData.userType === 'student') ? 'student' : 'college',
        instituteId: reqData.instituteId || '',
        instituteName: reqData.instituteName || '',
        address: reqData.instituteAddress || '',
        isProfileCompleted: false,
        status: 'active'
      }

      userPayload.password = await bcrypt.hash(reqData.password, 10);
      const newUser = await UserModel.create(userPayload);
      const jwtPayload = {
        email: reqData.email,
        userType: reqData.userType,
      };
      const accessToken = await jwtHelper.createToken(jwtPayload);
      
      let loginToken = new LoginTokenModel({
        user: newUser._id,
        accessToken
      });
      await loginToken.save();

      const mailData = {
        to: newUser.email,
        name: (newUser.userType === 'student') ? `${newUser.firstName}` : newUser.email,
        userType: newUser.userType,
      }

      //generate message for welcome email
      const message = await Utils.ejs.convertHtmlToString(mailData, 'emails', 'welcome.ejs');

      emailHelper.welcome(reqData.email, message).then(result => {
        
      }).catch(error => {
        logger.errorLogger(`Welcome Email Error - ${error}`);
      });

      return successResponse(req, res, { _id : newUser._id, accessToken }, 'User created successfully.');
    } catch (error) {
      return next(error);
    }
  },

  /**
   * function to login
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   * @returns 
   */
  async login(req, res, next) {
    try {
      const reqData = req.body;
      const user = await UserModel.findOne({ 
        email: reqData.email, 
        userType: reqData.userType 
      }).populate({
        path: 'plan', select: 'name type price icon'
      }).exec();
      
      if (user) {
        const isPasswordMatch = await user.isPasswordMatch(reqData.password);
        if(!isPasswordMatch) {
          return errorResponse(req, res, 'Wrong password entered. Please try again.');
        }

        if (user.isActive === false) {
          return errorResponse(req, res, 'Your contact is deactivated. Please contact Administrator.', httpStatus.FORBIDDEN);
        }

        const jwtPayload = {
          email: reqData.email,
          userType: reqData.userType
        };
        const accessToken = await jwtHelper.createToken(jwtPayload);
        const userData = JSON.parse(JSON.stringify(user))
        userData.accessToken = accessToken;
  
        const loginToken = new LoginTokenModel({
          user: user._id,
          accessToken
        });
        await loginToken.save();
  
        delete userData.password;
        
        return successResponse(req, res, userData, 'User successfully logged in.');
      }
      
      return errorResponse(req, res, 'User does not exist.', httpStatus.BAD_REQUEST);
      
    } catch (error) {
      return next(error);
    }
  },

  /**
   * function to social signup
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   * @returns 
   */
   async socialSignup(req, res, next) {
    try {
      const reqData = req.body;
      const user = await UserModel.findOne({ email: reqData.email });
      
      /* Generating Token */
      const accessToken = await jwtHelper.createToken({ email: reqData.email, userType: 'student' });
      let userData;
      
      if (user) { 
          const userId = user._id;

          let updateData = {
            socialType : reqData.socialType,
            socialId : reqData.socialId,
            socialToken : reqData.socialToken || ""
          }

          await UserModel.updateOne({ _id : userId },{$set : updateData});

          userData = JSON.parse(JSON.stringify(user));
          userData.accessToken = accessToken
      }
      else {
        /* new user */
        const newUser = await UserModel.create({
          firstName : reqData.firstName,
          lastName : reqData.lastName,
          email : reqData.email,
          userType : reqData.userType,
          socialType : reqData.socialType,
          socialId : reqData.socialId,
          socialToken : reqData.socialToken || "",
          country : "",
          state : "",
          isProfileCompleted: false,
          status: 'active'
        });
        
        const loginToken = new LoginTokenModel({
          user : newUser.id,
          accessToken
        });

        await loginToken.save();
        userData = JSON.parse(JSON.stringify(newUser));
        userData.accessToken = accessToken
      }
  
      delete userData.password;
      
      return successResponse(req, res, userData, 'User successfully logged in.');

    } catch (error) {
      return next(error);
    }
  },

  /**
   * forgot password
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   * @returns 
   */
  async forgotPassword(req, res, next) {
    try {
      const email = req.body.email;
      const reqUserType = req.body.userType;

      const user = await UserModel.findOne({ email: email });
      
      if(!user) {
        return errorResponse(req, res, 'User does not exist.');
      }

      // if(reqUserType != user.userType) {
      //   return errorResponse(req, res, 'Email Address does not exist.');
      // }

      const resetPasswordToken = CryptoJS.AES.encrypt(user.email, config.cryptojs.secret).toString();

      const resetPasswordLink = `${config.app.frontendUrl}/reset-password?token=${resetPasswordToken}`;
      
      await UserModel.updateOne(
        { email : email},
        { $set: { resetPasswordToken : resetPasswordToken, resetPasswordLinkGenerated: true, resetPasswordLinkGeneratedTime: new Date().getTime() } }
      );
      
      const mailData = {
        to: user.email,
        name: `${user.firstName}`,
        resetPasswordLink : resetPasswordLink
      }

      const message = await Utils.ejs.convertHtmlToString(mailData, 'emails', 'resetPassword.ejs');

      emailHelper.forgotPassword(user.email, message).then(result => {
        
      }).catch(error => {
        logger.errorLogger(`Forgot Password Email Error - ${error}`);
      });

      return successResponse(req, res, {userType : user.userType}, 'Reset password link has been send on your Email Address.');

    } catch (error) {
      return next(error);
    }
  },

  /**
   * reset password
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   * @returns 
   */
  async resetPassword(req, res, next) {
    try {
      const reqData = req.body;
      const user = await UserModel.findOne({ resetPasswordToken: reqData.token });
      const checkResetLinkExpiryTime = moment().subtract(1, 'days').toDate().getTime();
      
      if (checkResetLinkExpiryTime < user.resetPasswordLinkGeneratedTime && user.resetPasswordLinkGenerated) {
          
        const newPassword = await bcrypt.hash(reqData.password, 10);
        await UserModel.updateOne(
          { email: user.email },
          { $set: { password: newPassword, resetPasswordLinkGenerated: false, resetPasswordLinkGeneratedTime: 0 } }
        );
        
        return successResponse(req, res, { userType: user.userType }, 'Password successfully reseted.');
      }
      else {
        return errorResponse(req, res, 'Reset password link has expired. Please regenerate another link inorder to reset the password.');
      }
    } catch (error) {
      return next(error);
    }
  },

  /**
   * logout
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   * @returns 
   */
  async logout(req, res, next) {
    try {
      await LoginTokenModel.deleteMany({ user: req.body.userId, accessToken: req.user.accessToken });
      return successResponse(req, res, {}, 'User successfully logs out.');
    } catch (error) {
      return next(error);
    }
  },

  async testEmail(req, res, next) {
    try{
      const mailData = {
        name: req.body.name,
        email: req.body.email,
      }
      
      const testTemplate = await Utils.ejs.convertHtmlToString(mailData, 'emails', 'testTemplate.ejs');
  
      emailHelper.testEmail(req.body.email, testTemplate).then(result => {
        logger.infoLogger(`Test Email sent - ${result}`);
      }).catch(error => {
        logger.errorLogger(`Test Email Error - ${error}`);
      });

      return successResponse(req, res, null, 'Test mail successfully sent.');
    }
    catch(error) {
      return next(error);
    }
  }
}

export default AuthController;
