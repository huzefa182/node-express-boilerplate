import Joi from 'joi';

const PlanValidator = {
    createPlan: Joi.object({
        name: Joi.string().required(),
        slug: Joi.string().required(),
        description: Joi.string().required(),
        feature: Joi.array().required(),
        price: Joi.number().required(),
        currency: Joi.string().required(),
        type: Joi.string().valid('free','paid').required(),
        sortOrder: Joi.number().required(),
    }), 
    
    purchasePlan: Joi.object({
        planType: Joi.string().valid('free','paid').required(),
        token: Joi.any().when('planType', { is: 'paid', then: Joi.string().required(), otherwise: Joi.optional() }),
        planId: Joi.string().required(),
    }),

    purchaseService: Joi.object({
        service: Joi.array().items(Joi.string().required()).strict().required().messages({
            'array.includesRequiredUnknowns': 'Service array should not be empty'
        }),
        amount: Joi.number().integer().min(50).required(),
        token: Joi.string().required(),
    }),

    removePlan: Joi.object({
        email: Joi.string().email().required(),
    }),
}

export default PlanValidator;
