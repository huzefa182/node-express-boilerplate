import Joi from 'joi';

const FeatureValidator = {
    createFeature: Joi.object({
        name: Joi.string().required(),
        plan: Joi.array().required(),
        sortOrder: Joi.number().required(),
    }),  
}

export default FeatureValidator;
