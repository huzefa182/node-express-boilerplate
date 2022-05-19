import Joi from 'joi';

const UserValidator = {
    compareCollege: Joi.object({
        title: Joi.string().required(),
        college: Joi.array().required(),
    }),  
}

export default UserValidator;
