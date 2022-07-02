// importing config,functions,all-packages and db-collection models :-
const config = require('../../config/default.json');
const { Alert } = require('../../db/index');
const { Camera } = require('../../db/index');
const { Action } = require('../../db/index');
const { alertProcessing, alertCountProcessing } = require('./alertProcessing');

// defining AlertService :-
class AlertService {
    // creating alert ( for development purpose ) :-
    static async createAlert(alertDetails) {
        return await Alert.create(
            alertDetails,
        );
    }

    // checking alert by QA:-
    static async checkAlertId(id) {
        return await Alert.findOne(
            { _id: id },
        );
    }

    // updating Alert by QA :-
    static async updateAlert(id, body) {
        return await Alert.updateOne({ _id: id }, { $set: body });
    }

    // getting all-alerts and its count for statistics api :-
    static async getAllAlertsOverview(role, startDate, endDate, camera_id) {
        let start = 'T00:00:00.000+00:00';
        let end = 'T23:59:59.000+00:00';

        // defining query :-
        const query = { action_Id: { $lt: 50 } };

        // checking the date filters are present or not :-
        if (startDate.length !== 0 && endDate.length !== 0) {
            start = startDate + start;
            end = endDate + end;
            query.createdAt = { $gte: start, $lt: end };
        }

        // adding camera into the query :-
        if (camera_id.length !== 0) {
            query.camera_Id = { $in: camera_id };
        }

        // modifying query if the user is not QA :-
        if (role !== 'QA') {
            query.false_Positive = 'false';
        }

        // DB-query for all-alerts and all-actions :-
        let allAlerts; let
            allActions;
        [allAlerts, allActions] = await Promise.all([
            Alert.find(query).sort({ createdAt: 1 }),
            Action.find({ action_Id: { $lt: 50 } }),
        ]);

        const actionIds = [];
        const actionObj = {};

        // taking all-action ids into an array and object ( object containing with action-id and its corresponding action-type ) :-
        allActions.forEach((item) => {
            actionIds.push(item.action_Id);
            actionObj[item.action_Id] = [item.actionType];
        });

        // collecting all-action ids which we are getting from alerts and making them unique :-
        const atalActionIds = [];
        allAlerts.forEach((item) => {
            atalActionIds.push(item.action_Id);
        });
        const allAtalUniqueActionIds = [...new Set(atalActionIds)];

        // collecting those action ids which are in alert collection but not in action collection :-
        const allNotFoundActionIds = [];
        for (let i = 0; i < allAtalUniqueActionIds.length; i++) {
            if (actionIds.includes(allAtalUniqueActionIds[i]) === false) {
                allNotFoundActionIds.push(allAtalUniqueActionIds[i]);
            }
        }

        // inserting all unique new found actions into actionsCreate array :-
        const actionsCreate = [];
        for (let j = 0; j < allNotFoundActionIds.length; j++) {
            actionsCreate.push(
                {
                    action_Id: allNotFoundActionIds[j],
                    actionType: 'TO_BE_DEFINED',
                    active_Status: true,
                },
            );
            actionObj[allNotFoundActionIds[j]] = 'TO_BE_DEFINED';
        }

        // inserting all unique new found cameras and actions into the db-collections ( camera & action ) :-
        const createNewActions = await Action.insertMany(actionsCreate);

        // concatinating all unique unsorted action ids :-
        const allUniqueUnSortedActions = actionIds.concat(allNotFoundActionIds);

        // removing actions whose 'active_Status' is not 'true' :-
        const allUniqueActions = [];
        allUniqueUnSortedActions.forEach((actnId) => {
            allActions.forEach((actn) => {
                if (actnId === actn.action_Id && actn.active_Status === true) {
                    allUniqueActions.push(actnId);
                }
            });
        });

        // removing all-alerts whose related action's 'active_Status' is not 'true' :-
        const modifiedAtalActionIds = [];
        atalActionIds.forEach((atalActnId) => {
            if (allUniqueActions.includes(atalActnId) === true) { modifiedAtalActionIds.push(atalActnId); }
        });

        // sorting unique action-ids :-
        allUniqueActions.sort((a, b) => a - b);

        // getting the data and its corresponding counts :-
        const data = [];
        let totalCount = 0;
        for (let k = 0; k < allUniqueActions.length; k++) {
            const alertCountObject = {};
            let count = 0;
            for (let j = 0; j < modifiedAtalActionIds.length; j++) {
                if (allUniqueActions[k] === modifiedAtalActionIds[j]) {
                    count += 1;
                    totalCount += 1;
                }
            }
            alertCountObject[actionObj[allUniqueActions[k]]] = count;
            data.push(alertCountObject);
        }

        // returning data and its corresponding counts :-
        return [data, totalCount];
    }

    // getting all-details of a specific-alert :-
    static async getSpecificAlert(role, id) {
    // defining query :-
        const query = { _id: id, action_Id: { $lt: 50 } };

        // modifying query if the user is not QA :-
        if (role !== 'QA') {
            query.false_Positive = 'false';
        }

        // finding the alert :-
        const specificAlert = await Alert.findOne(query);

        // checking if it exists or not :-
        if (specificAlert) {
            // making it object and adding video_path into it :-
            const speAlt = specificAlert.toObject();
            const vdpa = speAlt.video_Path;
            speAlt.video_Path = config.paths.videoPath + vdpa;

            // DB-query for finding its corresponding camera and action :-
            let findCamera; let
                findAction;
            [findCamera, findAction] = await Promise.all([
                Camera.findOne({ camera_Id: speAlt.camera_Id }),
                Action.findOne({ action_Id: speAlt.action_Id }),
            ]);

            // checking that the camera is null, then create else add the camera name & room name into the speAlt object :-
            if (findCamera === null) {
                const createCamera = Camera.create(
                    {
                        camera_Id: speAlt.camera_Id,
                        camera_Ip: 'TO_BE_DEFINED',
                        camera_Name: 'TO_BE_DEFINED',
                        room_Name: 'TO_BE_DEFINED',
                    },
                );
                speAlt.camera_Name = 'TO_BE_DEFINED';
                speAlt.room_Name = 'TO_BE_DEFINED';
            } else {
                speAlt.camera_Name = findCamera.camera_Name;
                speAlt.room_Name = findCamera.room_Name;
            }

            // checking that the action is null, then create else add the action-type into the speAlt object :-
            if (findAction === null) {
                const createAction = Action.create(
                    {
                        action_Id: speAlt.action_Id,
                        actionType: 'TO_BE_DEFINED',
                        active_Status: true,
                    },
                );
                speAlt.actionType = 'TO_BE_DEFINED';
                speAlt.actionIsActive = true;
            } else {
                speAlt.actionType = findAction.actionType;
                speAlt.actionIsActive = findAction.active_Status;
            }

            // processing and returing the alert :-
            if (speAlt.actionIsActive === true) {
                return speAlt;
            }
        }
    }

    // this function will give the all alerts with or without filters :-
    static async getAllFilterWiseAlerts(role, offset, limit, startDate, endDate, camera_id, action_id) {
    // fixing up the start and end date :-
        const start = `${startDate}T00:00:00.000+00:00`;
        const end = `${endDate}T23:59:59.000+00:00`;

        // defining query :-
        const query = {};

        // modifying query if the user is not QA :-
        if (role !== 'QA') {
            query.false_Positive = 'false';
        }

        // adding date into the query :-
        if (startDate.length !== 0 && endDate.length !== 0) {
            query.createdAt = { $gte: start, $lt: end };
        }

        // adding action_Id to the query :-
        if (action_id.length === 0) {
            query.action_Id = { $lt: 50 };
        } else {
            query.action_Id = { $in: action_id, $lt: 50 };
        }

        // adding camera into the query :-
        if (camera_id.length !== 0) {
            query.camera_Id = { $in: camera_id };
        }

        // getting all the alerts from this function call :-
        const result = await alertProcessing(query, offset, limit);
        return result;
    }

    // this function will give the all alerts with or without filters :-
    static async getAllFilterWiseAlertsTotalCount(role, startDate, endDate, camera_id, action_id) {
    // fixing up the start and end date :-
        const start = `${startDate}T00:00:00.000+00:00`;
        const end = `${endDate}T23:59:59.000+00:00`;

        // defining query :-
        const query = {};

        // modifying query if the user is not QA :-
        if (role !== 'QA') {
            query.false_Positive = 'false';
        }

        // adding date into the query :-
        if (startDate.length !== 0 && endDate.length !== 0) {
            query.createdAt = { $gte: start, $lt: end };
        }

        // adding action_Id to the query :-
        if (action_id.length === 0) {
            query.action_Id = { $lt: 50 };
        } else {
            query.action_Id = { $in: action_id, $lt: 50 };
        }

        // adding camera into the query :-
        if (camera_id.length !== 0) {
            query.camera_Id = { $in: camera_id };
        }

        // getting all the alerts count from this function call :-
        const result = await alertCountProcessing(query);
        return result;
    }
}

// exporting the AlertService :-
module.exports = AlertService;
