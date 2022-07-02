// importing AlertService :-
const AlertService = require('../services/index');

// this function is creating alerts :-
const createAlerts = async (req, res) => {
    try {
    // taking alert details to be created :-
        const alertDetails = {
            camera_Id: req.body.camera_Id,
            action_Id: req.body.action_Id,
            video_Path: req.body.video_Path,
        };

        // new alert creating and sending response :-
        const alertCreate = await AlertService.createAlert(alertDetails);
        return res.status(200).send({ success: true, payload: alertCreate, message: 'New Alert Created.' });
    } catch (err) {
    // if error comes send it as response as well as print the error in console :-
        console.log(err);
        return res.status(500).send({ success: false, exception: err.message });
    }
};

// exporting the createAlerts :-
module.exports = { createAlerts };
