// importing functions and middlewares:-
const CameraService = require('../services/index');
const { validateCameraUpdate } = require('../validation/validate');

// this function will update cameras :-
const updateCameras = async (req, res) => {
    // validating camera details :-
    const { error } = validateCameraUpdate(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    try {
    // camera id which is not present in camera collection can not be updated :-
        const notUpdateCamera = await CameraService.checkCameraId(req.params.id);
        if (notUpdateCamera === null) {
            return res.status(404).send({ message: 'This Camera is not Registered.' });
        }

        // taking camera details to be updated :-
        const cameraDetails = {
            camera_Ip: req.body.camera_Ip,
            camera_Name: req.body.camera_Name,
            room_Name: req.body.room_Name,
        };

        // updating camera and sending response :-
        const updateCameraDetails = await CameraService.updateCamera(req.params.id, cameraDetails);
        res.status(200).send({ success: true, message: 'Camera Details has been successfully Updated' });
    } catch (e) {
    // if error comes sending the error as response as well as print the error in console :-
        console.log(e);
        res.status(500).send({ success: false, exception: e.message });
    }
};

// exporting the updateCameras :-
module.exports = { updateCameras };
