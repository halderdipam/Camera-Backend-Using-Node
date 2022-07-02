// importing mongoose :-
const mongoose = require('mongoose');

// defining schema :-
const cameraSchema = new mongoose.Schema({
    camera_Id: {
        type: Number,
        required: true,
        minlength: 1,
        maxlength: 20,
        unique: true,
    },
    camera_Ip: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50,
    },
    camera_Name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 500,
    },
    room_Name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 500,
    },
}, { timestamps: true });

// renaming the collection :-
const Camera = mongoose.model('Camera', cameraSchema, 'Camera');

// exporting the Camera :-
module.exports = Camera;
