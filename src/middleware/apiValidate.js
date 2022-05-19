import httpStatus from "http-status";
import { errorResponse } from "../helpers/message";

export const apiValidate = (schema, property = 'body') => {
    return (req, res, next) => { 
        const options = {
            abortEarly: false, // include all errors
            allowUnknown: true, // ignore unknown props
            stripUnknown: true // remove unknown props
        };
        const { error } = schema.validate(req[property], options); 
        const valid = error == null; 
        if (valid) { 
            return next(); 
        } 
        else { 
            const { details } = error; 
            const message = details.map(i => i.message).join(',')

            const errors = { message, details: [] };
            error.details.map((errorData) => {
                const errorObject = {
                    message: errorData.message,
                    field: errorData.path.join('_'),
                    type: errorData.type,
                };

                errors.details.push(errorObject);
            });
            return errorResponse(req, res, 'Validation Error', httpStatus.BAD_REQUEST, errors);
        } 
    }   
}
