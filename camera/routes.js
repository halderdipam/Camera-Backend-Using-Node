// importing middlewares & functions :-
const { Router } = require('express');

const cameraRouter = Router();
const { updateCameras, getAllCameras, getSpecificCamera } = require('./api/index');
const {
    verifyUserToken, verifyAdmin, verifyAdminUserQA, verifyAllUserActive,
} = require('../middlewares/userAuth');
const { createCameras } = require('./api/index');

// defining routes :-
cameraRouter.post('/create', verifyUserToken, verifyAllUserActive, verifyAdmin, createCameras);
cameraRouter.put('/update/:id', verifyUserToken, verifyAllUserActive, verifyAdmin, updateCameras);
cameraRouter.get('/allcameras', verifyUserToken, verifyAllUserActive, verifyAdminUserQA, getAllCameras);
cameraRouter.get('/specificcamera/:id', verifyUserToken, verifyAllUserActive, verifyAdminUserQA, getSpecificCamera);

// exporting cameraRouter :-
module.exports = { cameraRouter };
