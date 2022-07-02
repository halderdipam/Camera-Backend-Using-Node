// importing config,all-packages and db-collection models :-
const config = require('../../config/default.json');
const { Camera } = require('../../db/index');
const { Action } = require('../../db/index');
const { Alert } = require('../../db/index');

// this function will give the all alerts with or without filters (also alert-processing is happening here) :-
const alertProcessing = async (query, offset, limit) => {
    // database-call for alert,camera & action :-
    let alert; let camera; let
        action;
    [alert, camera, action] = await Promise.all([
        Alert.find(query).sort({ createdAt: -1 }).skip(offset).limit(limit),
        Camera.find(),
        Action.find({ action_Id: { $lt: 50 } }),
    ]);

    // modifying all-alerts into the object for doing many operations into it :-
    let a = alert.map((i) => i.toObject());

    // adding video-path into all alerts :-
    a.forEach((element) => {
        let vdpa = element.video_Path;
        element.video_Path = config.paths.videoPath + vdpa;
    });

    let allCameras = [];
    let allActions = [];

    // adding camera-name and room-name into the alerts :-
    a.forEach((item) => {
        let b = camera.filter((ele) => {
            if (item.camera_Id === +ele.camera_Id) {
                return ele;
            }
        });

        // all-cameras which are not in camera collection (in DB) will add in allCameras array :-
        if (!b[0]) {
            allCameras.push(item.camera_Id);
            item.camera_Name = 'TO_BE_DEFINED';
            item.room_Name = 'TO_BE_DEFINED';
        } else {
            // if camera present in camera collection (in DB) then camera-name will only be added into the alerts :-
            item.camera_Name = b[0].camera_Name;
            item.room_Name = b[0].room_Name;
        }
    });

    // adding action-type into the alerts :-
    a.forEach((item) => {
        let c = action.filter((ele) => {
            if (item.action_Id === +ele.action_Id) {
                return ele;
            }
        });

        // all-actions which are not in action collection (in DB) will add in allactions array :-
        if (!c[0]) {
            allActions.push(item.action_Id);
            item.actionType = 'TO_BE_DEFINED';
            item.actionIsActive = true;
        } else {
            // if actions present in action collection (in DB) then action-type will only be added into the alerts :-

            item.actionType = c[0].actionType;
            item.actionIsActive = c[0].active_Status;
        }
    });

    // making all not found cameras and actions unique before adding into the db-collections :-
    const allUniqueCameraIds = [...new Set(allCameras)];
    const allUniqueActionIds = [...new Set(allActions)];

    // inserting all unique new found cameras into camerasCreate array :-
    let camerasCreate = [];
    for (let i = 0; i < allUniqueCameraIds.length; i++) {
        camerasCreate.push(
            {
                camera_Id: allUniqueCameraIds[i],
                camera_Ip: 'TO_BE_DEFINED',
                camera_Name: 'TO_BE_DEFINED',
                room_Name: 'TO_BE_DEFINED',
            },
        );
    }

    // inserting all unique new found actions into actionsCreate array :-
    let actionsCreate = [];
    for (let j = 0; j < allUniqueActionIds.length; j++) {
        actionsCreate.push(
            {
                action_Id: allUniqueActionIds[j],
                actionType: 'TO_BE_DEFINED',
                active_Status: true,
            },
        );
    }

    // inserting all unique new found cameras and actions into the db-collections ( camera & action ) :-
    const createNewCameras = await Camera.insertMany(camerasCreate);
    const createNewActions = await Action.insertMany(actionsCreate);

    // returing all-alerts :-
    return a;
};

// this function gives the total alerts count along with filters ( except paggination ) :-
const alertCountProcessing = async (query) => {
    // getting all alerts count :-
    const alertsCount = Alert.find(query).countDocuments();

    // returning alerts count :-
    return alertsCount;
};

// exporting the alertProcessing :-
module.exports = { alertProcessing, alertCountProcessing };
