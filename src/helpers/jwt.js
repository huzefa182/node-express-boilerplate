import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import config from '../config';

const jwtConfig = config.jwt;

export default {

    createToken(payload, expiresIn = '365d') {
        return new Promise((resolve, reject) => {
            jwt.sign(payload, jwtConfig.jwtSecret, {
                expiresIn
            }, (err, token) => {
            if (err) {
                return reject(err)
            }
                return resolve(token)
            })
        })
    },

    async verifyToken(token) {
        const error = {};
        return new Promise((resolve, reject) => {
          jwt.verify(token, jwtConfig.jwtSecret, (err, info) => {
            if (err) {
              error.status = httpStatus.UNAUTHORIZED;
              error.message = err.message;
              return reject(error)
            }
            return resolve(info)
          });
        })
    },
}