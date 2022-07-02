// importing libraries, config & models :-
const _ = require('lodash');
const { DateTime } = require('luxon');
const config = require('../../config/default.json');
const { Action } = require('../../db/index');
const { Alert } = require('../../db/index');
const { Camera } = require('../../db/index');

// this function is giving all alerts to be sent in the report email :-
const todaysAlertProcessing = async () => {
    // getting one day before date :-
    const yesterday = DateTime.now().setZone('Asia/Kolkata').minus({ days: 1 }).endOf('day')
        .toISO()
        .slice(0, 10);
    const start = `${yesterday}T00:00:00.000+00:00`;
    const end = `${yesterday}T23:59:59.000+00:00`;

    // getting allactions, allcameras & allalerts by DB query :-
    let action; let allTodaysAlerts; let
        camera;
    [action, allTodaysAlerts, camera] = await Promise.all([
        Action.find({ action_Id: { $lte: 50 } }),
        Alert.find({ createdAt: { $gte: start, $lt: end }, false_Positive: 'false', action_Id: { $lte: 50 } }).sort({ createdAt: -1 }),
        Camera.find(),
    ]);

    // modifying all-alerts into the object for doing many operations into it :-
    const a = allTodaysAlerts.map((i) => i.toObject());

    // adding video-path into all alerts :-
    a.forEach((element) => {
        const vdpa = element.video_Path;
        element.video_Path = config.paths.videoPath + vdpa;
    });

    // taking empty arrays :-
    const allCameras = [];
    const allActions = [];

    // adding camera-name and room-name into the alerts :-
    a.forEach((item) => {
        const b = camera.filter((ele) => {
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
        const c = action.filter((ele) => {
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

            item.actionIsActive = c[0].active_Status;
            item.actionType = c[0].actionType;
        }
    });

    // making all not found cameras and actions unique before adding into the db-collections :-
    const allUniqueCameraIds = [...new Set(allCameras)];
    const allUniqueActionIds = [...new Set(allActions)];

    // inserting all unique new found cameras into camerasCreate array :-
    const camerasCreate = [];
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
    const actionsCreate = [];
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

    // filtering only all those alerts from alerts list ( here 'a' ) whose related action's 'actionIsActive' is 'true' :-
    const modifiedAlerts = [];
    for (let w = 0; w < a.length; w++) {
        if (a[w].actionIsActive === true) {
            modifiedAlerts.push(a[w]);
        }
    }

    // taking an empty arrary and an empty object :-
    const actionObj = {};
    const allActionIds = [];

    // pushing all action ids into an array amd an object :-
    for (let i = 0; i < modifiedAlerts.length; i++) {
        allActionIds.push(modifiedAlerts[i].action_Id);
        actionObj[modifiedAlerts[i].action_Id] = modifiedAlerts[i].actionType;
    }

    // making all action ids unique :-
    const uniqueActionIds = [...new Set(allActionIds)];

    // sorting the action ids in an ascending order :-
    uniqueActionIds.sort((x, y) => x - y);

    // taking the empty email list :-
    const allEmails = [];

    // processing the alerts for sending the email :-
    uniqueActionIds.forEach((item) => {
        let e = [];
        const ob = {};
        modifiedAlerts.filter((ele) => {
            if (item === ele.action_Id) {
                e.push(ele);
            }
        });

        // sorting by camera name :-
        e = _.sortBy(e, ['camera_Name']);

        // pushing all camera-ids :-
        const allCameraIds = [];
        for (let v = 0; v < e.length; v++) {
            allCameraIds.push(e[v].camera_Id);
        }

        // making all camera ids unique :-
        const makeAllUniqueCameraIds = [...new Set(allCameraIds)];

        const alerts = [];
        makeAllUniqueCameraIds.forEach((itm) => {
            let count = 0;
            const groups = [];
            e.filter((ele) => {
                if (itm === ele.camera_Id) {
                    // counting the alerts :-
                    count += 1;
                    groups.push(ele);
                }
            });

            // taking the alert :-
            const al = groups[0];

            // taking the alert count :-
            al.count = count;

            alerts.push(al);
        });

        // if alerts exists then pushing it to the allEmails list :-
        if (e.length !== 0) {
            ob[actionObj[item]] = alerts;
            allEmails.push(ob);
        }
    });

    // sending all the alerts as report email :-
    return allEmails;
};

// exporting the todaysAlertProcessing :-
module.exports = { todaysAlertProcessing };
