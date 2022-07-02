// importing middlewares & functions :-
const { Router } = require('express');

const actionRouter = Router();
const {
    createActions, getAllActions, updateActions, getSpecificAction, updateActionStatus,
} = require('./api/index');
const {
    verifyUserToken, verifyAdmin, verifyAllUserActive, verifyAdminUserQA,
} = require('../middlewares/userAuth');

// defining routes :-
actionRouter.post('/create', verifyUserToken, verifyAllUserActive, verifyAdmin, createActions);
actionRouter.get('/allactions', verifyUserToken, verifyAllUserActive, verifyAdminUserQA, getAllActions);
actionRouter.put('/updateactions/:id', verifyUserToken, verifyAllUserActive, verifyAdmin, updateActions);
actionRouter.put('/updateactionstatus/:id', verifyUserToken, verifyAllUserActive, verifyAdmin, updateActionStatus);
actionRouter.get('/specificaction/:id', verifyUserToken, verifyAllUserActive, verifyAdminUserQA, getSpecificAction);

// exporting actionRouter :-
module.exports = { actionRouter };
