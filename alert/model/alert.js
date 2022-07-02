// import mongoose :-
const mongoose = require('mongoose');

// defining schema :-
const alertSchema = new mongoose.Schema({
    camera_Id: {
        type: Number,
        required: true,
        minlength: 1,
        maxlength: 20,
    },
    action_Id: {
        type: Number,
        required: true,
        minlength: 1,
        maxlength: 40,
    },
    video_Path: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 1000,
    },
    email_Status: {
        type: Boolean,
        required: true,
        default: true,
    },
    false_Positive: {
        type: String,
        default: 'false',
        minlength: 1,
        maxlength: 5,
        enum: ['false', 'true'],
    },
}, { timestamps: true });

// renaming the collection :-
const Alert = mongoose.model('Alert', alertSchema, 'Alert');

// exporting Alert :-
module.exports = Alert;
