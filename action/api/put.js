// importing functions and middlewares:-
const ActionService = require('../services/index');
const { validateActionUpdate, validateActionStatusUpdate } = require('../validation/validate');

// this function will update actions :-
const updateActions = async (req, res) => {
    // validating action details :-
    const { error } = validateActionUpdate(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    try {
    // if action id grater than or equals to 50 can not be updated :-
        if (parseInt(req.params.id, 10) >= 50) return res.status(404).send({ message: 'This Action-Type grater than 49 can not be Updated.' });

        // action id which is not present in action collection or an Inactive action can not be updated :-
        const notUpdateAction = await ActionService.checkActionId(req.params.id);
        if ((notUpdateAction === null) || (notUpdateAction.active_Status === false)) {
            return res.status(404).send({ message: 'This Action-Type is not Registered or the Action is in Inactive.' });
        }

        // taking action details to be updated :-
        const actionDetails = {
            actionType: req.body.actionType,
        };

        // updating action and sending response :-
        const updateActionListDetails = await ActionService.updateAction(req.params.id, actionDetails);
        res.status(200).send({ success: true, message: 'Action-Type has been successfully Updated.' });
    } catch (e) {
    // if error comes sending the error as response as well as print the error in console :-
        console.log(e);
        res.status(500).send({ success: false, exception: e.message });
    }
};

// this function will update action as active or not only by admin :-
const updateActionStatus = async (req, res) => {
    try {
    // validating action details :-
        const { error } = validateActionStatusUpdate(req.body);
        if (error) return res.status(404).send(error.details[0].message);

        // if action id grater than or equals to 50 can not be updated :-
        if (parseInt(req.params.id, 10) >= 50) return res.status(404).send({ message: 'This Action-Type grater than 49 can not be Updated.' });

        // action which is not present in action collection can not be updated ( checking by action_Id ) :-
        const notUpdateAction = await ActionService.checkActionId(req.params.id);
        if (notUpdateAction === null) {
            return res.status(404).send({ message: 'This Action is not Present.' });
        }

        // checking and coverting the string values to the boolean values :-
        let actionStatus = '';
        if (req.body.active_Status === 'true') {
            actionStatus = true;
        } else if (req.body.active_Status === 'false') {
            actionStatus = false;
        } else {
            return res.status(404).send({ message: 'The Action Status Modification can be done either \'true\' or \'false\' in String.' });
        }

        // taking action status to be updated :-
        const actionDetails = {
            active_Status: actionStatus,
        };

        // updating action and sending response :-
        const updateActionDetails = await ActionService.updateAction(req.params.id, actionDetails);
        res.status(200).send({ success: true, message: 'Action Status has been successfully Updated' });
    } catch (e) {
    // if error comes sending the error as response as well as print the error in console :-
        console.log(e);
        res.status(500).send({ success: false, exception: e.message });
    }
};

// exporting the functions :-
module.exports = { updateActions, updateActionStatus };
