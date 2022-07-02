// importing Alert Model :-
const { Alert } = require('../../db/index');
const { Action } = require('../../db/index');

// defining socketAlertService :-
class socketAlertService {
    // getting latest alert time :-
    static async latestAlertTime() {
        const latestAlert = await Alert.find({ action_Id: { $lt: 50 } }).sort({ createdAt: -1 }).limit(1);

        // if new alert found :-
        if (latestAlert[0].action_Id) {
            // checking its corresponding action id is exists or not in DB action collection :-:-
            const latestAlertAction = await Action.findOne({ action_Id: latestAlert[0].action_Id });

            // if corresponding action was not found then creating new action in DB action collection by action_Id :-
            if (latestAlertAction === null) {
                const createNewAction = await Action.create({
                    action_Id: latestAlert[0].action_Id,
                    actionType: 'TO_BE_DEFINED',
                    active_Status: true,
                });
                return latestAlert[0].createdAt;
            }

            // if corresponding action id is exists in DB action collection then only we accounts with the active action :-
            if (latestAlertAction.active_Status === true) {
                return latestAlert[0].createdAt;
            }
        }
    }
}

// exporting the socketAlertService :-
module.exports = socketAlertService;
