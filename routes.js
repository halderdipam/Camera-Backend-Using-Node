// importing libraries and routes :-
const { Router } = require('express');
const { authRouter } = require('./auth/routes');
const { cameraRouter } = require('./camera/routes');
const { actionRouter } = require('./action/routes');
const { alertRouter } = require('./alert/routes');
const { reportEmailRouter } = require('./reportEmail/routes');

const router = Router();

// defining routes :-
router.use('/api/auth', authRouter);
router.use('/api/camera', cameraRouter);
router.use('/api/action', actionRouter);
router.use('/api/alert', alertRouter);
router.use('/api/reportemail', reportEmailRouter);

// exporting the routes :-
module.exports = { router };
