import httpStatus from 'http-status';
import moment from 'moment';
import UserModel from '../models/User';
import PaymentModel from '../models/Payment';
import { successResponse, errorResponse } from '../helpers/message';
import stripeHelper from '../helpers/stripe';
import config from '../config';
import emailHelper from '../helpers/email';
import Utils from '../utils';
import * as logger from '../utils/logger';

let ServiceController = {

    /**
     * function to purchase services
     */
    async purchaseService(req, res, next) {
        try {
            let payment = {};
            const studentData = req.user;
            const services = req.body.service;
            const servicesList = services.join(", ");
            const amount = req.body.amount;
            const paymentMethodId = req.body.token;
            const userData = await UserModel.findOne({ _id: studentData.id });
            const paymentMethod = paymentMethodId ? await stripeHelper.retrievePaymentMethod(paymentMethodId) : '';

            if(paymentMethod) {

                let stripeCustomerId = userData.stripeCustomerId;
                if(!userData.stripeCustomerId) {
                    // Create Stripe Customer ID for the logged in student if not exist
                    stripeCustomerId = await stripeHelper.createCustomer({
                        name: `${studentData.firstName} ${studentData.lastName}`,
                        email: studentData.email
                    });

                    userData.stripeCustomerId = stripeCustomerId;
                    await userData.save();
                }
                
                const paymentIntentPayload = {
                    amount,
                    paymentMethod: paymentMethod.id,
                    service: servicesList,
                    user: {
                        firstName: studentData.firstName,
                        lastName: studentData.lastName,
                        stripeCustomerId
                    },
                    description: `${studentData.firstName} ${studentData.lastName} has purchased the services.`, 
                    metadata: {
                        'Services': `${servicesList}`,
                    }
                };
    
                // Create payment in Stripe using Payment Intent API
                const paymentIntent = await stripeHelper.createPaymentIntent(paymentIntentPayload);
                
                // Insert payment details in Payment collection
                payment = await PaymentModel.create({
                    user: studentData.id,
                    firstName: studentData.firstName,
                    lastName: studentData.lastName,
                    email: studentData.email,
                    service: services,
                    amount,
                    paymentId: paymentIntent.id,
                    mode: 'online',
                    method: 'card',
                    source: paymentMethod ? paymentMethod : {},
                    purchaseType: 'service',
                    status: (paymentIntent.status === 'succeeded') ? 'succeeded' : 'failed',
                    description: (paymentIntent.status === 'succeeded') ? paymentIntent.description : 'Card requires authentication or was not properly authenticated.',
                    log: {
                        captureMethod: paymentIntent.capture_method,
                        clientSecret: paymentIntent.client_secret,
                        confirmationMethod: paymentIntent.confirmation_method,
                        status: paymentIntent.status,
                    }
                });  

                if(paymentIntent.status === 'succeeded') {
                    
                    const mailData = {
                        to: studentData.email,
                        name: `${studentData.firstName}`,
                        paymentId: payment.paymentId,
                        services: servicesList,
                        amount,
                        purchaseDate: moment(payment.createdAt).format('MM/DD/YYYY')
                    }

                    //generate message for payment email
                    const message = await Utils.ejs.convertHtmlToString(mailData, 'emails', 'purchaseService.ejs');

                    // Send email to student once services are purchased
                    emailHelper.payment(studentData.email, message, 'Services Purchased').then(result => {
                    
                    }).catch(error => {
                        logger.errorLogger(`Services purchase email error - ${error}`);
                    });

                    return successResponse(req, res, payment, 'Your payment is successfully processed for the selected services.');
                }
                
                return errorResponse(req, res, 'Your card was denied, please provide a new payment method.', httpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        catch(error) {
            return next(error);
        }
    },
}

export default ServiceController;
