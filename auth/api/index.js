// importing the functions :-
const { getAllUsers } = require('./get');
const { registerAuthAdmin, registerUser, loginAuthUser } = require('./post');
const { updatePassword, updateUsers, updateUserStatus } = require('./put');
const { deleteUsers } = require('./delete');

// exporting the functions :-
module.exports = {
    getAllUsers, registerAuthAdmin, registerUser, loginAuthUser, updatePassword, updateUsers, updateUserStatus, deleteUsers,
};
