'use strict';

import emailer from './base-emailer';
import config from '../config';

export default {
    /**
     * Send email on registration completion
     * @param {Object} data 
     */
    async welcome(to, message, attachments = []) {
        const options = {
          to,
          subject: `${config.app.name} - Welcome`,
          message,
          attachments,
          cc: config.mail.cc || '',
          bcc: config.mail.bcc || ''
        };
        
        return emailer.sendEmail(options).then(object=> {
            return Promise.resolve(object);
        }).catch(error => {
            return Promise.reject(error);
        });
    },

    /**
     * Send email on forgot password
     * @param {Object} data 
     */
     async forgotPassword(to, message, attachments = []) {
        const options = {
          to,
          subject: `${config.app.name} - Reset Password`,
          message,
          attachments
        };
        
        return emailer.sendEmail(options).then(object=> {
            return Promise.resolve(object);
        }).catch(error => {
            return Promise.reject(error);
        });
    },

    /**
     * Send email on payment success
     * @param {Object} data 
     */
     async payment(to, message, subject = "Plan Purchased", attachments = []) {
        const options = {
          to,
          subject: `${config.app.name} - ${subject}`,
          message,
          attachments
        };
        
        return emailer.sendEmail(options).then(object=> {
            return Promise.resolve(object);
        }).catch(error => {
            return Promise.reject(error);
        });
    },

    async testEmail(to, message, attachments = []) {
        const options = {
            to,
            subject: `${config.app.name} - Test Email`,
            message,
            attachments,
            cc: config.mail.cc,
            bcc: config.mail.bcc
        };
        
        return emailer.sendEmail(options).then(object=> {
            return Promise.resolve(object);
        }).catch(error => {
            return Promise.reject(error);
        });
    }
};