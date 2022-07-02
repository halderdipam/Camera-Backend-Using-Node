// importing all functions :-
const { createActions } = require('./post');
const { getAllActions, getSpecificAction } = require('./get');
const { updateActions, updateActionStatus } = require('./put');

// exporting all functions :-
module.exports = {
    createActions, updateActions, getSpecificAction, getAllActions, updateActionStatus,
};
