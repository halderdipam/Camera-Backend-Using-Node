// importing libraries,functions & middlewares :-
const { Router } = require('express');

const alertRouter = Router();
const {
    getAllFilterAlerts, createAlerts, getSpecificAlert, getOverviewAlerts, updateAlertStatus,
} = require('./api/index');
const {
    verifyUserToken, verifyAdminUserQA, verifyQA, verifyAllUserActive,
} = require('../middlewares/userAuth');

// defining routes :-
alertRouter.get('/alldaterangealerts', verifyUserToken, verifyAllUserActive, verifyAdminUserQA, getAllFilterAlerts);
alertRouter.get('/specificalert/:id', verifyUserToken, verifyAllUserActive, verifyAdminUserQA, getSpecificAlert);
alertRouter.get('/overview', verifyUserToken, verifyAllUserActive, verifyAdminUserQA, getOverviewAlerts);
alertRouter.put('/updatealert/:id', verifyUserToken, verifyAllUserActive, verifyQA, updateAlertStatus);
alertRouter.post('/create', createAlerts);

// exporting alertRouter :-
module.exports = { alertRouter };
