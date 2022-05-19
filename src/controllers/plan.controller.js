import httpStatus from 'http-status';
import moment from 'moment';
import UserModel from '../models/User';
import PlanModel from '../models/Plan';
import PaymentModel from '../models/Payment';
import { successResponse, errorResponse } from '../helpers/message';
import stripeHelper from '../helpers/stripe';
import config from '../config';
import emailHelper from '../helpers/email';
import Utils from '../utils';
import * as logger from '../utils/logger';

let PlanController = {

    /**
     * function to create plan
     */
    async createPlan(req, res, next) {
        try {
            const planData = req.body;
            const plan = await PlanModel.create(planData);
            return successResponse(req, res, plan, 'Plan created successfully.');
        }
        catch(error) {
            return next(error);
        }
    },

    /**
     * function to fetch all plans
     */
    async getPlans(req, res, next) {
        try {
            const plans = await PlanModel.find({ status: 'active' }).sort({ sortOrder: 1 });
            if(plans.length) {
                return successResponse(req, res, { rows: plans, total: plans.length }, 'Plan(s) list.');
            }
            return successResponse(req, res, { }, 'No record(s) Found.');
        }
        catch(error) {
            return next(error);
        }
    },

    /**
     * function to fetch plan
     */
     async getPlan(req, res, next) {
        try {
            const planId = req.params.planId;
            const plan = await PlanModel.find({ _id: planId, status: 'active' });
            if(plan) {
                return successResponse(req, res, plan, 'Plan details.');
            }
            return successResponse(req, res, { }, 'No record(s) found.');
        }
        catch(error) {
            return next(error);
        }
    },

    /**
     * function to purchase plan
     */
     async purchasePlan(req, res, next) {
        try {
            let payment = {};
            const studentData = req.user;
            const paymentMethodId = req.body.token;
            const planType = req.body.planType;
            const planId = req.body.planId;
            const plan = await PlanModel.findOne({ _id: planId, type: planType, status: 'active' });
            const userData = await UserModel.findOne({ _id: studentData.id });
            const paymentMethod = paymentMethodId ? await stripeHelper.retrievePaymentMethod(paymentMethodId) : '';

            if(plan) {

                if(userData && userData.plan) {
                    return errorResponse(req, res, 'You have already purchased a plan.');
                }
                
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
                        amount: plan.price,
                        paymentMethod: paymentMethod.id,
                        user: {
                            firstName: studentData.firstName,
                            lastName: studentData.lastName,
                            stripeCustomerId
                        },
                        description: `${studentData.firstName} ${studentData.lastName} has purchased ${plan.name} plan.`, 
                        metadata: {
                            'Plan ID': `${plan._id}`,
                            'Plan Name': `${plan.name}`,
                            'Plan Type': `${plan.type}`,
                            'Plan Price': `${plan.price}`
                        }
                    };
        
                    // Create payment in Stripe using Payment Intent API
                    const paymentIntent = await stripeHelper.createPaymentIntent(paymentIntentPayload);
                    
                    // Insert payment details in Payment collection
                    payment = await PaymentModel.create({
                        user: studentData.id,
                        plan: plan.id,
                        amount: plan.price,
                        paymentId: paymentIntent.id,
                        mode: 'online',
                        method: 'card',
                        source: paymentMethod ? paymentMethod : {},
                        purchaseType: 'plan',
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
                        // Update plan id against the user in user collection
                        await UserModel.updateOne({ _id: studentData.id }, { $set: { plan: plan.id }});   
                        
                        const mailData = {
                            to: studentData.email,
                            name: `${studentData.firstName}`,
                            paymentId: payment.paymentId,
                            planType: plan.type,
                            planName: plan.name,
                            amount: plan.price,
                            purchaseDate: moment(payment.createdAt).format('MM/DD/YYYY')
                        }

                        //generate message for payment email
                        const message = await Utils.ejs.convertHtmlToString(mailData, 'emails', 'purchasePlan.ejs');

                        // Send email to student once plan is added to his/her account
                        emailHelper.payment(studentData.email, message).then(result => {
                        
                        }).catch(error => {
                            logger.errorLogger(`Paid plan purchase email error - ${error}`);
                        });

                        return successResponse(req, res, payment, 'Your payment is successfully processed and plan is added to your account.');
                    }
                    
                    return errorResponse(req, res, 'Your card was denied, please provide a new payment method.', httpStatus.INTERNAL_SERVER_ERROR);
                }
                
                if(plan.type === 'free') {
                    // Update plan id against the user in user collection
                    await UserModel.updateOne({ _id: studentData.id }, { $set: { plan: plan.id }}); 
                    
                    const mailData = {
                        to: studentData.email,
                        name: `${studentData.firstName}`,
                        planType: plan.type,
                    }

                    // Generate message for payment email
                    const message = await Utils.ejs.convertHtmlToString(mailData, 'emails', 'purchasePlan.ejs');

                    // Send email to student once plan is added to his/her account
                    emailHelper.payment(studentData.email, message).then(result => {
                    
                    }).catch(error => {
                        logger.errorLogger(`Free plan purchase email error - ${error}`);
                    });

                    return successResponse(req, res, payment, 'Plan successfully added to your account.');
                }     
            }

            return errorResponse(req, res, 'Plan not found.');
        }
        catch(error) {
            return next(error);
        }
    },

    async removePlan(req, res, next) {
        try {
            const email = req.query.email;
            await UserModel.updateOne({ email },{ $set: { plan: null }});
            const updatedUser = await UserModel.findOne({ email });
            return successResponse(req, res, updatedUser, 'Plan removed successfully.');
        }
        catch(error) {
            return next(error);
        }
    },

    async sendPaymentEmail(data, planType = 'paid') {
        const mailData = {
            to: data.email,
            name: `${data.firstName} ${data.lastName}`,
            paymentId: data.paymentId,
            plan: data.plan.name,
            amount: data.amount,
            purchaseDate: data.purchaseDate
        }
    
        //generate message for payment email
        const message = await Utils.ejs.convertHtmlToString(mailData, 'emails', 'payment.ejs');

        emailHelper.payment(reqData.email, message).then(result => {
        
        }).catch(error => {
            logger.errorLogger(`Welcome Email Error - ${error}`);
        });
    },
}

export default PlanController;
