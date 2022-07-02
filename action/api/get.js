// import ActionServices :-
const ActionServices = require('../services/index');
const auth = require('../../middlewares/auth');

// getting all-actions :-
const getAllActions = async (req, res) => {
    // page & limit for pagination :-
    const page = parseInt(req.query.page, 10);
    const limit = parseInt(req.query.limit, 10);
    const offset = page ? page * limit : 0;

    try {
    // checking out the role of the user :-
        const { role } = auth(req);

        // getting all-actions and its count :-
        const actions = await ActionServices.getAllAction(role, offset, limit);
        const totalActions = await ActionServices.getAllActionsCount(role);
        const totalPages = Math.ceil(totalActions / limit);

        // sending response :-
        return res.status(200).send({ success: true, payload: { Actions: actions, TotalPages: totalPages } });
    } catch (e) {
    // if error comes then sending the error as response as well as print the error in console :-
        console.log(e);
        res.status(500).send({
            message: 'Error -> Can NOT complete a paging request!',
            error: e.message,
        });
    }
};

// getting specific-action by admin :-
const getSpecificAction = async (req, res) => {
    try {
    // passing id to get the specific-action :-
        const action = await ActionServices.getSpecificActionDetails(req.params.id);

        // checking if the action is present or not :-
        if (action.length === 0) return res.status(404).send({ message: 'Maybe This Action is not Present or its \'active_Status\' is false.' });

        // else sending action as response :-
        return res.status(200).send({ success: true, payload: action });
    } catch (e) {
    // if error comes sending the error as response as well as print the error in console :-
        console.log(e);
        res.status(500).send({
            message: `Can not able to fetch the Action! Maybe this Action ID - ${req.params.id} does not exists.`,
        });
    }
};

// exporting the functions :-
module.exports = { getAllActions, getSpecificAction };
