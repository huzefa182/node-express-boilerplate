'use strict';

import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';
import config from '../config';

export default {

    /**
     * function to construct mail body and call the mail service as per the selected mail driver 
     * @param {*} options 
     */
    async sendEmail(options) {
        const mailOptions = {
            from: config.mail.fromEmail,
            to: options.to,
            subject: options.subject,
            html: options.message,
            attachments: options.attachments || [],
            cc: options.cc || '',
            bcc: options.bcc || ''
        };
        const mailDriver = config.mail.driver;
        switch(mailDriver) {
            case 'smtp': 
                const smtpMailResponse = await this.sendEmailBySMTP(mailOptions); 
                return smtpMailResponse;
            case 'sendgrid': 
                const sendgridMailResponse = await this.sendEmailBySENDGRID(mailOptions); 
                return sendgridMailResponse;
            default: 
                const defaultMailResponse = await this.sendEmailBySENDGRID(mailOptions); 
                return defaultMailResponse;
        }
    },

    /**
     * function to send emails via smtp
     * @param options 
     * @returns promise
     */
    sendEmailBySMTP(options) {
        const smtpConfig = {
            host: config.mail.smtp.host,
            port: config.mail.smtp.port,
            secure: config.mail.smtp.isSecure,
            auth: {
                user: config.mail.smtp.user,
                pass: config.mail.smtp.password
            },
            tls: {
                rejectUnauthorized: false
            }
        };

        const transport = nodemailer.createTransport(smtpConfig);
        
        return new Promise((resolve, reject) => {
            transport.sendMail(options,(error,info)=>{
                if(error) {
                    reject(error); 
                }
                resolve(info);
            });
        });
    },

    /**
     * function to send emails via sendgrid
     * @param {*} options 
     * @returns 
     */
    sendEmailBySENDGRID(options) {
        
        sgMail.setApiKey(config.mail.sendgrid.apiKey);

        return new Promise((resolve, reject) => {
            sgMail.send(options, function (err, info) {
                if(err) {
                    reject(err); 
                }
                resolve(info);
            });
        });
    }
}