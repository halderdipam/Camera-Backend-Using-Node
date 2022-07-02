// importing jwt-decode :-
const jwt_decode = require('jwt-decode');

// getting role & email from this function :-
const auth = (req) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    try {
    // returning role & email :-
        const {
            role, email, isActive, id,
        } = jwt_decode(token);
        return {
            role, email, isActive, id,
        };
    } catch (e) {
    // returning error message :-
        return e.message;
    }
};

// exporting auth :-
module.exports = auth;
