// importing CameraService :-
const CameraService = require('../services/index');

// getting all-cameras :-
const getAllCameras = async (req, res) => {
    // page & limit for pagination :-
    const page = parseInt(req.query.page, 10);
    const limit = parseInt(req.query.limit, 10);
    const offset = page ? page * limit : 0;

    try {
    // getting all-cameras,all-cameras count and totalpages :-
        const cameras = await CameraService.getAllCamera(offset, limit);
        const totalCameras = await CameraService.getAllCamerasCount();
        const totalPages = Math.ceil(totalCameras / limit);

        // sending response :-
        return res.status(200).send({ success: true, payload: { Cameras: cameras, TotalPages: totalPages } });
    } catch (e) {
    // if error comes sending the error as response as well as print the error in console :-
        console.log(e);
        res.status(500).send({
            message: 'Error -> Can NOT complete a paging request!',
            error: e.message,
        });
    }
};

// getting specific-camera :-
const getSpecificCamera = async (req, res) => {
    try {
    // passing id to get the specific-camera :-
        const camera = await CameraService.getSpecificCameraDetails(req.params.id);

        // checking if the camera is present or not :-
        if (!camera) return res.status(404).send({ message: 'This Camera is not Present.' });

        // else sending camera as response :-
        return res.status(200).send({ success: true, payload: camera });
    } catch (e) {
    // if error comes sending the error as response as well as print the error in console :-
        console.log(e);
        res.status(500).send({
            message: `Can not able to fetch the Camera! Maybe this Camera ID - ${req.params.id} does not exists.`,
        });
    }
};

// exporting all functions :-
module.exports = { getAllCameras, getSpecificCamera };
