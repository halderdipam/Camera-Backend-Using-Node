// importing models :-
const { User } = require('../auth/model/index');
const { Camera } = require('../camera/model/index');
const { Action } = require('../action/model/index');
const { Alert } = require('../alert/model/index');

// exporting models :-
module.exports = {
    User, Camera, Action, Alert,
};
