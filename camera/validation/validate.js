// importing joi for validation :-
const Joi = require('joi');

// validating camera create :-
const validateCameraCreate = (camera) => {
    const schema = Joi.object({
        camera_Id: Joi.number().required(),
        camera_Ip: Joi.string().min(2).max(50).required(),
        camera_Name: Joi.string().min(2).max(100).required(),
        room_Name: Joi.string().min(2).max(300).required(),
    });
    return schema.validate(camera);
};

// validating camera update :-
const validateCameraUpdate = (camera) => {
    const schema = Joi.object({
        camera_Ip: Joi.string().min(2).max(50).required(),
        camera_Name: Joi.string().min(2).max(100).required(),
        room_Name: Joi.string().min(2).max(300).required(),
    });
    return schema.validate(camera);
};

// exporting functions :-
module.exports = { validateCameraCreate, validateCameraUpdate };
