// importing functions and middlewares:-
const ActionService = require('../services/actionService');
const { validateActionCreate } = require('../validation/validate');

// this function will create actions :-
const createActions = async (req, res) => {
    // validating action details :-
    const { error } = validateActionCreate(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    try {
    // checking the action id is already exists or not :-
        const notCreateAction = await ActionService.checkActionId(req.body.action_Id);
        if (notCreateAction !== null) {
            return res.status(404).send({ message: 'This Action-Type is already Registered.' });
        }

        // taking action details to be created :-
        const actionDetails = {
            action_Id: req.body.action_Id,
            actionType: req.body.actionType,
        };

        // new action creating and sending response :-
        const actionsCreate = await ActionService.createAction(actionDetails);
        return res.status(200).send({ success: true, payload: actionsCreate, message: 'New Action Added.' });
    } catch (err) {
    // if error comes sending that error as response as well as print that error in console :-
        console.log(err);
        return res.status(500).send({ success: false, exception: err.message });
    }
};

// exporting createActions :-
module.exports = { createActions };
