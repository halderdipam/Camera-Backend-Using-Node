// importing jsonwebtoken,config & auth :-
const jwt = require('jsonwebtoken');
const AuthService = require('../auth/services/index');
const config = require('../config/default.json');
const auth = require('./auth');

// this middleware is verifying user token :-
function verifyUserToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    // checking the token given or not :-
    if (token == null) { return res.sendStatus(404); }
    if (!token) { return res.status(404).send({ auth: false, message: 'No token provided.' }); }

    // if token is given try to authenticate it and pass it into the next :-
    jwt.verify(token, config.privateKey, (err, user) => {
        if (err) { return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' }); }
        req.user = user;
        next();
    });
}

// this middleware is verifying the user/admin/QA is active or not :-
async function verifyAllUserActive(req, res, next) {
    const { id } = auth(req);
    const userId = await AuthService.checkUserId(id);
    if (userId.isActive !== true) {
        return res.status(404).send({ auth: false, message: 'Sorry! Only Active users can access this Page.' });
    }
    next();
}

// this middleware is verifying the user is only admin :-
function verifyAdmin(req, res, next) {
    const { role } = auth(req);
    if (role !== 'admin') {
        return res.status(404).send({ auth: false, message: 'Sorry! Only Admin can access this Page.' });
    }
    next();
}

// this middleware is verifying the user is only QA :-
function verifyQA(req, res, next) {
    const { role } = auth(req);
    if (role !== 'QA') {
        return res.status(404).send({ auth: false, message: 'Sorry! Only QA can access this Page.' });
    }
    next();
}

// this middleware is verifying the user is user/QA/admin :-
function verifyAdminUserQA(req, res, next) {
    const { role } = auth(req);
    const userRoles = ['admin', 'user', 'QA'];
    if (userRoles.includes(role) === true) {
        next();
    } else {
        return res.status(404).send({ auth: false, message: 'Sorry! Only Admin/User/QA can access this Page.' });
    }
}

// exporting the middlewares :-
module.exports = {
    verifyUserToken, verifyAllUserActive, verifyAdmin, verifyQA, verifyAdminUserQA,
};
