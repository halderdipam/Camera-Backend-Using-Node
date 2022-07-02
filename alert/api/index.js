// importing all functions :-
const { createAlerts } = require('./post');
const { getAllFilterAlerts, getSpecificAlert, getOverviewAlerts } = require('./get');
const { updateAlertStatus } = require('./put');

// exporting all functions :-
module.exports = {
    createAlerts, getAllFilterAlerts, getSpecificAlert, getOverviewAlerts, updateAlertStatus,
};
