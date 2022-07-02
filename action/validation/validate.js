// importing joi for validation :-
const Joi = require('joi');

// validating action create :-
const validateActionCreate = (action) => {
    const schema = Joi.object({
        action_Id: Joi.number().required(),
        actionType: Joi.string().min(1).max(100).required(),
    });
    return schema.validate(action);
};

// validating action details update :-
const validateActionUpdate = (action) => {
    const schema = Joi.object({
        actionType: Joi.string().min(1).max(100).required(),
    });
    return schema.validate(action);
};

// validating action status update :-
const validateActionStatusUpdate = (action) => {
    const schema = Joi.object({
        active_Status: Joi.boolean().required(),
    });
    return schema.validate(action);
};

// exporting functions :-
module.exports = { validateActionCreate, validateActionUpdate, validateActionStatusUpdate };
