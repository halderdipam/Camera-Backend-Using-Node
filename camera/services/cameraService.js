// importing Camera model :-
const { Camera } = require('../../db/index');

// defining CameraService :-
class CameraService {
    // creating camera :-
    static async createCamera(cameraDetails) {
        return await Camera.create(
            cameraDetails,
        );
    }

    // checking camera id is exists in DB-action collection or not :-
    static async checkCameraId(id) {
        return await Camera.findOne({
            camera_Id: id,
        });
    }

    // update cameras :-
    static async updateCamera(id, body) {
        return await Camera.updateOne({ camera_Id: id }, { $set: body });
    }

    // getting all cameras :-
    static async getAllCamera(offset, limit) {
        return await Camera.find().sort({ camera_Id: 1 }).skip(offset).limit(limit);
    }

    // getting all cameras count :-
    static async getAllCamerasCount() {
        return await Camera.countDocuments();
    }

    // getting all-details of a specific-camera :-
    static async getSpecificCameraDetails(id) {
        return await Camera.findOne(
            {
                camera_Id: id,
            },
        );
    }
}

// exporting CameraService :-
module.exports = CameraService;
