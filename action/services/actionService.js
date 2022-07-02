// importing Action model :-
const { Action } = require('../../db/index');

// defining ActionService :-
class ActionService {
    // creating action :-
    static async createAction(actionDetails) {
        return await Action.create(
            actionDetails,
        );
    }

    // checking action id is exists in DB-action collection or not :-
    static async checkActionId(action_Id) {
        return await Action.findOne({
            action_Id,
        });
    }

    // getting all actions :-
    static async getAllAction(role, offset, limit) {
    // defining query :-
        const query = { action_Id: { $lte: 50 } };

        // modifying the query if the user is not admin :-
        if (role !== 'admin') {
            query.active_Status = true;
        }
        return await Action.find(query).sort({ action_Id: 1 }).skip(offset).limit(limit);
    }

    // getting all actions count :-
    static async getAllActionsCount(role) {
    // defining query :-
        const query = { action_Id: { $lte: 50 } };

        // modifying the query if the user is not admin :-
        if (role !== 'admin') {
            query.active_Status = true;
        }
        return await Action.find(query).countDocuments();
    }

    // getSpecificActionDetails :-
    static async getSpecificActionDetails(id) {
    // defining query :-
        const query = { action_Id: { $eq: id, $lt: 50 }, active_Status: true };
        return await Action.find(query);
    }

    // update actions :-
    static async updateAction(action_Id, body) {
        return await Action.updateOne({ action_Id }, { $set: body });
    }
}

// exporting ActionService :-
module.exports = ActionService;
