// import AuthService :-
const AuthService = require('../services/index');
const auth = require('../../middlewares/auth');

// this function will delete the user/admin/QA :-
const deleteUsers = async (req, res) => {
    try {
    // passing the id to delete the user/admin/QA :-
        const deleteUser = await AuthService.deleteUser(req.params.id);

        // checking the user/QA/admin is registered or not or already deleted :-
        if (deleteUser == null) {
            return res.status(404).send({ message: 'This User/Admin/QA was not Registered or Already Deleted.' });
        }

        // admin cannot delete himself/herself :-
        const { id } = auth(req);
        if (req.params.id === id) {
            return res.status(404).send({ message: 'You Cannot Delete Youself.' });
        }

        // sending response :-
        return res.status(200).send({ success: true, message: `This User/Admin/QA ID - ${req.params.id} has been successfully deleted.` });
    } catch (e) {
    // if error comes sending the error as response as well as print the error in console :-
        console.log(e);
        res.status(500).send({ success: false, exception: e.message });
    }
};

// exporting the deleteUsers :-
module.exports = { deleteUsers };
