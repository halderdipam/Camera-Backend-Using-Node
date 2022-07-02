// import Roles :-
const Roles = require('./enums');

// getting user role by this function :-
const getRole = (index) => Roles[0][index];

// exporting getRole :-
module.exports = { getRole };
