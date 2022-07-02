// importing CameraService and middlewares :-
const CameraService = require('../services/cameraService');
const { validateCameraCreate } = require('../validation/validate');

// this function is creating cameras :-
const createCameras = async (req, res) => {
    // validating camera details :-
    const { error } = validateCameraCreate(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    try {
    // checking the camera id is already exists or not :-
        const notCreateCamera = await CameraService.checkCameraId(req.body.camera_Id);
        if (notCreateCamera !== null) {
            return res.status(404).send({ message: 'This Camera is already Registered.' });
        }

        // taking camera details to be created :-
        const cameraDetails = {
            camera_Id: req.body.camera_Id,
            camera_Ip: req.body.camera_Ip,
            camera_Name: req.body.camera_Name,
            room_Name: req.body.room_Name,
        };

        // new camera creating and sending response :-
        const createCamera = await CameraService.createCamera(cameraDetails);
        return res.status(200).send({ success: true, payload: createCamera, message: 'New Camera Added.' });
    } catch (err) {
    // if error comes sending that error as response as well as print that error in console :-
        console.log(err);
        return res.status(500).send({ success: false, exception: err.message });
    }
};

// exporting the createCameras :-
module.exports = { createCameras };
