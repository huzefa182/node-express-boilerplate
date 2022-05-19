import HttpStatus from 'http-status';
import { errorResponse } from '../helpers/message';
import UserModel from '../models/User';
import LoginTokenModel from '../models/LoginToken';
import jwtHelper from '../helpers/jwt';

const checkAuthentication = async (req, res, next) => {
  if (!(req.headers && req.headers.authorization)) {
    return errorResponse(req, res, 'Token is not provided', HttpStatus.UNAUTHORIZED);
  }

  const parts = req.headers.authorization.split(' ');
  if (parts.length === 2) {
    if (!(/^Bearer$/i.test(parts[0]))) {
      return errorResponse(req, res, 'Token is not properly formatted', HttpStatus.UNAUTHORIZED);
    }
  }

  const token = parts[1];
  
  try {
    const decodedData = await jwtHelper.verifyToken(token);
    const tokenData = await LoginTokenModel.findOne({ accessToken: token }).populate({path: 'user', select: 'firstName lastName email userType isActive status createdAt updatedAt'}).exec();
    if (!tokenData) {
      return errorResponse(req, res, 'Invalid Access Token.', HttpStatus.UNAUTHORIZED);
    }
    req.user = tokenData.user;
    req.user.accessToken = tokenData.accessToken;
    return next();
  } catch (error) {
    return errorResponse(
      req,
      res,
      'Incorrect token is provided, try re-login',
      HttpStatus.UNAUTHORIZED,
    );
  }
};

/**
 * function to check whether user is active or not
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const checkAuthorization =  async (req, res, next) => {
  try {
    const userData = req.user;
    
    if (userData.status !== 'active') {
      return errorResponse(req, res, 'Your account is deactivated. Please contact Administrator.', HttpStatus.FORBIDDEN);
    }

    return next();
  }
  catch(error) {
    return next(error);
  }
}

export {
  checkAuthentication,
  checkAuthorization
};
