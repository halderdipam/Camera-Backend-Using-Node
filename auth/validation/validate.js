// importing joi for validation :-
const Joi = require('joi');

// validating admin :-
const validateAdmin = (user) => {
    const schema = Joi.object({
        firstname: Joi.string().min(2).max(50).required(),
        lastname: Joi.string().min(1).max(50).required(),
        email: Joi.string().min(1).max(255).required()
            .email(),
        password: Joi.string().min(8).max(255).required(),
    });
    return schema.validate(user);
};

// validating user/admin/QA add by admin :-
const validateUserRegister = (user) => {
    const schema = Joi.object({
        firstname: Joi.string().min(2).max(50).required(),
        lastname: Joi.string().min(1).max(50).required(),
        email: Joi.string().min(1).max(255).required()
            .email(),
        password: Joi.string().min(8).max(255).required(),
        role: Joi.string().min(1).max(255).required(),
    });
    return schema.validate(user);
};

// validating user/admin/QA login :-
const validateUserLogin = (user) => {
    const schema = Joi.object({
        email: Joi.string().min(1).max(255).required()
            .email(),
        password: Joi.string().min(8).max(255).required(),
    });
    return schema.validate(user);
};

// validating user/admin/QA change password :-
const validateUserChangePassword = (user) => {
    const schema = Joi.object({
        oldPassword: Joi.string().min(8).max(255).required(),
        newPassword: Joi.string().min(8).max(255).required(),
        confirmNewPassword: Joi.string().min(8).max(255).required(),
    });
    return schema.validate(user);
};

// validating user/admin/QA details to be updated :-
const validateUserUpdate = (user) => {
    const schema = Joi.object({
        firstname: Joi.string().min(2).max(50).required(),
        lastname: Joi.string().min(1).max(50).required(),
        email: Joi.string().min(1).max(255).required()
            .email(),
        role: Joi.string().min(1).max(8),
    });
    return schema.validate(user);
};

// validating user/admin/QA details to be updated :-
const validateUserStatusUpdate = (user) => {
    const schema = Joi.object({
        isActive: Joi.string().min(1).max(5).required(),
    });
    return schema.validate(user);
};

// exporting the functions :-
module.exports = {
    validateAdmin, validateUserRegister, validateUserStatusUpdate, validateUserLogin, validateUserChangePassword, validateUserUpdate,
};
