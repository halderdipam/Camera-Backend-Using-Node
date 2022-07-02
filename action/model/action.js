// importing mongoose :-
const mongoose = require('mongoose');

// defining schema :-
const actionSchema = new mongoose.Schema({
    action_Id: {
        type: Number,
        required: true,
        minlength: 1,
        maxlength: 40,
        unique: true,
    },
    actionType: {
        type: String,
        required: true,
    },
    active_Status: {
        type: Boolean,
        default: true,
        minlength: 1,
        maxlength: 5,
        enum: [true, false],
    },
}, { timestamps: true });

// renaming the collection :-
const Action = mongoose.model('Action', actionSchema, 'Action');

// exporting the Action :-
module.exports = Action;
