import Joi from 'joi';

const MasterValidator = {
    majorList: Joi.object({
        fieldOfStudy: Joi.string().required(),
    })  
}

export default MasterValidator;
