// importing mongoose :-
const mongoose = require('mongoose');

// defining schema :-
const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
    },
    lastname: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'user',
        enum: ['admin', 'user', 'QA'],
    },
    isActive: {
        type: Boolean,
        default: true,
        minlength: 1,
        maxlength: 5,
        enum: [true, false],
    },
}, { timestamps: true });

// renaming the collection :-
const User = mongoose.model('User', userSchema, 'User');

// exporting the User :-
module.exports = User;
