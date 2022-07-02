// importing the AlertService & functions :-
const AlertService = require('../services/index');
const auth = require('../../middlewares/auth');

// getting all-alerts and its count with or without filters :-
const getAllFilterAlerts = async (req, res) => {
    // page & limit for pagination :-
    const page = parseInt(req.query.page, 10);
    const limit = parseInt(req.query.limit, 10);
    const offset = page ? page * limit : 0;

    // destructuring the filters :-
    const {
        startDate, endDate, camera_Id, action_Id,
    } = req.query;

    // spliting camera-ids from the request :-
    const newCameraIds = camera_Id.split(',');

    // converting camera ids into the integers :-
    const camera_id = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < newCameraIds.length; i++) {
        if (newCameraIds[i].length !== 0) {
            camera_id.push(parseInt(newCameraIds[i], 10));
        }
    }

    // spliting action-ids from the request :-
    const newActionIds = action_Id.split(',');

    // converting action ids into the integers :-
    const action_id = [];
    for (let j = 0; j < newActionIds.length; j++) {
        if (newActionIds[j].length !== 0) {
            action_id.push(parseInt(newActionIds[j], 10));
        }
    }

    try {
    // checking out the filters :-
        if ((startDate.length === 0 && endDate.length !== 0) || (startDate.length !== 0 && endDate.length === 0)) {
            return res.status(404).send({ message: 'Start-Date and End-Date both are required.' });
        }

        // checking out the role of the user :-
        const { role } = auth(req);

        // getting all-alerts,all-alerts count and totalpages :-
        const alerts = await AlertService.getAllFilterWiseAlerts(role, offset, limit, startDate, endDate, camera_id, action_id);
        const totalAlerts = await AlertService.getAllFilterWiseAlertsTotalCount(role, startDate, endDate, camera_id, action_id);
        const totalPages = Math.ceil(totalAlerts / limit);

        // sending response :-
        return res.status(200).send({ success: true, payload: { Alerts: alerts, Total_Pages: totalPages, Total_Alerts: totalAlerts } });
    } catch (e) {
    // if error occurs then sending the error as response and also print the error into the console :-
        console.log(e);
        res.status(500).send({
            message: 'Error -> Can NOT complete a paging request!',
            error: e.message,
        });
    }
};

// for getting specific-alert :-
const getSpecificAlert = async (req, res) => {
    try {
    // checking out the role of the user :-
        const { role } = auth(req);

        // passing id to get the specific-alert :-
        const alert = await AlertService.getSpecificAlert(role, req.params.id);

        // checking if the specific alert is not present :-
        if (!alert) return res.status(404).send({ message: 'This Alert is not Present/Inactive or the Action related to it is Inactive.' });

        // else sending that alert as response :-
        return res.status(200).send({ success: true, payload: { Alert: alert } });
    } catch (e) {
    // if error occurs then sending the error as response and also print the error into the console :-
        console.log(e);
        res.status(500).send({
            message: `Can not able to fetch the Alert! Maybe this Alert ID - ${req.params.id} does not exists.`,
            error: e.message,
        });
    }
};

// for getting statistics :-
const getOverviewAlerts = async (req, res) => {
    // destructuring the startDate & endDate :-
    const { startDate, endDate, camera_Id } = req.query;

    // checking out the filters :-
    if ((startDate.length === 0 && endDate.length !== 0) || (startDate.length !== 0 && endDate.length === 0)) {
        return res.status(404).send({ message: 'Start-Date and End-Date both are required.' });
    }

    // spliting camera-ids from the request :-
    const newCameraIds = camera_Id.split(',');

    // converting camera ids into the integers :-
    const camera_id = [];
    for (let i = 0; i < newCameraIds.length; i++) {
        if (newCameraIds[i].length !== 0) {
            camera_id.push(parseInt(newCameraIds[i], 10));
        }
    }

    try {
    // checking out the role of the user :-
        const { role } = auth(req);

        // getting all-alerts and its count :-
        const allAlertsAndCount = await AlertService.getAllAlertsOverview(role, startDate, endDate, camera_id);
        const allAlerts = allAlertsAndCount[0];
        const allAlertsCount = allAlertsAndCount[1];

        // sending response :-
        return res.status(200).send({
            success: true,
            payload: {
                alert_Generated: allAlerts,
                Total_Alerts: allAlertsCount,
            },
        });
    } catch (e) {
    // if error occurs then sending the error as response and also print the error into the console :-
        console.log(e);
        res.status(500).send({
            message: 'Error -> Can NOT complete a paging request!',
            error: e.message,
        });
    }
};

// exporting all functions :-
module.exports = { getAllFilterAlerts, getSpecificAlert, getOverviewAlerts };
