import Stripe from 'stripe';
import httpStatus from 'http-status';
import config from '../config';

const stripeConfig = (config.app.environment === 'development') ? config.payment.stripe.test : config.payment.stripe.live; 
const stripe = new Stripe(stripeConfig.secretKey);

export default {

    /**
     * function to create stripe customer
     */
    async createCustomer(data) {
        try{
            const customer = await stripe.customers.create(data);
            return customer.id;
        }
        catch(error) {
            throw new Error(error.message);
        }
    },

    /**
     * function to retrieve stripe payment method details by id
     */
    async retrievePaymentMethod(paymentMethodId) {
        try {
            const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
            return paymentMethod;
        }
        catch(error) {
            throw new Error(error.message);
        }
    },

    /**
     * function to create payment using stripe payment intent
     */
    async createPaymentIntent(data) {
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: (data.amount) * 100,
                currency: 'usd',
                customer: data.user.stripeCustomerId,
                payment_method: data.paymentMethod,
                confirm: 'true',
                description: data.description, 
                metadata: data.metadata
            });

            return paymentIntent;
        }
        catch(error) {
            throw new Error(error.message);
        }
    }
}