// importing libraries, middlewares & functions :-
const { Router } = require('express');

const reportEmailRouter = Router();
const { verifyUserToken, verifyQA, verifyAllUserActive } = require('../middlewares/userAuth');
const { emailSend } = require('./api/index');

// defining routes :-
reportEmailRouter.use('/allemails', verifyUserToken, verifyAllUserActive, verifyQA, emailSend);

// exporting reportEmailRouter :-
module.exports = { reportEmailRouter };
