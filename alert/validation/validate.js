// importing joi for validation :-
const Joi = require('joi');

// validating alert update :-
const validateAlertUpdate = (alert) => {
    const schema = Joi.object({
        false_Positive: Joi.string().min(1).max(5).required(),
    });
    return schema.validate(alert);
};

// exporting functions :-
module.exports = { validateAlertUpdate };
